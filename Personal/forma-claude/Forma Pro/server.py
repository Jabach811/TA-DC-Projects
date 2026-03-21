"""
Forma Pro — Flask Server
Extended version with SQLite repo, batch processing, and analytics.
Runs on port 5176. Original app stays untouched on 5175.
"""
from __future__ import annotations
import sys
import os
import time
import json
import glob
import uuid
import threading
import traceback
from pathlib import Path

PARENT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PARENT_DIR))

from flask import Flask, request, jsonify, send_from_directory
import tkinter as tk
from tkinter import filedialog
import repo

app = Flask(__name__, static_folder=str(Path(__file__).parent), static_url_path="")

ROOT_CONFIG = PARENT_DIR / "root_config.txt"

# In-memory batch job store
BATCH_JOBS: dict[str, dict] = {}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_output_root() -> str:
    if ROOT_CONFIG.exists():
        content = ROOT_CONFIG.read_text(encoding="utf-8").strip()
        if content:
            return content
    return str(Path.home() / "Documents" / "Hipco")


def set_output_root(path: str) -> None:
    ROOT_CONFIG.write_text(path, encoding="utf-8")


def _find_newest_xlsx(base_dir: str | Path, since: float) -> str | None:
    pattern = str(Path(base_dir) / "**" / "*.xlsx")
    candidates = [
        f for f in glob.glob(pattern, recursive=True)
        if os.path.getmtime(f) >= since - 1
    ]
    return max(candidates, key=os.path.getmtime) if candidates else None


SIGNATURES = {
    "quote": {
        "primary":   [("QUOTATION #", 4), ("QUOTE DATE", 4), ("EXP DATE", 4)],
        "secondary": [("QUOTATION", 2), ("VALID FOR", 2), ("QUOTE TOTAL", 2)],
        "negative":  [("PURCHASE ORDER", -2), ("PICK TICKET", -2)],
    },
    "po": {
        "primary":   [("PURCHASE ORDER", 4), ("PO-DATE", 4), ("FREIGHT TERMS", 4)],
        "secondary": [("CUSTOMER PO #", 2), ("REQ DATE", 2), ("VENDOR", 2), ("BILL TO", 2)],
        "negative":  [("QUOTATION#", -2), ("PICK TICKET", -2)],
    },
    "invoice": {
        "primary":   [("CUSTOMER PICK-UP", 4), ("PICK TICKET", 4), ("INVOICE #", 4)],
        "secondary": [("NON-RETURNABLE", 2), ("WILL CALL", 2), ("ITEMS MAY NOT", 2)],
        "negative":  [("QUOTATION #", -2), ("QUOTE DATE", -2)],
    },
}

TYPE_LABELS = {"quote": "Quotation", "po": "Purchase Order", "invoice": "Pick-up Ticket"}


def _detect_from_text(text: str) -> dict:
    upper = text.upper()
    scores = {}
    for doc_type, sigs in SIGNATURES.items():
        score = sum(
            w for kw, w in sigs["primary"] + sigs["secondary"] + sigs["negative"]
            if kw.upper() in upper
        )
        scores[doc_type] = score
    best       = max(scores, key=scores.get)
    best_score = scores[best]
    confidence = "strong" if best_score >= 8 else "moderate" if best_score >= 4 else "low"
    return {"type": best, "label": TYPE_LABELS[best], "confidence": confidence}


def _run_extraction(pdf_path: str, doc_type: str, output_root: str, mode: str) -> dict:
    """Run a single extraction. Returns dict with ok, path, name, folder."""
    before = time.time()
    try:
        if doc_type == "quote":
            from quote_extractor import quotation_extract
            quotation_extract(pdf_path, output_root)
            result_path = _find_newest_xlsx(output_root, before)
        elif doc_type == "po":
            from po_extract import po_extract
            result_path = str(po_extract(pdf_path, output_root))
        elif doc_type == "invoice":
            from customer_pickup import customer_pickup
            result_path = str(customer_pickup(pdf_path, Path(output_root)))
        else:
            return {"ok": False, "error": f"Unknown type: {doc_type}"}

        if not result_path:
            return {"ok": False, "error": "Extraction completed but no output file found."}

        # Log to repo
        extraction_id = repo.log_from_xlsx(result_path, doc_type, pdf_path, mode)

        # If populate-only mode, we still keep the file but flag it
        return {
            "ok":           True,
            "path":         result_path,
            "name":         Path(result_path).name,
            "folder":       str(Path(result_path).parent),
            "extraction_id": extraction_id,
        }
    except Exception as e:
        return {"ok": False, "error": str(e), "trace": traceback.format_exc()}


# ---------------------------------------------------------------------------
# Static / index
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    return send_from_directory(str(Path(__file__).parent), "app.html")


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

@app.route("/api/config", methods=["GET"])
def api_get_config():
    return jsonify({"output_root": get_output_root()})


@app.route("/api/config", methods=["POST"])
def api_set_config():
    data = request.json or {}
    new_root = data.get("output_root", "").strip()
    if new_root:
        set_output_root(new_root)
        return jsonify({"ok": True})
    return jsonify({"ok": False, "error": "No path provided"}), 400


# ---------------------------------------------------------------------------
# File dialogs
# ---------------------------------------------------------------------------

@app.route("/api/browse-pdf", methods=["POST"])
def api_browse_pdf():
    root = tk.Tk(); root.withdraw(); root.attributes("-topmost", True)
    path = filedialog.askopenfilename(
        title="Select PDF",
        filetypes=[("PDF files", "*.pdf"), ("All files", "*.*")],
    )
    root.destroy()
    return jsonify({"ok": bool(path), "path": path or ""})


@app.route("/api/browse-pdfs", methods=["POST"])
def api_browse_pdfs():
    """Multi-select PDF picker for batch mode."""
    root = tk.Tk(); root.withdraw(); root.attributes("-topmost", True)
    paths = filedialog.askopenfilenames(
        title="Select PDFs for Batch Processing",
        filetypes=[("PDF files", "*.pdf"), ("All files", "*.*")],
    )
    root.destroy()
    return jsonify({"ok": bool(paths), "paths": list(paths)})


@app.route("/api/browse-folder", methods=["POST"])
def api_browse_folder():
    root = tk.Tk(); root.withdraw(); root.attributes("-topmost", True)
    path = filedialog.askdirectory(title="Select Output Folder")
    root.destroy()
    return jsonify({"ok": bool(path), "path": path or ""})


# ---------------------------------------------------------------------------
# Detect / Extract (single file — same as original)
# ---------------------------------------------------------------------------

@app.route("/api/detect", methods=["POST"])
def api_detect():
    data = request.json or {}
    pdf_path = data.get("path", "").strip()
    if not Path(pdf_path).exists():
        return jsonify({"ok": False, "error": "File not found"}), 400
    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join((p.extract_text() or "") for p in pdf.pages[:3])
        return jsonify({"ok": True, **_detect_from_text(text)})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/extract", methods=["POST"])
def api_extract():
    data        = request.json or {}
    pdf_path    = data.get("path", "").strip()
    doc_type    = data.get("type", "").strip()
    output_root = data.get("output_root", "").strip() or get_output_root()
    mode        = data.get("mode", "extract")

    if not Path(pdf_path).exists():
        return jsonify({"ok": False, "error": "PDF file not found"}), 400
    if doc_type not in ("quote", "po", "invoice"):
        return jsonify({"ok": False, "error": f"Unknown type: {doc_type}"}), 400

    result = _run_extraction(pdf_path, doc_type, output_root, mode)
    return jsonify(result), 200 if result["ok"] else 500


# ---------------------------------------------------------------------------
# Batch processing
# ---------------------------------------------------------------------------

def _run_batch_job(job_id: str, files: list[dict], output_root: str, mode: str):
    """Background thread for batch processing."""
    job = BATCH_JOBS[job_id]
    job["status"] = "running"

    for i, f in enumerate(files):
        pdf_path = f["path"]
        doc_type = f.get("type")
        job["current"] = i
        job["current_file"] = Path(pdf_path).name

        # Auto-detect if no type given
        if not doc_type or doc_type == "auto":
            try:
                import pdfplumber
                with pdfplumber.open(pdf_path) as pdf:
                    text = "\n".join((p.extract_text() or "") for p in pdf.pages[:3])
                detected = _detect_from_text(text)
                doc_type = detected["type"]
            except Exception:
                doc_type = "quote"  # fallback

        result = _run_extraction(pdf_path, doc_type, output_root, mode)
        result["file"] = Path(pdf_path).name
        result["doc_type"] = doc_type
        job["results"].append(result)

    job["status"] = "done"
    job["current"] = len(files)
    job["current_file"] = ""


@app.route("/api/batch/start", methods=["POST"])
def api_batch_start():
    data        = request.json or {}
    files       = data.get("files", [])   # [{path, type?}, ...]
    output_root = data.get("output_root", "").strip() or get_output_root()
    mode        = data.get("mode", "extract")

    if not files:
        return jsonify({"ok": False, "error": "No files provided"}), 400

    job_id = str(uuid.uuid4())[:8]
    BATCH_JOBS[job_id] = {
        "status":       "queued",
        "total":        len(files),
        "current":      0,
        "current_file": "",
        "results":      [],
    }

    t = threading.Thread(
        target=_run_batch_job,
        args=(job_id, files, output_root, mode),
        daemon=True,
    )
    t.start()

    return jsonify({"ok": True, "job_id": job_id})


@app.route("/api/batch/status/<job_id>", methods=["GET"])
def api_batch_status(job_id: str):
    job = BATCH_JOBS.get(job_id)
    if not job:
        return jsonify({"ok": False, "error": "Job not found"}), 404
    return jsonify({"ok": True, **job})


# ---------------------------------------------------------------------------
# Repo API
# ---------------------------------------------------------------------------

@app.route("/api/repo/stats", methods=["GET"])
def api_stats():
    return jsonify(repo.get_stats())


@app.route("/api/repo/recent", methods=["GET"])
def api_recent():
    limit = int(request.args.get("limit", 15))
    return jsonify(repo.get_recent(limit))


@app.route("/api/repo/extractions", methods=["GET"])
def api_extractions():
    doc_type = request.args.get("type", "")
    customer = request.args.get("customer", "")
    limit    = int(request.args.get("limit", 50))
    offset   = int(request.args.get("offset", 0))
    return jsonify(repo.get_all_extractions(doc_type or None, customer or None, limit, offset))


@app.route("/api/repo/extraction/<int:eid>", methods=["GET"])
def api_extraction(eid: int):
    data = repo.get_extraction(eid)
    if not data:
        return jsonify({"ok": False, "error": "Not found"}), 404
    return jsonify(data)


@app.route("/api/repo/extraction/<int:eid>", methods=["DELETE"])
def api_delete_extraction(eid: int):
    repo.delete_extraction(eid)
    return jsonify({"ok": True})


@app.route("/api/repo/customers", methods=["GET"])
def api_customers():
    return jsonify(repo.get_customers())


@app.route("/api/repo/customer/<path:name>", methods=["GET"])
def api_customer(name: str):
    return jsonify(repo.get_customer_extractions(name))


@app.route("/api/repo/products", methods=["GET"])
def api_products():
    limit = int(request.args.get("limit", 20))
    return jsonify(repo.get_top_products(limit))


# ---------------------------------------------------------------------------
# Open file/folder
# ---------------------------------------------------------------------------

@app.route("/api/open", methods=["POST"])
def api_open():
    data        = request.json or {}
    path        = data.get("path", "").strip()
    folder_only = data.get("folder", False)
    p      = Path(path)
    target = p.parent if (folder_only and p.is_file()) else p
    if target.exists():
        os.startfile(str(target))
        return jsonify({"ok": True})
    return jsonify({"ok": False, "error": f"Path not found: {target}"}), 404


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import webbrowser
    repo.init_db()

    def _open():
        time.sleep(1.2)
        webbrowser.open("http://localhost:5176")

    threading.Thread(target=_open, daemon=True).start()
    print("=" * 52)
    print("  Forma Pro running at http://localhost:5176")
    print("  Original app still available at  :5175")
    print("  Close this window to stop the server.")
    print("=" * 52)
    app.run(port=5176, debug=False, use_reloader=False)
