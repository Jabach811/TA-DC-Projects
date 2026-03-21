from __future__ import annotations

import shutil
import time
from pathlib import Path

from Launcher import detect_doc_type
from customer_pickup import customer_pickup
from ocr_service import clear_ocr_caches, get_ocr_bundle
from po_extract import po_extract
from quote_extractor import quotation_extract


ROOT = Path(__file__).resolve().parent
SOURCE_ROOT = Path(r"C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder")
OUTPUT_ROOT = ROOT / "benchmark-shared-ocr-output"

SAMPLES = [
    ("Quote", SOURCE_ROOT / "172452.pdf", quotation_extract),
    ("PO", SOURCE_ROOT / "178619.pdf", po_extract),
    ("Invoice", SOURCE_ROOT / "20250924132515308.pdf", customer_pickup),
]


def reset_output_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def benchmark_case(label: str, pdf_path: Path, extractor) -> None:
    no_share_dir = OUTPUT_ROOT / "no-share" / label.lower()
    shared_dir = OUTPUT_ROOT / "shared" / label.lower()

    clear_ocr_caches()
    reset_output_dir(no_share_dir)
    start = time.perf_counter()
    detection = detect_doc_type(pdf_path)
    extractor(str(pdf_path), output_root=str(no_share_dir))
    no_share_seconds = time.perf_counter() - start

    clear_ocr_caches()
    reset_output_dir(shared_dir)
    start = time.perf_counter()
    bundle = get_ocr_bundle(pdf_path)
    shared_detection = detect_doc_type(pdf_path)
    extractor(str(pdf_path), output_root=str(shared_dir), ocr_bundle=bundle)
    shared_seconds = time.perf_counter() - start

    print(label, pdf_path.name)
    print(f"No-share detect: {detection.label}")
    print(f"Shared detect:   {shared_detection.label}")
    print(f"No-share time:   {no_share_seconds:.2f}s")
    print(f"Shared time:     {shared_seconds:.2f}s")
    if no_share_seconds:
        improvement = ((no_share_seconds - shared_seconds) / no_share_seconds) * 100
        print(f"Runtime delta:   {improvement:.1f}%")
    print()


def main() -> None:
    for label, pdf_path, extractor in SAMPLES:
        benchmark_case(label, pdf_path, extractor)


if __name__ == "__main__":
    main()
