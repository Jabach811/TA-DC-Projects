# Fixed Width Report Lab

This is a browser-only prototype for testing the fixed-width report breakout flow you described.

## Files

- `fixed-width-report-lab.html`: standalone app shell
- `fixed-width-report-lab.css`: UI styling
- `fixed-width-report-lab.js`: mock metadata, parsing logic, and Excel-compatible export

## Test Flow

1. Open `fixed-width-report-lab.html` in a browser.
2. Click `Load Mock Package`.
3. Click `Parse Payload`.
4. Review accepted reports, discarded lines, and parsed tables.
5. Click `Export Workbook` to download one Excel-compatible `.xls` workbook with a sheet for each report found.

## Mock Rules In This Build

- Record code is read from position `1` with length `6`.
- Only expected records listed under the selected data source are accepted.
- Unexpected lines like titles or footers are discarded.
- Layout definitions follow `dataSource_recordCode`.
- Text values are trimmed.
- Dates are normalized to `YYYY-MM-DD`.
- Number fields are exported as numeric cells when possible.

## Where To Edit The Mock

Update `MOCK_CONFIG` and `buildMockPayload()` in `fixed-width-report-lab.js`.
