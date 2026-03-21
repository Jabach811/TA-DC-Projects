from __future__ import annotations

from pathlib import Path

from .bridge import FormaBridge


def run() -> None:
    frontend_path = Path(__file__).resolve().parents[1] / "frontend" / "index.html"
    bridge = FormaBridge()

    try:
        import webview  # type: ignore
    except ImportError as exc:
        raise SystemExit("pywebview is not installed. Install it before launching Forma Report Studio.") from exc

    webview.create_window(
        "Forma Report Studio",
        frontend_path.as_uri(),
        js_api=bridge,
        width=1480,
        height=960,
        min_size=(1200, 800),
    )
    webview.start(debug=True)


if __name__ == "__main__":
    run()
