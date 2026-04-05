#!/usr/bin/env python3
"""Read an image-only PDF and extract text from its first page."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="OCR the first page of an image-only PDF."
    )
    parser.add_argument("pdf", type=Path, help="Input PDF path")
    parser.add_argument("-o", "--output", type=Path, help="Optional output text file")
    parser.add_argument("--dpi", type=int, default=300, help="Rasterization DPI")
    parser.add_argument("--lang", default="eng", help="Tesseract language (default: eng)")
    return parser.parse_args()


def read_first_page(pdf: Path, dpi: int = 300, lang: str = "eng") -> str:
    if not pdf.exists():
        raise FileNotFoundError(f"Missing PDF: {pdf}")

    try:
        from pdf2image import convert_from_path
        import pytesseract
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "Install dependencies first: pip install pdf2image pytesseract"
        ) from exc

    images = convert_from_path(str(pdf), first_page=1, last_page=1, dpi=dpi)
    if not images:
        raise RuntimeError("Could not render first page.")

    return pytesseract.image_to_string(images[0], lang=lang).strip()


def main() -> int:
    args = parse_args()
    try:
        text = read_first_page(args.pdf, dpi=args.dpi, lang=args.lang)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
        print(f"Wrote OCR output to {args.output}")
    else:
        print(text)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
