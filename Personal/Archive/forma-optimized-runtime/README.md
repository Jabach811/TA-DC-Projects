# Forma Optimized Runtime

This folder is a safe working copy of the Harrington/Forma runtime.

It exists so we can improve parsing and reliability without touching the
original source folder in:

`C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder`

## Included runtime files

- `Launcher.py`
- `config.py`
- `quote_extractor.py`
- `po_extract.py`
- `customer_pickup.py`
- required image assets

## Current changes

- Quote parser reuses the main OCR pass for header extraction
- Quote parser returns its output path
- Quote parser avoids the starred-header crash on non-string values
- Quote parser strips a leading `Company:` label from the customer header
- PO parser consolidates metadata extraction into a single scan of OCR lines
- PO parser keeps matching workbook row output on tested samples
- Customer pickup parser removes dead duplicated helper code
- Customer pickup parser consolidates header extraction while keeping matching workbook row output on tested samples
- Launcher detection now uses a preview-text cache keyed by file path, size, and modified time
- Launcher warms the detection cache as soon as a file is selected
- Shared OCR service now lets detection and extraction reuse the same full-document OCR bundle
- Quote, PO, and customer pickup parsers can consume a cached OCR bundle when the launcher provides one

## Smoke test

Run:

```powershell
py -3.11 .\smoke_test_runtime.py
```

This tests the copied Quote and PO parsers against sample PDFs from the
original Forma folder and writes results under `test-output`.

## Comparison tests

Quote:

```powershell
py -3.11 .\compare_quote_extractors.py
```

PO:

```powershell
py -3.11 .\compare_po_extractors.py
```

Customer pickup:

```powershell
py -3.11 .\compare_customer_pickup.py
```

Detection cache benchmark:

```powershell
py -3.11 .\benchmark_detection_cache.py
```

Shared OCR end-to-end benchmark:

```powershell
py -3.11 .\benchmark_shared_ocr_flow.py
```
