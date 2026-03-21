from __future__ import annotations

import tkinter as tk
from tkinter import filedialog

from .models import AppSettings
from .service import FormaService
from .settings import save_settings


class FormaBridge:
    def __init__(self) -> None:
        self._service = FormaService()

    def bootstrap(self) -> dict[str, object]:
        return {
            "settings": self._service.get_settings(),
            "dependency_status": self._service.dependency_status(),
            "reports": self._service.list_reports(),
        }

    def pick_pdf_file(self) -> str:
        root = tk.Tk()
        root.withdraw()
        root.attributes("-topmost", True)
        try:
            return filedialog.askopenfilename(
                title="Select PDF Report",
                filetypes=[("PDF Files", "*.pdf")],
            ) or ""
        finally:
            root.destroy()

    def detect_document_type(self, pdf_path: str) -> dict[str, object]:
        return self._service.detect_document_type(pdf_path)

    def run_extraction(self, report_type: str, pdf_path: str) -> dict[str, object]:
        return self._service.run_extraction(report_type, pdf_path)

    def get_settings(self) -> dict[str, str]:
        return self._service.get_settings()

    def save_settings(self, payload: dict[str, str]) -> dict[str, object]:
        settings = AppSettings(
            forma_source_root=payload.get("forma_source_root", self._service.settings.forma_source_root),
            output_root=payload.get("output_root", self._service.settings.output_root),
            tesseract_path=payload.get("tesseract_path", self._service.settings.tesseract_path),
            poppler_path=payload.get("poppler_path", self._service.settings.poppler_path),
        )
        save_settings(settings)
        self._service = FormaService()
        return {
            "settings": self._service.get_settings(),
            "dependency_status": self._service.dependency_status(),
        }
