# Two-File Setup (Manager + Employee)

You now have two dedicated app files:

- `manager.html`
- `employee.html`

## Intended Use

- Manager uses `manager.html` only.
- Employees use `employee.html` only.

## Employee Folder Pattern

Create one folder per employee and place:

- `employee.html`
- `update.json`

Example:

```text
Employees/
  Sarah/
    employee.html
    update.json
  Marcus/
    employee.html
    update.json
```

`employee.html` auto-refreshes from `./update.json` when opened.
No manual import click is required.

## Manager Update Flow

1. Manager updates data in `manager.html`.
2. Preferred: Manager clicks `Publish Sync Files To Folder`.
3. Pick your employee root folder.
4. If subfolders are named by profile id (`p1`, `p2`, etc.), app writes `update.json` directly inside each folder.
5. If you pick one employee folder (for example `employees/p4`), app writes `update.json` for that one employee.
6. If subfolders do not match ids and app cannot infer target, it will tell you.
7. Employee opens `employee.html` and it auto-syncs on load.

## Team Sync Back To Manager

- Manager app now also auto-loads `./updates/<employeeId>.json` on open (if files exist).
- There is also a `Sync Employee Updates Now` button in Manage > Export & Import.
- This includes achievements, ratings, targets, notes, and profile metadata from employee sync files.

## Notes

- Employee app is locked to individual mode.
- It auto-loads a single profile from `update.json`.
- Run via local server (`http://...`) instead of `file://` so auto-fetch works reliably.
- `Publish Sync Files To Folder` requires a Chromium browser (Edge/Chrome) with File System Access API support.

## No-Server Option (Manual Pull Button)

If you do not want localhost/server at all:

1. Open `employee.html` directly (double-click is fine).
2. Click `Sync Update File` in the top-right.
3. Select the `update.json` in that employee's folder.
4. App applies the update immediately and shows sync/achievement toast.

This bypasses `file://` auto-sync restrictions while keeping the same JSON workflow.
