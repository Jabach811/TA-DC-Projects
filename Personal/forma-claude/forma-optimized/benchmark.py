"""
benchmark.py  —  Time the original vs optimised extractors on a real PDF.

Usage
─────
    python benchmark.py quote  path/to/file.pdf
    python benchmark.py po     path/to/file.pdf
    python benchmark.py pickup path/to/file.pdf

Each extractor is run once for original and once for optimised.
A warm-up pass is not done — both start cold so the comparison is fair.
Output goes to a temp directory so nothing is written to your data folders.
"""

from __future__ import annotations

import importlib.util
import sys
import tempfile
import time
from pathlib import Path

# ── Path setup ───────────────────────────────────────────────────────────────

HERE   = Path(__file__).resolve().parent          # forma-optimized/
PARENT = HERE.parent                              # Forma - Main Folder/

def _load(name: str, path: Path):
    """Load a Python module from an absolute file path."""
    spec = importlib.util.spec_from_file_location(name, path)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _time(fn, *args, **kwargs) -> tuple[object, float]:
    t0     = time.perf_counter()
    result = fn(*args, **kwargs)
    return result, time.perf_counter() - t0


def _bar(seconds: float, width: int = 40) -> str:
    max_s = 120
    filled = int(min(seconds / max_s, 1.0) * width)
    return "█" * filled + "░" * (width - filled)


# ── Benchmark runners ─────────────────────────────────────────────────────────

def run_quote(pdf: Path) -> None:
    print("\n=== QUOTE EXTRACTOR ===")
    with tempfile.TemporaryDirectory() as tmp:
        # Original
        sys.path.insert(0, str(PARENT))
        orig = _load("orig_quote", PARENT / "quote_extractor.py")
        sys.path.pop(0)
        print("Running ORIGINAL …", flush=True)
        _, t_orig = _time(orig.quotation_extract, str(pdf), tmp)

        # Optimised
        opt = _load("opt_quote", HERE / "quote_extractor.py")
        print("Running OPTIMISED …", flush=True)
        _, t_opt = _time(opt.quotation_extract, str(pdf), tmp)

    _report("quote", t_orig, t_opt)


def run_po(pdf: Path) -> None:
    print("\n=== PO EXTRACTOR ===")
    with tempfile.TemporaryDirectory() as tmp:
        sys.path.insert(0, str(PARENT))
        orig = _load("orig_po", PARENT / "po_extract.py")
        sys.path.pop(0)
        print("Running ORIGINAL …", flush=True)
        _, t_orig = _time(orig.po_extract, str(pdf), tmp)

        opt = _load("opt_po", HERE / "po_extract.py")
        print("Running OPTIMISED …", flush=True)
        _, t_opt = _time(opt.po_extract, str(pdf), tmp)

    _report("po", t_orig, t_opt)


def run_pickup(pdf: Path) -> None:
    print("\n=== CUSTOMER PICK-UP EXTRACTOR ===")
    with tempfile.TemporaryDirectory() as tmp:
        sys.path.insert(0, str(PARENT))
        orig = _load("orig_pickup", PARENT / "customer_pickup.py")
        sys.path.pop(0)
        print("Running ORIGINAL …", flush=True)
        _, t_orig = _time(orig.customer_pickup, str(pdf), tmp)

        opt = _load("opt_pickup", HERE / "customer_pickup.py")
        print("Running OPTIMISED …", flush=True)
        _, t_opt = _time(opt.customer_pickup, str(pdf), tmp)

    _report("pickup", t_orig, t_opt)


def _report(name: str, t_orig: float, t_opt: float) -> None:
    saved   = t_orig - t_opt
    speedup = t_orig / t_opt if t_opt > 0 else float("inf")
    print()
    print(f"  Original   {t_orig:6.1f}s  {_bar(t_orig)}")
    print(f"  Optimised  {t_opt:6.1f}s  {_bar(t_opt)}")
    print()
    if saved > 0:
        print(f"  ✓  {saved:.1f}s saved  ({speedup:.2f}x faster)")
    else:
        print(f"  ~  Results within margin of error ({abs(saved):.1f}s difference)")


# ── CLI ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    extractor = sys.argv[1].lower()
    pdf_path  = Path(sys.argv[2])

    if not pdf_path.exists():
        print(f"ERROR: file not found — {pdf_path}")
        sys.exit(1)

    if extractor == "quote":
        run_quote(pdf_path)
    elif extractor == "po":
        run_po(pdf_path)
    elif extractor in ("pickup", "customer_pickup"):
        run_pickup(pdf_path)
    else:
        print(f"Unknown extractor '{extractor}'. Use: quote | po | pickup")
        sys.exit(1)
