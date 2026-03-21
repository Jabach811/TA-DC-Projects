from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re

from pdf2image import convert_from_path
import pytesseract

from config import POPPLER_PATH, TESSERACT_PATH


PREVIEW_PAGE_LIMIT = 2


@dataclass(slots=True)
class OCRBundle:
    source_key: tuple[str, int, int]
    preview_text: str
    all_lines: list[str]
    all_text_with_page: list[tuple[str, int]]
    page_line_map: dict[int, list[str]]


_BUNDLE_CACHE: dict[str, OCRBundle] = {}
_PREVIEW_CACHE: dict[str, tuple[tuple[str, int, int], str]] = {}


def _file_key(pdf_path: Path) -> tuple[str, int, int]:
    stat = pdf_path.stat()
    return (str(pdf_path.resolve()), stat.st_mtime_ns, stat.st_size)


def _normalize_preview_text(lines: list[str]) -> str:
    return re.sub(r"\s+", " ", " ".join(lines)).upper()


def get_preview_text(pdf_path: str | Path) -> str:
    resolved = Path(pdf_path).resolve()
    source_key = _file_key(resolved)
    cached = _PREVIEW_CACHE.get(str(resolved))
    if cached and cached[0] == source_key:
        return cached[1]

    pytesseract.pytesseract.tesseract_cmd = str(TESSERACT_PATH)
    images = convert_from_path(
        str(resolved),
        dpi=300,
        poppler_path=str(POPPLER_PATH),
        first_page=1,
        last_page=PREVIEW_PAGE_LIMIT,
    )
    lines: list[str] = []
    for image in images:
        text = pytesseract.image_to_string(image, config="--oem 3 --psm 6")
        lines.extend(segment.strip() for segment in text.splitlines() if segment.strip())

    preview_text = _normalize_preview_text(lines)
    _PREVIEW_CACHE[str(resolved)] = (source_key, preview_text)
    return preview_text


def get_ocr_bundle(pdf_path: str | Path) -> OCRBundle:
    resolved = Path(pdf_path).resolve()
    source_key = _file_key(resolved)
    cached = _BUNDLE_CACHE.get(str(resolved))
    if cached and cached.source_key == source_key:
        return cached

    pytesseract.pytesseract.tesseract_cmd = str(TESSERACT_PATH)
    images = convert_from_path(str(resolved), dpi=300, poppler_path=str(POPPLER_PATH))
    all_lines: list[str] = []
    all_text_with_page: list[tuple[str, int]] = []
    page_line_map: dict[int, list[str]] = {}

    for page_num, image in enumerate(images, start=1):
        print(f"Processing page {page_num}...")
        text = pytesseract.image_to_string(image, config="--oem 3 --psm 6")
        lines = [segment.strip() for segment in text.splitlines() if segment.strip()]
        page_line_map[page_num] = lines
        all_lines.extend(lines)
        all_text_with_page.extend((line, page_num) for line in lines)

    preview_lines: list[str] = []
    for page_num in range(1, PREVIEW_PAGE_LIMIT + 1):
        preview_lines.extend(page_line_map.get(page_num, []))
    preview_text = _normalize_preview_text(preview_lines)

    bundle = OCRBundle(
        source_key=source_key,
        preview_text=preview_text,
        all_lines=all_lines,
        all_text_with_page=all_text_with_page,
        page_line_map=page_line_map,
    )
    _BUNDLE_CACHE[str(resolved)] = bundle
    _PREVIEW_CACHE[str(resolved)] = (source_key, preview_text)
    return bundle


def clear_ocr_caches() -> None:
    _BUNDLE_CACHE.clear()
    _PREVIEW_CACHE.clear()
