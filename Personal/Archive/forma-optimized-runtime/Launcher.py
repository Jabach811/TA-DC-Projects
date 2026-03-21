# ==========================================
# ==============  Launcher.py  =============
# Forma â€” Harrington Sales Tracker
# GUI launcher: splash, main UI, licensing,
# config menu, and document extraction.
# ==========================================

from __future__ import annotations

# --- Standard libs
import json
import re
import threading
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass

# --- UI / Imaging
import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
from PIL import Image, ImageTk

# --- PDF / OCR
import pytesseract

# --- App config + extractors
from config import (
    APP_ROOT,
    TESSERACT_PATH,
    SPLASH_IMAGE,
    MAIN_UI_IMAGE,
    INITIAL_FOLDER_IMAGE,
    CONFIGURE_IMAGE,
    USER_DATA_ROOT,
    ensure_dir,
)
from quote_extractor import quotation_extract
from po_extract import po_extract
from customer_pickup import customer_pickup
from ocr_service import get_ocr_bundle, get_preview_text


# ==========================================
# ==============  CONSTANTS  ===============
# ==========================================

# Where we store the user-selected root folder
CONFIG_FILE = (APP_ROOT / "root_config.txt").resolve()

# Trial / licensing
LICENSE_CONFIG_FILE = (APP_ROOT / "license_config.json").resolve()
TRIAL_LENGTH_DAYS = 530

# OCR binary
pytesseract.pytesseract.tesseract_cmd = str(TESSERACT_PATH)


# ==========================================
# ============  LICENSE HELPERS  ===========
# ==========================================

def is_trial_expired() -> bool:
    """
    True  -> trial is over (block app)
    False -> trial still valid (launch app)
    Creates license_config.json on first run.
    """
    today = datetime.today().date()

    if not LICENSE_CONFIG_FILE.exists():
        # First launch â€“ start trial today
        trial_data = {"trial_start": today.isoformat()}
        LICENSE_CONFIG_FILE.write_text(json.dumps(trial_data), encoding="utf-8")
        return False

    try:
        trial_data = json.loads(LICENSE_CONFIG_FILE.read_text(encoding="utf-8"))
        start_str = trial_data.get("trial_start")
        if not start_str:
            return True  # invalid config -> block
        start_date = datetime.fromisoformat(start_str).date()
        return today > (start_date + timedelta(days=TRIAL_LENGTH_DAYS))
    except Exception:
        # Corrupt / unreadable config -> block
        return True


def get_trial_days_remaining() -> int:
    """
    Returns an int: days remaining in trial.
    Returns 0 if expired or invalid.
    """
    if not LICENSE_CONFIG_FILE.exists():
        return TRIAL_LENGTH_DAYS

    try:
        trial_data = json.loads(LICENSE_CONFIG_FILE.read_text(encoding="utf-8"))
        start_date = datetime.fromisoformat(trial_data["trial_start"]).date()
        end_date = start_date + timedelta(days=TRIAL_LENGTH_DAYS)
        remaining = (end_date - datetime.today().date()).days
        return max(0, remaining)
    except Exception:
        return 0


# ==========================================
# ============  CONFIG MENU (UI) ===========
# ==========================================

def show_configure_menu(parent: tk.Tk, root_var: tk.StringVar) -> None:
    """
    Floating, always-on-top Configure window with a background image.
    Lets the user re-pick their root folder and confirms the path.
    """
    win = tk.Toplevel(parent)
    win.title("Configure Root Folder")
    win.resizable(False, False)
  




    if not CONFIGURE_IMAGE.exists():
        messagebox.showerror("Error", "Config background image not found.")
        win.destroy()
        return

    # Load + scale background image
    img = Image.open(CONFIGURE_IMAGE)
    scale_factor = 1.25  # tweak as desired (e.g., 1.5)
    orig_w, orig_h = img.size
    width, height = int(orig_w * scale_factor), int(orig_h * scale_factor)
    img = img.resize((width, height), Image.Resampling.LANCZOS)

    # Size the window to the background
    win.geometry(f"{width}x{height}")

    # Canvas + background
    bg_photo = ImageTk.PhotoImage(img)
    canvas = tk.Canvas(win, width=width, height=height, highlightthickness=0, bd=0)
    canvas.pack()
    canvas.create_image(0, 0, anchor="nw", image=bg_photo)
    # keep ref
    win.bg_photo = bg_photo

    # Readonly entry to show the current root
    entry = tk.Entry(
        win,
        textvariable=root_var,
        font=("Segoe UI", 14),
        width=46,
        state="readonly",
        readonlybackground="white",
        bd=0,
        relief="flat",
        highlightthickness=0,
    )
    # Position to fit your artwork
    entry.place(x=450, y=185)

    # Folder picker
    def update_root():
        folder = filedialog.askdirectory(title="Select Root Folder")
        if folder:
            CONFIG_FILE.write_text(folder.strip(), encoding="utf-8")
            root_var.set(folder)

    set_btn = tk.Button(
        win,
        text="Choose Folder",
        command=update_root,
        font=("Segoe UI", 14),
        bg="#E8E8E8",
        relief="flat",
    )
    set_btn.place(x=40, y=180)

    ok_btn = tk.Button(
        win,
        text="OK",
        command=win.destroy,
        font=("Segoe UI", 14, "bold"),
        bg="#E8E8E8",
        relief="flat",
        width=10,
    )
    ok_btn.place(x=400, y=490)


# ==========================================
# =========  FIRST-RUN FOLDER SETUP  =======
# ==========================================

def show_folder_setup_screen() -> None:
    """
    First-run screen to capture the user's root folder.
    """
    setup = tk.Tk()
    setup.title("Initial Folder Select")
    setup.resizable(False, False)

    if not INITIAL_FOLDER_IMAGE.exists():
        messagebox.showerror("Error", "Setup image not found.")
        setup.destroy()
        return

    img = Image.open(INITIAL_FOLDER_IMAGE)
    width, height = img.size  # no scaling by default
    bg = ImageTk.PhotoImage(img)

    # Center the window
    x = (setup.winfo_screenwidth() - width) // 2
    y = (setup.winfo_screenheight() - height) // 2
    setup.geometry(f"{width}x{height}+{x}+{y}")

    canvas = tk.Canvas(setup, width=width, height=height, highlightthickness=0, bd=0)
    canvas.pack()
    canvas.create_image(0, 0, anchor="nw", image=bg)
    setup.bg = bg

    def choose_folder():
        folder = filedialog.askdirectory(title="Select Root Folder")
        if not folder:
            messagebox.showerror("Cancelled", "No folder selected.")
            setup.destroy()
            return
        CONFIG_FILE.write_text(folder.strip(), encoding="utf-8")
        setup.destroy()
        show_main()

    btn = tk.Button(
        setup,
        text="Select Folder",
        command=choose_folder,
        font=("Segoe UI", 14),
        bg="white",
        fg="black",
        relief="flat",
        width=20,
    )
    # Position to fit your art
    btn.place(x=width // 2 - 115, y=height - 185)

    setup.mainloop()


# ==========================================
# ===============  SPLASH  =================
# ==========================================

def show_splash() -> None:
    """
    Splash screen with timed transition to first-run or main UI.
    """
    splash = tk.Tk()
    splash.overrideredirect(True)

    if not SPLASH_IMAGE.exists():
        messagebox.showerror("Error", "Splash image not found.")
        splash.destroy()
        return

    img = Image.open(SPLASH_IMAGE)

    # Scale to taste
    scale_factor = 1.25
    ow, oh = img.size
    width, height = int(ow * scale_factor), int(oh * scale_factor)
    img = img.resize((width, height), Image.Resampling.LANCZOS)

    # Center window
    screen_w = splash.winfo_screenwidth()
    screen_h = splash.winfo_screenheight()
    x = (screen_w // 2) - (width // 2)
    y = (screen_h // 2) - (height // 2)
    splash.geometry(f"{width}x{height}+{x}+{y}")

    photo = ImageTk.PhotoImage(img)
    canvas = tk.Canvas(splash, width=width, height=height, highlightthickness=0, bd=0)
    canvas.pack()
    canvas.create_image(0, 0, anchor="nw", image=photo)
    splash.bg = photo

    def proceed():
        splash.destroy()
        # First-run flow if not set
        if not CONFIG_FILE.exists() or CONFIG_FILE.read_text().strip().lower() == "no folder selected yet":
            show_folder_setup_screen()
        else:
            show_main()

    splash.after(5000, proceed)
    splash.mainloop()


# ==========================================
# ===== DOCUMENT TYPE DETECTION ============
# ==========================================

@dataclass
class DocumentDetection:
    label: str
    confidence: int
    scores: dict[str, int]
    keyword_hits: dict[str, list[str]]

    def ranked(self) -> list[tuple[str, int]]:
        return sorted(self.scores.items(), key=lambda item: item[1], reverse=True)


PRIMARY_WEIGHT = 4
SECONDARY_WEIGHT = 2
NEGATIVE_WEIGHT = 2
STRONG_MATCH_THRESHOLD = PRIMARY_WEIGHT
MODERATE_MATCH_THRESHOLD = 2

def _compile_signature(pairs: list[tuple[str, str]]) -> tuple[tuple[re.Pattern, str], ...]:
    return tuple((re.compile(pattern, re.IGNORECASE), label) for pattern, label in pairs)


DOC_SIGNATURES: dict[str, dict[str, tuple[tuple[re.Pattern, str], ...]]] = {
    "Quote": {
        "primary": _compile_signature([
            (r"\bQUOTATION\s*#\b", "QUOTATION#"),
            (r"\bQUOTE\s+DATE\b", "QUOTE DATE"),
            (r"\bEXP\s*DATE\b", "EXP DATE"),
        ]),
        "secondary": _compile_signature([
            (r"\bQUOTATION\b", "QUOTATION"),
            (r"\bVALID\s+FOR\b", "VALID FOR"),
            (r"\bQUOTE\s+TOTAL\b", "QUOTE TOTAL"),
            (r"\bQUOTE\s*#", "QUOTE #"),
        ]),
        "negative": _compile_signature([
          #  (r"\bPURCHASE\s+ORDER\b", "PURCHASE ORDER"),
            (r"\bPICK\s*TICKET\b", "PICK TICKET"),
            (r"\bCUSTOMER\s+PICK[-\s]?UP\b", "CUSTOMER PICK-UP"),
        ]),
    },
    "PO": {
        "primary": _compile_signature([
            (r"\bPURCHASE\s+ORDER\b", "PURCHASE ORDER"),
            (r"\bPO[-\s]?DATE\b", "PO DATE"),
            (r"\bSHIP\s+TO\b", "SHIP TO"),
            (r"\bFREIGHT\s+TERMS\b", "FREIGHT TERMS"),
        ]),
        "secondary": _compile_signature([
            (r"\bCUSTOMER\s+PO\s*#\b", "CUSTOMER PO #"),
            (r"\bREQ\s*DATE\b", "REQ DATE"),
            (r"\bVENDOR\b", "VENDOR"),
            (r"\bBILL\s+TO\b", "BILL TO"),
           # (r"\bQTY-OPN\b", "QTY-OPN"),
        ]),
        "negative": _compile_signature([
            (r"\bQUOTATION\s*#\b", "QUOTATION#"),
            (r"\bPICK\s*TICKET\b", "PICK TICKET"),
            (r"\bCUSTOMER\s+PICK[-\s]?UP\b", "CUSTOMER PICK-UP"),
        ]),
    },
    "Invoice": {
        "primary": _compile_signature([
            (r"\bCUSTOMER\s+PICK[-\s]?UP\b", "CUSTOMER PICK-UP"),
            (r"\bPICK\s*TICKET\b", "PICK TICKET"),
            (r"\bPICK[-\s]?UP\s*TICKET\b", "PICK-UP TICKET"),
            (r"\bINVOICE\s*#\b", "INVOICE #"),
            (r"\bINVOICE\s+DATE\b", "INVOICE DATE"),
        ]),
        "secondary": _compile_signature([
            (r"\bNON-RETURNABLE\b", "NON-RETURNABLE"),
            (r"\bWILL\s+CALL\b", "WILL CALL"),
            (r"\bITEMS\s+MAY\s+NOT\s+BE\s+CANCELLED\b", "ITEMS MAY NOT BE CANCELLED"),
            (r"\bSHIP\s+VIA\b", "SHIP VIA"),
        ]),
        "negative": _compile_signature([
            (r"\bQUOTATION\s*#\b", "QUOTATION#"),
            (r"\bQUOTE\s+DATE\b", "QUOTE DATE"),
        ]),
    },
}

DISPLAY_LABELS = {
    "Quote": "Quote",
    "PO": "Purchase Order",
    "Invoice": "Invoice / Pick Ticket",
}


def detect_doc_type(pdf_path: str | Path) -> DocumentDetection:
    normalized = get_preview_text(pdf_path)
    if not normalized:
        return DocumentDetection("Unknown", 0, {}, {})

    scores: dict[str, int] = {}
    keyword_hits: dict[str, list[str]] = {}

    for label, signature in DOC_SIGNATURES.items():
        score = 0
        hits: set[str] = set()
        for pattern, alias in signature["primary"]:
            if pattern.search(normalized):
                score += PRIMARY_WEIGHT
                hits.add(alias)
        for pattern, alias in signature["secondary"]:
            if pattern.search(normalized):
                score += SECONDARY_WEIGHT
                hits.add(alias)
        for pattern, alias in signature["negative"]:
            if pattern.search(normalized):
                score -= NEGATIVE_WEIGHT
        if hits:
            keyword_hits[label] = sorted(hits)
        scores[label] = score

    if not scores:
        return DocumentDetection("Unknown", 0, {}, {})

    best_label, best_score = max(scores.items(), key=lambda item: item[1])
    if best_score <= 0:
        return DocumentDetection("Unknown", best_score, scores, keyword_hits)
    return DocumentDetection(best_label, best_score, scores, keyword_hits)

# ==========================================
# =================  MAIN  =================
# ==========================================

def show_main() -> None:
    """
    Main Forma UI:
      - Document type picker (Quote/PO/Invoice)
      - File picker
      - Generate report
      - Configure menu
      - Trial countdown (bottom-right)
    """
    # Basic trial gate (soft-gate here; hard gate done in __main__)
    if is_trial_expired():
        messagebox.showerror("Trial Expired", "Your 30-day trial has ended.\nPlease contact Joel to activate Forma.")
        return

    selected_file: str | None = None

    # --- current root folder (safe fallback to USER_DATA_ROOT) ---
    def current_root_folder() -> Path:
        try:
            raw = CONFIG_FILE.read_text(encoding="utf-8").strip()
            if not raw or raw.lower() == "no folder selected yet":
                return ensure_dir(USER_DATA_ROOT)
            return ensure_dir(Path(raw))
        except Exception:
            return ensure_dir(USER_DATA_ROOT)

    # --- handlers ---
    def select_file():
        nonlocal selected_file
        selected_file = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
        if selected_file:
            file_path = Path(selected_file)
            folder_name = file_path.parent.name
            file_name = file_path.name

            display_text = f"📂 {folder_name} > {file_name}"



            file_entry.config(state="normal")
            file_entry.delete(0, tk.END)
            file_entry.insert(0, display_text)
            file_entry.config(state="readonly")
            threading.Thread(target=lambda: detect_doc_type(selected_file), daemon=True).start()

    def generate_report():
        report_type = report_var.get()
        if not report_type:
            messagebox.showerror("Error", "Please select a report type.")
            return
        if not selected_file:
            messagebox.showerror("Error", "Please select a PDF file.")
            return

        def run_extraction():
            try:
                ocr_bundle = get_ocr_bundle(selected_file)
                detection = detect_doc_type(selected_file)
                selected_display = DISPLAY_LABELS.get(report_type, report_type)

                def describe_hits(label: str) -> str:
                    hits = detection.keyword_hits.get(label, [])
                    if not hits:
                        return ''
                    preview = ', '.join(hits[:3])
                    if len(hits) > 3:
                        preview += ', ...'
                    return preview

                detected_label = detection.label
                detected_display = DISPLAY_LABELS.get(detected_label, detected_label)

                if detected_label != 'Unknown' and detected_label != report_type:
                    if detection.confidence >= STRONG_MATCH_THRESHOLD:
                        keywords = describe_hits(detected_label)
                        detail = f" based on {keywords}" if keywords else ''
                        messagebox.showerror(
                            'Type Mismatch',
                            f"This file looks like a {detected_display}{detail}.\nPlease pick the matching report type."
                        )
                        return
                    if detection.confidence >= MODERATE_MATCH_THRESHOLD:
                        keywords = describe_hits(detected_label)
                        detail = f" (matched {keywords})" if keywords else ''
                        if not messagebox.askyesno(
                            'Confirm Document Type',
                            f"This file appears to be a {detected_display}{detail}.\nDo you still want to run the {selected_display} extractor?"
                        ):
                            return
                elif detected_label == 'Unknown':
                    if not messagebox.askyesno(
                        'Unable to Confirm',
                        f"We couldn't verify the document type for this file.\nDo you still want to run the {selected_display} extractor?"
                    ):
                        return

                # Extract
                root_folder = current_root_folder()
                if report_type == "Quote":
                    quotation_extract(selected_file, output_root=root_folder, ocr_bundle=ocr_bundle)
                elif report_type == "PO":
                    po_extract(selected_file, output_root=root_folder, ocr_bundle=ocr_bundle)
                elif report_type == "Invoice":
                    customer_pickup(selected_file, output_root=root_folder, ocr_bundle=ocr_bundle)
                else:
                    messagebox.showerror("Error", f"Unknown report type: {report_type}")
                    return

                messagebox.showinfo("Success", f"{report_type} report generated!")
            except Exception as e:
                messagebox.showerror("Failure", f"Error:\n{e}")
            finally:
                progress.stop()
                progress.lower()

        # Start spinner + thread
        progress.lift()
        progress.start(10)
        threading.Thread(target=run_extraction, daemon=True).start()

    # --- build window ---
    root = tk.Tk()
    root.title("Forma")
    root.resizable(False, False)

    if not MAIN_UI_IMAGE.exists():
        messagebox.showerror("Error", "Main UI image not found.")
        root.destroy()
        return

    # Background image (scaled)
    bg_img = Image.open(MAIN_UI_IMAGE)
    scale_factor = 1.25
    ow, oh = bg_img.size
    img_width, img_height = int(ow * scale_factor), int(oh * scale_factor)
    bg_img = bg_img.resize((img_width, img_height), Image.Resampling.LANCZOS)
    bg_photo = ImageTk.PhotoImage(bg_img)

    # Center the window
    screen_w = root.winfo_screenwidth()
    screen_h = root.winfo_screenheight()
    x = (screen_w // 2) - (img_width // 2)
    y = (screen_h // 2) - (img_height // 2)
    root.geometry(f"{img_width}x{img_height}+{x}+{y}")

    # Canvas with background
    canvas = tk.Canvas(root, width=img_width, height=img_height, highlightthickness=0, bd=0)
    canvas.pack()
    canvas.create_image(0, 0, anchor="nw", image=bg_photo)
    root.bg = bg_photo

    # Progress bar (styled)
    style = ttk.Style(root)
    style.theme_use("default")
    style.configure(
        "Custom.Horizontal.TProgressbar",
        troughcolor="#1b263b",
        background="#4BA4EC",
        thickness=10,
        bordercolor="#1b263b",
        relief="flat",
    )
    progress = ttk.Progressbar(root, mode="indeterminate", length=200, style="Custom.Horizontal.TProgressbar")
    progress.place(x=380, y=560)
    progress.lower()

    # Report type radio cluster
    report_var = tk.StringVar(value="")  # no default selected
    quote_btn = tk.Radiobutton(
        root, text="", variable=report_var, value="Quote",
        font=("Segoe UI", 10, "bold"), indicatoron=0,
        bg="#333333", fg="white", activebackground="#555555", activeforeground="white",
        relief="raised", bd=2, width=3
    )
    quote_btn.place(x=105, y=192)

    po_btn = tk.Radiobutton(
        root, text="", variable=report_var, value="PO",
        font=("Segoe UI", 10, "bold"), indicatoron=0,
        bg="#333333", fg="white", activebackground="#555555", activeforeground="white",
        relief="raised", bd=2, width=3
    )
    po_btn.place(x=387, y=192)

    invoice_btn = tk.Radiobutton(
        root, text="", variable=report_var, value="Invoice",
        font=("Segoe UI", 10, "bold"), indicatoron=0,
        bg="#333333", fg="white", activebackground="#555555", activeforeground="white",
        relief="raised", bd=2, width=3
    )
    invoice_btn.place(x=666, y=192)

    # File picker button
    file_btn = tk.Button(
        root, text="Select File", command=select_file,
        font=("Segoe UI Semibold", 14), bg="#E8E8E8", fg="black",
        relief="flat", bd=2, padx=0, pady=2, highlightthickness=0
    )
    file_btn.place(x=200, y=309)

    # Root folder state (for Configure menu)
    root_var = tk.StringVar(value=str(current_root_folder()))

    # Selected file display
    file_entry = tk.Entry(
        root,
        font=("Abadi", 12, "bold"),
        width=42,
        state="readonly",
        readonlybackground="white",
        bd=0,
        highlightthickness=0,
        relief="flat",
        justify="left"
    )
    file_entry.place(x=405, y=311, height=40)

    # Configure (gear) button
    cfg_btn = tk.Button(
        root,
        text="⚙️ Configure",
        command=lambda: show_configure_menu(root, root_var),
        font=("Segoe UI Semibold", 14),
        bg="#E8E8E8",
        fg="black",
        relief="flat",
        bd=2,
        padx=0,
        pady=2,
        highlightthickness=0,
    )
    # Place where your artwork expects it
    cfg_btn.place(x=178, y=408)

    # Generate report
    gen_btn = tk.Button(
        root, text="Generate Report", command=generate_report,
        font=("Abadi", 12, "bold"), bg="#E8E8E8", fg="black",
        relief="flat", bd=2, width=18, height=1
    )
    gen_btn.place(x=390, y=505)

    # === Trial countdown (bottom-right) ===
    days_left = get_trial_days_remaining()
    fg_color = "red" if days_left <= 5 else "black"
    trial_label = tk.Label(
        root,
        text=f"{days_left} days left",
        font=("Segoe UI", 10, "bold"),
        bg="#E8E8E8",  # adjust if your art expects transparent/other
        fg=fg_color,
    )
    trial_label.place(x=img_width - 180, y=img_height - 90)

    root.mainloop()


# ==========================================
# ================== RUN ===================
# ==========================================

if __name__ == "__main__":
    # Hard gate before we even show UI
    if is_trial_expired():
        # We can still show a dialog even before Tk root exists
        root = tk.Tk()
        root.withdraw()
        messagebox.showerror(
            "Trial Expired",
            "Your 30-day trial has ended.\nPlease contact Joel to activate Forma."
        )
        root.destroy()
    else:
        show_splash()


