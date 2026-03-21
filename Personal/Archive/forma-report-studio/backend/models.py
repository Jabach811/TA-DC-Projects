from __future__ import annotations

from dataclasses import asdict, dataclass, field
from pathlib import Path


@dataclass(slots=True)
class AppSettings:
    forma_source_root: str
    output_root: str
    tesseract_path: str
    poppler_path: str

    def to_dict(self) -> dict[str, str]:
        return asdict(self)


@dataclass(slots=True)
class DocumentDetection:
    label: str
    confidence: int
    scores: dict[str, int]
    keyword_hits: dict[str, list[str]]

    def ranked(self) -> list[tuple[str, int]]:
        return sorted(self.scores.items(), key=lambda item: item[1], reverse=True)

    def to_dict(self) -> dict[str, object]:
        return {
            "label": self.label,
            "confidence": self.confidence,
            "scores": self.scores,
            "keyword_hits": self.keyword_hits,
            "ranked": self.ranked(),
        }


@dataclass(slots=True)
class ExtractionResult:
    success: bool
    report_type: str
    input_file: str
    output_file: str | None = None
    detected_type: str | None = None
    summary: dict[str, object] = field(default_factory=dict)
    warnings: list[str] = field(default_factory=list)
    error: str | None = None

    def to_dict(self) -> dict[str, object]:
        return {
            "success": self.success,
            "report_type": self.report_type,
            "input_file": self.input_file,
            "output_file": self.output_file,
            "detected_type": self.detected_type,
            "summary": self.summary,
            "warnings": self.warnings,
            "error": self.error,
        }


@dataclass(slots=True)
class ReportDefinition:
    key: str
    label: str
    module_name: str
    function_name: str

    def to_dict(self) -> dict[str, str]:
        return asdict(self)


def safe_path_string(path: str | Path | None) -> str | None:
    if path is None:
        return None
    return str(Path(path))
