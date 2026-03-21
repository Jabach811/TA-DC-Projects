from __future__ import annotations

import time
from pathlib import Path

from po_extract import po_extract
from quote_extractor import quotation_extract


APP_ROOT = Path(__file__).resolve().parent
SOURCE_ROOT = Path(r"C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder")
OUTPUT_ROOT = APP_ROOT / "test-output"


def run_test(label: str, func, pdf_name: str) -> None:
    pdf_path = SOURCE_ROOT / pdf_name
    target_root = OUTPUT_ROOT / label.lower().replace(" ", "-")
    target_root.mkdir(parents=True, exist_ok=True)

    start = time.perf_counter()
    output_path = func(str(pdf_path), output_root=str(target_root))
    elapsed = time.perf_counter() - start

    print(f"{label}: {pdf_name}")
    print(f"Output: {output_path}")
    print(f"Time:   {elapsed:.2f}s")
    print()


def main() -> None:
    run_test("Quote", quotation_extract, "172452.pdf")
    run_test("PO", po_extract, "178619.pdf")


if __name__ == "__main__":
    main()
