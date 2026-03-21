from __future__ import annotations

import time
from pathlib import Path

from Launcher import _PREVIEW_CACHE, detect_doc_type, extract_preview_text


SAMPLES = [
    Path(r"C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder\172452.pdf"),
    Path(r"C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder\178619.pdf"),
    Path(r"C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder\20250924132515308.pdf"),
]


def benchmark_sample(pdf_path: Path) -> None:
    _PREVIEW_CACHE.clear()

    start = time.perf_counter()
    first_detection = detect_doc_type(pdf_path)
    first_seconds = time.perf_counter() - start

    start = time.perf_counter()
    second_detection = detect_doc_type(pdf_path)
    second_seconds = time.perf_counter() - start

    print(pdf_path.name)
    print(f"First detection:  {first_detection.label} in {first_seconds:.3f}s")
    print(f"Second detection: {second_detection.label} in {second_seconds:.6f}s")
    if first_seconds:
        improvement = ((first_seconds - second_seconds) / first_seconds) * 100
        print(f"Cache delta:      {improvement:.1f}%")
    print(f"Cache entries:    {len(_PREVIEW_CACHE)}")
    print(f"Preview chars:    {len(extract_preview_text(pdf_path))}")
    print()


def main() -> None:
    for sample in SAMPLES:
        benchmark_sample(sample)


if __name__ == "__main__":
    main()
