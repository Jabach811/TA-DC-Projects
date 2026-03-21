from __future__ import annotations

import json
from pathlib import Path

from .models import AppSettings


APP_ROOT = Path(__file__).resolve().parents[1]
SETTINGS_PATH = APP_ROOT / "forma-settings.json"

DEFAULT_FORMA_SOURCE_ROOT = Path(
    r"C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder"
)
DEFAULT_OUTPUT_ROOT = Path.home() / "Documents" / "Hipco"
DEFAULT_TESSERACT_PATH = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
DEFAULT_POPPLER_PATH = Path(r"C:\poppler\poppler-25.07.0\Library\bin")


def default_settings() -> AppSettings:
    return AppSettings(
        forma_source_root=str(DEFAULT_FORMA_SOURCE_ROOT),
        output_root=str(DEFAULT_OUTPUT_ROOT),
        tesseract_path=str(DEFAULT_TESSERACT_PATH),
        poppler_path=str(DEFAULT_POPPLER_PATH),
    )


def load_settings() -> AppSettings:
    if not SETTINGS_PATH.exists():
        settings = default_settings()
        save_settings(settings)
        return settings

    try:
        data = json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
    except Exception:
        settings = default_settings()
        save_settings(settings)
        return settings

    defaults = default_settings()
    return AppSettings(
        forma_source_root=data.get("forma_source_root", defaults.forma_source_root),
        output_root=data.get("output_root", defaults.output_root),
        tesseract_path=data.get("tesseract_path", defaults.tesseract_path),
        poppler_path=data.get("poppler_path", defaults.poppler_path),
    )


def save_settings(settings: AppSettings) -> AppSettings:
    SETTINGS_PATH.write_text(
        json.dumps(settings.to_dict(), indent=2),
        encoding="utf-8",
    )
    return settings
