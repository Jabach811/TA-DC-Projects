from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path

from .models import DocumentDetection, ExtractionResult, ReportDefinition
from .settings import load_settings

PRIMARY_WEIGHT = 4
SECONDARY_WEIGHT = 2
NEGATIVE_WEIGHT = 2


def _compile_signature(pairs: list[tuple[str, str]]) -> tuple[tuple[re.Pattern[str], str], ...]:
    return tuple((re.compile(pattern, re.IGNORECASE), label) for pattern, label in pairs)


DOC_SIGNATURES: dict[str, dict[str, tuple[tuple[re.Pattern[str], str], ...]]] = {
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


REPORTS: dict[str, ReportDefinition] = {
    "Quote": ReportDefinition("Quote", "Quote", "quote_extractor", "quotation_extract"),
    "PO": ReportDefinition("PO", "Purchase Order", "po_extract", "po_extract"),
    "Invoice": ReportDefinition("Invoice", "Invoice / Pick Ticket", "customer_pickup", "customer_pickup"),
}


class FormaService:
    def __init__(self) -> None:
        self.settings = load_settings()

    def list_reports(self) -> list[dict[str, str]]:
        return [report.to_dict() for report in REPORTS.values()]

    def get_settings(self) -> dict[str, str]:
        self.settings = load_settings()
        return self.settings.to_dict()

    def dependency_status(self) -> dict[str, object]:
        self.settings = load_settings()
        source_root = Path(self.settings.forma_source_root)
        return {
            "forma_source_root_exists": source_root.exists(),
            "tesseract_exists": Path(self.settings.tesseract_path).exists(),
            "poppler_exists": Path(self.settings.poppler_path).exists(),
            "reports_available": list(REPORTS.keys()),
        }

    def detect_document_type(self, pdf_path: str) -> dict[str, object]:
        self.settings = load_settings()
        try:
            return self._score_document_text(self._extract_preview_text(pdf_path)).to_dict()
        except Exception as exc:
            return DocumentDetection("Unknown", 0, {}, {"error": [str(exc)]}).to_dict()

    def run_extraction(self, report_type: str, pdf_path: str) -> dict[str, object]:
        self.settings = load_settings()
        pdf_file = Path(pdf_path).resolve()
        if report_type not in REPORTS:
            return ExtractionResult(False, report_type, str(pdf_file), error=f"Unknown report type: {report_type}").to_dict()
        if not pdf_file.exists():
            return ExtractionResult(False, report_type, str(pdf_file), error=f"Input file not found: {pdf_file}").to_dict()

        detection = self._score_document_text(self._extract_preview_text(str(pdf_file)))
        try:
            output_file = self._execute_extractor(REPORTS[report_type], pdf_file)
            warnings: list[str] = []
            if detection.label != "Unknown" and detection.label != report_type:
                warnings.append(f"Document appears to be {detection.label}, but {report_type} extractor was run.")
            return ExtractionResult(
                True,
                report_type,
                str(pdf_file),
                output_file=str(output_file),
                detected_type=detection.label,
                summary={
                    "input_name": pdf_file.name,
                    "output_name": output_file.name,
                    "output_folder": str(output_file.parent),
                },
                warnings=warnings,
            ).to_dict()
        except Exception as exc:
            return ExtractionResult(False, report_type, str(pdf_file), detected_type=detection.label, error=str(exc)).to_dict()

    def _source_root(self) -> Path:
        root = Path(self.settings.forma_source_root)
        if not root.exists():
            raise FileNotFoundError(f"Forma source root not found: {root}")
        return root

    def _load_module(self, module_name: str):
        target = self._source_root() / f"{module_name}.py"
        if not target.exists():
            raise FileNotFoundError(f"Extractor module not found: {target}")
        spec = importlib.util.spec_from_file_location(f"forma_source_{module_name}", target)
        if spec is None or spec.loader is None:
            raise ImportError(f"Unable to load module spec for {target}")
        module = importlib.util.module_from_spec(spec)
        sys.modules[spec.name] = module
        spec.loader.exec_module(module)
        return module

    def _execute_extractor(self, report: ReportDefinition, pdf_file: Path) -> Path:
        module = self._load_module(report.module_name)
        extractor = getattr(module, report.function_name)
        output_root = Path(self.settings.output_root)
        before = self._snapshot_xlsx(output_root)
        result = extractor(str(pdf_file), output_root=str(output_root))
        if result:
            return Path(result)
        after = self._snapshot_xlsx(output_root)
        new_files = sorted(after - before, key=lambda item: item.stat().st_mtime, reverse=True)
        if new_files:
            return new_files[0]
        raise RuntimeError(f"{report.key} extractor finished without returning or creating a workbook path.")

    def _snapshot_xlsx(self, root: Path) -> set[Path]:
        if not root.exists():
            return set()
        return {path.resolve() for path in root.rglob("*.xlsx")}

    def _configure_ocr_environment(self) -> None:
        import os
        import pytesseract  # type: ignore

        os.environ["FORMA_TESSERACT_PATH"] = self.settings.tesseract_path
        os.environ["FORMA_POPPLER_PATH"] = self.settings.poppler_path
        os.environ["FORMA_DATA_ROOT"] = self.settings.output_root
        pytesseract.pytesseract.tesseract_cmd = self.settings.tesseract_path

    def _extract_preview_text(self, pdf_path: str) -> str:
        source_root = self._source_root()
        if str(source_root) not in sys.path:
            sys.path.insert(0, str(source_root))
        self._configure_ocr_environment()

        import pdfplumber  # type: ignore
        import pytesseract  # type: ignore

        chunks: list[str] = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages[:2]:
                snippet = (page.extract_text() or "").strip()
                if len(snippet) < 40:
                    try:
                        image = page.to_image(resolution=300).original
                        snippet = pytesseract.image_to_string(image)
                    except Exception:
                        pass
                if snippet:
                    chunks.append(snippet)
        return "\n".join(chunks)

    def _score_document_text(self, text: str) -> DocumentDetection:
        normalized = re.sub(r"\s+", " ", text).upper()
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
            for pattern, _alias in signature["negative"]:
                if pattern.search(normalized):
                    score -= NEGATIVE_WEIGHT
            if hits:
                keyword_hits[label] = sorted(hits)
            scores[label] = score

        best_label, best_score = max(scores.items(), key=lambda item: item[1])
        if best_score <= 0:
            return DocumentDetection("Unknown", best_score, scores, keyword_hits)
        return DocumentDetection(best_label, best_score, scores, keyword_hits)
