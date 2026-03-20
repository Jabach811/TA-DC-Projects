#!/usr/bin/env python3
"""
Extract text from the first page of an image-only PDF using OCR.

Requirements:
  pip install pymupdf pillow pytesseract
  # and install Tesseract OCR on your system:
  # macOS:   brew install tesseract
  # Ubuntu:  sudo apt-get install tesseract-ocr
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def extract_first_page_text(pdf_path: Path, dpi: int = 300, lang: str = "eng") -> str:
    """Render page 1 to an image and OCR it."""
    try:
        import fitz  # PyMuPDF
        import pytesseract
        from PIL import Image
    except ImportError as exc:
        raise RuntimeError(
            "Missing dependency. Install with: pip install pymupdf pillow pytesseract"
        ) from exc

    if not pdf_path.exists() or not pdf_path.is_file():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    with fitz.open(pdf_path) as doc:
        if len(doc) == 0:
            raise ValueError("PDF has no pages.")

        page = doc[0]
        zoom = dpi / 72.0
        matrix = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=matrix, alpha=False)

    image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    text = pytesseract.image_to_string(image, lang=lang)
    return text.strip()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="OCR the first page of an image-only PDF and print/save extracted text."
    )
    parser.add_argument("pdf", type=Path, help="Path to input PDF")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Optional output .txt file path. If omitted, prints to stdout.",
    )
    parser.add_argument(
        "--dpi",
        type=int,
        default=300,
        help="Render DPI for OCR quality (default: 300).",
    )
    parser.add_argument(
        "--lang",
        default="eng",
        help="Tesseract language code (default: eng).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        text = extract_first_page_text(args.pdf, dpi=args.dpi, lang=args.lang)
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
