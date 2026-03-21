"""
Forma Web Server
Flask backend that bridges the HTML frontend to the Python PDF extractors.
"""
from __future__ import annotations
import sys
import os
import time
import json
import glob
import traceback
from pathlib import Path

# Add parent dir so we can import config + extractors
PARENT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PARENT_DIR))

from flask import Flask, request, jsonify, send_from_directory
import tkinter as tk
from tkinter import filedialog

app = Flask(__name__, static_folder=str(Path(__file__).parent), static_url_path="")

ROOT_CONFIG = PARENT_DIR / "root_config.txt"


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
    """Return path of the most-recently modified xlsx created after `since`."""
    pattern = str(Path(base_dir) / "**" / "*.xlsx")
    candidates = [
        f for f in glob.glob(pattern, recursive=True)
        if os.path.getmtime(f) >= since - 1
    ]
    if not candidates:
        return None
    return max(candidates, key=os.path.getmtime)


# ---------------------------------------------------------------------------
# Document-type auto-detection (matches Launcher.py logic)
# ---------------------------------------------------------------------------

SIGNATURES: dict = {
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
    scores: dict[str, int] = {}
    for doc_type, sigs in SIGNATURES.items():
        score = 0
        for kw, w in sigs["primary"] + sigs["secondary"] + sigs["negative"]:
            if kw.upper() in upper:
                score += w
        scores[doc_type] = score

    best = max(scores, key=scores.get)
    best_score = scores[best]

    if best_score >= 8:
        confidence = "strong"
    elif best_score >= 4:
        confidence = "moderate"
    else:
        confidence = "low"

    return {"type": best, "label": TYPE_LABELS[best], "confidence": confidence, "scores": scores}


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    return send_from_directory(str(Path(__file__).parent), "index.html")


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


@app.route("/api/browse-pdf", methods=["POST"])
def api_browse_pdf():
    """Open a native file-picker dialog and return the selected PDF path."""
    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)
    path = filedialog.askopenfilename(
        title="Select PDF",
        filetypes=[("PDF files", "*.pdf"), ("All files", "*.*")],
    )
    root.destroy()
    if path:
        return jsonify({"ok": True, "path": path})
    return jsonify({"ok": False, "path": ""})


@app.route("/api/browse-folder", methods=["POST"])
def api_browse_folder():
    """Open a native folder-picker dialog and return the selected path."""
    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)
    path = filedialog.askdirectory(title="Select Output Folder")
    root.destroy()
    if path:
        return jsonify({"ok": True, "path": path})
    return jsonify({"ok": False, "path": ""})


@app.route("/api/detect", methods=["POST"])
def api_detect():
    data = request.json or {}
    pdf_path = data.get("path", "").strip()
    if not Path(pdf_path).exists():
        return jsonify({"ok": False, "error": "File not found"}), 400

    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join(
                (page.extract_text() or "") for page in pdf.pages[:3]
            )
        result = _detect_from_text(text)
        return jsonify({"ok": True, **result})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/extract", methods=["POST"])
def api_extract():
    data = request.json or {}
    pdf_path   = data.get("path", "").strip()
    doc_type   = data.get("type", "").strip()
    output_root = data.get("output_root", "").strip() or get_output_root()

    if not Path(pdf_path).exists():
        return jsonify({"ok": False, "error": "PDF file not found"}), 400
    if doc_type not in ("quote", "po", "invoice"):
        return jsonify({"ok": False, "error": f"Unknown document type: {doc_type}"}), 400

    try:
        before = time.time()

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

        if not result_path:
            return jsonify({"ok": False, "error": "Extraction completed but no output file found. Check the output folder."})

        return jsonify({
            "ok":   True,
            "path": result_path,
            "name": Path(result_path).name,
            "folder": str(Path(result_path).parent),
        })

    except Exception as e:
        return jsonify({
            "ok":    False,
            "error": str(e),
            "trace": traceback.format_exc(),
        }), 500


@app.route("/api/open", methods=["POST"])
def api_open():
    data = request.json or {}
    path = data.get("path", "").strip()
    folder_only = data.get("folder", False)

    p = Path(path)
    target = p.parent if (folder_only and p.is_file()) else p

    if target.exists():
        os.startfile(str(target))
        return jsonify({"ok": True})
    return jsonify({"ok": False, "error": f"Path not found: {target}"}), 404


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import webbrowser, threading

    def open_browser():
        time.sleep(1.2)
        webbrowser.open("http://localhost:5175")

    threading.Thread(target=open_browser, daemon=True).start()
    print("=" * 50)
    print("  Forma is running at http://localhost:5175")
    print("  Close this window to stop the server.")
    print("=" * 50)
    app.run(port=5175, debug=False, use_reloader=False)
