# Forma Report Studio

Hybrid desktop app scaffold for the Forma OCR-to-Excel workflow.

## What This Build Does

- Defines a clean Python backend service around the existing Forma extractors
- Adds a modern HTML/CSS/JS frontend shell for the future desktop UI
- Preserves the current parser-first architecture instead of rewriting OCR logic in JavaScript

## Current Status

This is the Phase 1 workspace:

- canonical parser registry
- document type detection
- settings storage
- extraction service wrapper
- frontend shell

## Canonical Parser Sources

This app currently expects the working parser source folder to live at:

`C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder`

That path can be updated in the app settings.

## Planned Stack

- Python backend
- `pywebview` desktop host
- HTML/CSS/JS frontend

## Run Target

Primary entry point:

- `run_forma_report_studio.py`

Planned launch flow:

1. Install dependencies from `requirements.txt`
2. Run `python run_forma_report_studio.py`
3. App loads the frontend and bridges to the Python extraction service
