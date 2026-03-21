# Forma App Integration Plan

## Goal

Build a polished HTML-based desktop app for Forma that keeps the existing Python extraction logic, modernizes the UI, and creates a stable path for future report types.

The app should feel like the other internal HTML tools, but it should not throw away the working OCR/PDF/Excel pipeline.

## What Exists Today

Current launcher flow in the Hipco Forma folder:

1. User launches `Launcher.py`
2. User selects a report type
3. User picks a PDF file
4. App attempts lightweight document-type detection
5. Matching extractor runs
6. Extractor OCRs/parses/cleans the report
7. Extractor writes a formatted Excel workbook

Key files:

- `Launcher.py`
- `config.py`
- `quote_extractor.py`
- `po_extract.py`
- `customer_pickup.py`

Secondary or likely legacy variants:

- `pick_ticket.py`
- `pick ticket.py`
- `customer_pickup_infile.py`
- `customer_pickup_standalone.py`
- `Login.py`

## Current Strengths

- Parser logic is already split by report type
- Launcher already has the right high-level app workflow
- OCR and workbook generation are already battle-tested
- Output files are styled and useful, not raw dumps
- Detection logic already exists and can be reused

## Current Gaps

- UI is tightly coupled to Tkinter and image-backed screens
- Parser contracts are inconsistent
- `quote_extractor.py` appears to save the workbook but does not return the output path
- Some duplicate scripts create ambiguity around the canonical implementation
- App configuration, parser execution, and UI state are not yet separated into clean layers

## Recommended Architecture

### Desktop Stack

Use:

- `pywebview` for the desktop shell
- HTML/CSS/JS for the user interface
- Python for parsing, OCR, file dialogs, and Excel generation

Do not use a static browser-only app for v1.

Reason:

- OCR
- local PDF handling
- filesystem access
- Excel generation
- Tesseract / Poppler integration

These all fit Python much better than a browser-only rewrite.

## Target App Structure

### Layer 1: Forma Core

Python backend layer that owns:

- report registration
- file selection
- type detection
- extraction execution
- output paths
- error handling
- config/dependency checks

Suggested modules:

- `forma_core/api.py`
- `forma_core/config.py`
- `forma_core/detector.py`
- `forma_core/models.py`
- `forma_core/runners.py`
- `forma_core/extractors/quote.py`
- `forma_core/extractors/po.py`
- `forma_core/extractors/customer_pickup.py`

### Layer 2: Forma App

Frontend layer that owns:

- screen layout
- report cards
- file intake
- run state
- progress and error display
- results screen
- settings screen

Suggested frontend structure:

- `forma-app/index.html`
- `forma-app/styles.css`
- `forma-app/app.js`
- `forma-app/assets/*`

### Layer 3: Desktop Host

Thin Python entry point that launches the webview and exposes the backend API to the frontend.

Suggested file:

- `run_forma_app.py`

## Canonical Parser Choice For V1

Use these as the source of truth:

- Quote: `quote_extractor.py`
- Purchase Order: `po_extract.py`
- Invoice / Pick Ticket: `customer_pickup.py`

Do not use the duplicate scripts as the app backend unless we find missing features that only live there.

## Required Parser Cleanup Before Full UI Build

### Must Fix

1. Standardize every extractor to return:

```python
{
    "success": True,
    "report_type": "...",
    "input_file": "...",
    "output_file": "...",
    "summary": {...}
}
```

2. Make `quote_extractor.py` return the saved workbook path
3. Move any launcher-only assumptions out of extractors
4. Normalize output root handling across all extractors
5. Wrap exceptions into consistent user-facing messages

### Nice To Have

- add structured parse summaries
- count products/rows
- expose detected customer / document number
- report warnings for ambiguous OCR matches

## V1 Product Scope

### Supported Report Types

- Quote
- Purchase Order
- Invoice / Pick Ticket

### Core Screens

1. Home
- App title
- report-type cards
- recent jobs

2. Intake
- selected report type
- choose PDF
- detected document type
- output folder preview

3. Processing
- running indicator
- status text
- extraction log summary

4. Results
- success/failure state
- output workbook path
- open file
- open folder
- run another file

5. Settings
- output root
- Tesseract path
- Poppler path
- dependency status

## UX Direction

Style it like a premium internal console, not a generic utility.

Design goals:

- strong desktop app feel
- clear report cards
- visual confidence around processing state
- rich results screen
- modern but practical

Recommended visual direction:

- dark graphite or deep slate shell
- strong accent color per report type
- bold section framing
- large intake panel
- polished status ribbons and result cards

## Proposed API Surface

Frontend should call a small backend bridge like:

```python
select_file()
get_settings()
save_settings(payload)
detect_document_type(file_path)
run_extraction(report_type, file_path)
open_output_file(file_path)
open_output_folder(file_path)
get_recent_runs()
```

## Proposed Data Models

### Extraction Result

```json
{
  "success": true,
  "report_type": "Quote",
  "input_file": "C:/...",
  "output_file": "C:/...",
  "detected_type": "Quote",
  "summary": {
    "customer": "ABC Company",
    "document_number": "123A4567",
    "line_items": 24
  },
  "warnings": []
}
```

### Settings

```json
{
  "output_root": "C:/Users/.../Documents/Hipco",
  "tesseract_path": "C:/Program Files/Tesseract-OCR/tesseract.exe",
  "poppler_path": "C:/poppler/.../bin"
}
```

## Delivery Plan

### Phase 1: Core Stabilization

- isolate canonical extractor files
- normalize return values
- create shared extraction wrapper
- centralize settings and path validation

### Phase 2: Desktop App Skeleton

- create `pywebview` host
- create HTML shell
- wire frontend to backend bridge
- implement file select and mock extraction state

### Phase 3: Real Parser Integration

- connect real extractors
- surface success/failure results
- open output file/folder
- add settings screen

### Phase 4: Product Polish

- recent jobs
- result summaries
- mismatch warnings
- nicer progress and error states
- packaging

## Success Criteria

The project is successful when:

- user can launch the app without touching Python files
- user selects a report type and PDF from the UI
- app detects/report-checks the file type
- correct extractor runs
- styled Excel file is generated successfully
- UI clearly shows where the file was saved
- parser logic remains maintainable and modular

## Immediate Next Build Steps

1. Create a new Forma app workspace with backend/frontend separation
2. Wrap the three canonical extractors behind a unified Python API
3. Fix `quote_extractor.py` to return its saved output path
4. Build the HTML intake/results shell
5. Connect the shell through `pywebview`

## Recommendation

Build Forma as a hybrid desktop app, not a browser-only port and not another Tkinter reskin.

That gives the project the best mix of:

- modern UI
- reuse of working parser code
- low migration risk
- clean future extensibility
