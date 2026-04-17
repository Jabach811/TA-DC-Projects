#!/usr/bin/env python3
"""Extract text from the first page of an image-only PDF via OCR.

Example:
    python extract_first_page_image_pdf_text.py ./scan.pdf
    python extract_first_page_image_pdf_text.py ./scan.pdf -o first_page.txt --dpi 300 --lang eng
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Read an image-only PDF and OCR only the first page."
    )
    parser.add_argument("pdf_path", type=Path, help="Path to the input PDF")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Optional output text file path; prints to stdout when omitted",
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
        help="Tesseract language code(s), e.g. 'eng' or 'eng+spa' (default: eng)",
    )
    return parser.parse_args()


def extract_first_page_text(pdf_path: Path, dpi: int, lang: str) -> str:
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    try:
        from pdf2image import convert_from_path
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "Missing dependency 'pdf2image'. Install with: pip install pdf2image"
        ) from exc

    try:
        import pytesseract
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "Missing dependency 'pytesseract'. Install with: pip install pytesseract"
        ) from exc

    images = convert_from_path(str(pdf_path), dpi=dpi, first_page=1, last_page=1)
    if not images:
        raise RuntimeError("Unable to render the first page from the PDF.")

    text = pytesseract.image_to_string(images[0], lang=lang)
    return text.strip()


def main() -> int:
    args = parse_args()

    try:
        text = extract_first_page_text(args.pdf_path, args.dpi, args.lang)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
        print(f"Saved OCR text to: {args.output}")
    else:
        print(text)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
