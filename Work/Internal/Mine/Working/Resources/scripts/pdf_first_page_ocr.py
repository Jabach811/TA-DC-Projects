#!/usr/bin/env python3
"""Extract text from the first page of an image-only PDF using OCR.

Usage:
    python pdf_first_page_ocr.py input.pdf
    python pdf_first_page_ocr.py input.pdf --output first_page.txt
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Read an image-only PDF and extract OCR text from page 1."
    )
    parser.add_argument("pdf", type=Path, help="Path to the PDF file")
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        help="Optional path to save extracted text. Defaults to stdout.",
    )
    parser.add_argument(
        "--dpi",
        type=int,
        default=300,
        help="Rasterization DPI for OCR quality (default: 300)",
    )
    parser.add_argument(
        "--lang",
        default="eng",
        help="Tesseract language code(s), e.g. eng or eng+spa (default: eng)",
    )
    return parser.parse_args()


def ocr_first_page(pdf_path: Path, dpi: int, lang: str) -> str:
    try:
        from pdf2image import convert_from_path
    except Exception as exc:
        raise RuntimeError(
            "Missing dependency: pdf2image. Install with `pip install pdf2image`."
        ) from exc

    try:
        import pytesseract
    except Exception as exc:
        raise RuntimeError(
            "Missing dependency: pytesseract. Install with `pip install pytesseract`."
        ) from exc

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    images = convert_from_path(str(pdf_path), dpi=dpi, first_page=1, last_page=1)
    if not images:
        raise RuntimeError("Could not rasterize the first page from the PDF.")

    text = pytesseract.image_to_string(images[0], lang=lang)
    return text.strip()


def main() -> int:
    args = parse_args()

    try:
        text = ocr_first_page(args.pdf, args.dpi, args.lang)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
        print(f"Saved OCR text to {args.output}")
    else:
        print(text)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
