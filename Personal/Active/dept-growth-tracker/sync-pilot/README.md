# Dept Growth Tracker Sync Pilot

This pilot gives you:

- `manager/index.html` for full manager mode
- `employees/p1/index.html` ... `employees/p4/index.html` for employee-locked copies
- `updates/p1.json` ... `updates/p4.json` auto-pull files used by employee apps on open

## How It Works

1. Manager updates data in `manager/index.html`.
2. Manager clicks `Export Employee Sync Files`.
3. One JSON file per employee is downloaded (`dc-growth-sync-p1.json`, etc.).
4. Publish downloads into `updates`:
   ```powershell
   .\Publish-SyncFiles.ps1
   ```
   This auto-copies and renames to `p1.json`, `p2.json`, etc.
5. Employee opens their own `employees/<id>/index.html`.
6. On open, app auto-refreshes from `../../updates/<id>.json` with no manual import click.

## Important

- Auto-refresh uses `fetch(...)`, so run from a local web server (not direct `file://` open).
- Employee copies are locked to individual mode and only their own profile id.

## Quick Local Server (PowerShell)

From `sync-pilot` folder:

```powershell
python -m http.server 8080
```

Then open:

- Manager: `http://localhost:8080/manager/index.html`
- Employee p1: `http://localhost:8080/employees/p1/index.html`
- Employee p2: `http://localhost:8080/employees/p2/index.html`
- Employee p3: `http://localhost:8080/employees/p3/index.html`
- Employee p4: `http://localhost:8080/employees/p4/index.html`

## One-Click Option (No Commands)

1. Double-click `Start-SyncPilot.bat` in `sync-pilot`.
2. It starts the local server and opens manager page automatically.
3. Keep that window open while using the app.
4. To open an employee page quickly, double-click `Open-Employee.bat` and enter `p1`, `p2`, `p3`, or `p4`.
