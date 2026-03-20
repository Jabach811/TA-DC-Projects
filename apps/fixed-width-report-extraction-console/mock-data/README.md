# Fixed-Width Parser Mock Data

This folder contains a reusable provider mock pack under `provider-mocks` for the current fixed-width parser providers:

- `provider-mocks/EMPOWER_mock_dataset.txt`
- `provider-mocks/NEWPORT_mock_dataset.txt`
- `provider-mocks/NATIONWIDE_mock_dataset.txt`
- `provider-mocks/ADP_mock_dataset.txt`
- `provider-mocks/FIDELITY_mock_dataset.txt`
- `provider-mocks/VOYA_mock_folder`

Notes:

- These are smoke-test datasets for parser/debug work, not full production-style coverage of every supported report.
- The single-file provider mocks include representative report lines plus a title/footer line so discard handling can be checked too.
- `VOYA_mock_folder` matches the live folder-import naming pattern and also includes one ignored file to test skip logic.
- Regenerate all files by running `_generate-mock-data.ps1` in this folder.
