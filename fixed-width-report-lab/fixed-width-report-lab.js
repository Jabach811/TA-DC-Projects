const MOCK_CONFIG = {
  dataSources: [
    {
      name: "DATOSAURUS",
      description: "Mock source with a six-character report code at the start of each line.",
      recordLocator: { start: 1, length: 6 },
      reports: ["BALNCE", "ALLOCA", "MEMBER"]
    }
  ],
  layouts: {
    DATOSAURUS_BALNCE: [
      { header: "Record", start: 1, length: 6, dataType: "text" },
      { header: "Account", start: 7, length: 10, dataType: "text" },
      { header: "As Of Date", start: 17, length: 8, dataType: "date" },
      { header: "Fund", start: 25, length: 8, dataType: "text" },
      { header: "Balance", start: 33, length: 10, dataType: "decimal" },
      { header: "Status", start: 43, length: 8, dataType: "text" }
    ],
    DATOSAURUS_ALLOCA: [
      { header: "Record", start: 1, length: 6, dataType: "text" },
      { header: "Account", start: 7, length: 10, dataType: "text" },
      { header: "Plan", start: 17, length: 8, dataType: "text" },
      { header: "Percent", start: 25, length: 5, dataType: "decimal" },
      { header: "Effective Date", start: 30, length: 8, dataType: "date" },
      { header: "Model", start: 38, length: 10, dataType: "text" }
    ],
    DATOSAURUS_MEMBER: [
      { header: "Record", start: 1, length: 6, dataType: "text" },
      { header: "Member ID", start: 7, length: 10, dataType: "text" },
      { header: "First Name", start: 17, length: 10, dataType: "text" },
      { header: "Last Name", start: 27, length: 14, dataType: "text" },
      { header: "Birth Date", start: 41, length: 8, dataType: "date" },
      { header: "State", start: 49, length: 2, dataType: "text" }
    ]
  }
};

const state = {
  selectedSourceName: "DATOSAURUS",
  lastRun: null
};

const elements = {
  sourceSelect: document.getElementById("sourceSelect"),
  fileInput: document.getElementById("fileInput"),
  payloadInput: document.getElementById("payloadInput"),
  loadMockBtn: document.getElementById("loadMockBtn"),
  downloadMockBtn: document.getElementById("downloadMockBtn"),
  clearBtn: document.getElementById("clearBtn"),
  parseBtn: document.getElementById("parseBtn"),
  exportBtn: document.getElementById("exportBtn"),
  activeSourceName: document.getElementById("activeSourceName"),
  expectedReportCount: document.getElementById("expectedReportCount"),
  parsedRowCount: document.getElementById("parsedRowCount"),
  recordLocatorTable: document.getElementById("recordLocatorTable"),
  reportListTable: document.getElementById("reportListTable"),
  layoutCards: document.getElementById("layoutCards"),
  summaryStatus: document.getElementById("summaryStatus"),
  totalLineCount: document.getElementById("totalLineCount"),
  acceptedLineCount: document.getElementById("acceptedLineCount"),
  discardedLineCount: document.getElementById("discardedLineCount"),
  reportsFoundCount: document.getElementById("reportsFoundCount"),
  acceptedReports: document.getElementById("acceptedReports"),
  discardReasons: document.getElementById("discardReasons"),
  reportOutputs: document.getElementById("reportOutputs")
};

function init() {
  populateSourceSelect();
  renderMetadata();
  bindEvents();
  elements.payloadInput.value = buildMockPayload(state.selectedSourceName);
  const initialRun = parsePayload(elements.payloadInput.value, state.selectedSourceName);
  state.lastRun = initialRun;
  updateHeroStats();
  renderRun(initialRun);
}

function populateSourceSelect() {
  elements.sourceSelect.innerHTML = "";
  MOCK_CONFIG.dataSources.forEach((source) => {
    const option = document.createElement("option");
    option.value = source.name;
    option.textContent = `${source.name} - ${source.description}`;
    elements.sourceSelect.appendChild(option);
  });
  elements.sourceSelect.value = state.selectedSourceName;
}

function bindEvents() {
  elements.sourceSelect.addEventListener("change", () => {
    state.selectedSourceName = elements.sourceSelect.value;
    renderMetadata();
    updateHeroStats();
    clearRun();
  });

  elements.fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    elements.payloadInput.value = text.replace(/\r\n/g, "\n");
    clearRun();
  });

  elements.loadMockBtn.addEventListener("click", () => {
    elements.payloadInput.value = buildMockPayload(state.selectedSourceName);
    clearRun();
  });

  elements.downloadMockBtn.addEventListener("click", () => {
    const text = buildMockPayload(state.selectedSourceName);
    downloadBlob(`${state.selectedSourceName.toLowerCase()}-mock-input.txt`, text, "text/plain;charset=utf-8");
  });

  elements.clearBtn.addEventListener("click", () => {
    elements.payloadInput.value = "";
    elements.fileInput.value = "";
    clearRun();
  });

  elements.parseBtn.addEventListener("click", () => {
    const payload = elements.payloadInput.value;
    if (!payload.trim()) {
      clearRun();
      elements.summaryStatus.textContent = "No input found. Load the mock package, paste fixed-width text, or upload a file before parsing.";
      return;
    }
    const run = parsePayload(payload, state.selectedSourceName);
    state.lastRun = run;
    renderRun(run);
  });

  elements.exportBtn.addEventListener("click", () => {
    if (!state.lastRun || !state.lastRun.parsedReports.length) {
      return;
    }
    const workbookXml = buildWorkbookXml(state.lastRun);
    downloadBlob(`${state.selectedSourceName.toLowerCase()}-parsed-workbook.xls`, workbookXml, "application/vnd.ms-excel;charset=utf-8");
  });
}

function getSourceConfig(sourceName) {
  return MOCK_CONFIG.dataSources.find((item) => item.name === sourceName);
}

function renderMetadata() {
  const source = getSourceConfig(state.selectedSourceName);
  elements.recordLocatorTable.innerHTML = tableHtml(
    ["Data Source", "Record Start", "Record Length"],
    [[source.name, source.recordLocator.start, source.recordLocator.length]]
  );

  elements.reportListTable.innerHTML = tableHtml(
    ["Expected Record", "Layout Key"],
    source.reports.map((reportCode) => [reportCode, `${source.name}_${reportCode}`])
  );

  elements.layoutCards.innerHTML = source.reports
    .map((reportCode) => {
      const layoutKey = `${source.name}_${reportCode}`;
      const rows = MOCK_CONFIG.layouts[layoutKey] || [];
      return `
        <article class="layout-card">
          <h4>${layoutKey}</h4>
          <div class="table-wrap">
            ${tableHtml(
              ["Header", "Start", "Length", "Type"],
              rows.map((field) => [field.header, field.start, field.length, field.dataType])
            )}
          </div>
        </article>
      `;
    })
    .join("");
}

function updateHeroStats() {
  const source = getSourceConfig(state.selectedSourceName);
  elements.activeSourceName.textContent = source.name;
  elements.expectedReportCount.textContent = String(source.reports.length);
  elements.parsedRowCount.textContent = state.lastRun ? String(state.lastRun.acceptedLines.length) : "0";
}

function clearRun() {
  state.lastRun = null;
  elements.exportBtn.disabled = true;
  updateHeroStats();
  elements.summaryStatus.textContent = "Metadata loaded. Ready for a new parsing run.";
  elements.totalLineCount.textContent = "0";
  elements.acceptedLineCount.textContent = "0";
  elements.discardedLineCount.textContent = "0";
  elements.reportsFoundCount.textContent = "0";
  elements.acceptedReports.className = "chip-list empty-state";
  elements.acceptedReports.textContent = "No run yet.";
  elements.discardReasons.className = "discard-list empty-state";
  elements.discardReasons.textContent = "No run yet.";
  elements.reportOutputs.className = "report-outputs empty-state";
  elements.reportOutputs.textContent = "No parsed reports yet.";
}

function parsePayload(payload, sourceName) {
  const source = getSourceConfig(sourceName);
  const normalizedLines = payload.replace(/\r\n/g, "\n").split("\n");
  const lines = normalizedLines
    .map((rawLine, index) => ({ rawLine, lineNumber: index + 1 }))
    .filter((line) => line.rawLine.trim().length > 0);

  const expectedSet = new Set(source.reports);
  const acceptedLines = [];
  const discardedLines = [];
  const grouped = new Map();

  lines.forEach((line) => {
    const recordCode = extractFixedWidth(line.rawLine, source.recordLocator.start, source.recordLocator.length).trim();
    if (!recordCode) {
      discardedLines.push({ rawLine: line.rawLine, lineNumber: line.lineNumber, reason: "Blank record code", recordCode });
      return;
    }
    if (!expectedSet.has(recordCode)) {
      discardedLines.push({ rawLine: line.rawLine, lineNumber: line.lineNumber, reason: "Unexpected record code", recordCode });
      return;
    }

    const layoutKey = `${source.name}_${recordCode}`;
    const layout = MOCK_CONFIG.layouts[layoutKey];
    if (!layout || !layout.length) {
      discardedLines.push({ rawLine: line.rawLine, lineNumber: line.lineNumber, reason: "Missing layout definition", recordCode });
      return;
    }

    const parsedRow = {};
    const typedRow = {};
    layout.forEach((field) => {
      const rawValue = extractFixedWidth(line.rawLine, field.start, field.length);
      const formatted = formatValue(rawValue, field.dataType);
      parsedRow[field.header] = formatted.display;
      typedRow[field.header] = formatted.value;
    });

    const entry = {
      rawLine: line.rawLine,
      lineNumber: line.lineNumber,
      recordCode,
      reportName: layoutKey,
      row: parsedRow,
      typedRow
    };
    acceptedLines.push(entry);

    if (!grouped.has(recordCode)) {
      grouped.set(recordCode, []);
    }
    grouped.get(recordCode).push(entry);
  });

  const parsedReports = source.reports
    .filter((reportCode) => grouped.has(reportCode))
    .map((reportCode) => {
      const layoutKey = `${source.name}_${reportCode}`;
      return {
        recordCode,
        layoutKey,
        fields: MOCK_CONFIG.layouts[layoutKey],
        rows: grouped.get(reportCode)
      };
    });

  return {
    source,
    totalLines: lines.length,
    acceptedLines,
    discardedLines,
    parsedReports
  };
}

function renderRun(run) {
  updateHeroStats();
  elements.exportBtn.disabled = run.parsedReports.length === 0;
  elements.summaryStatus.textContent = run.parsedReports.length
    ? `Parsed ${run.acceptedLines.length} line(s) across ${run.parsedReports.length} report sheet(s). Unexpected records were dropped before layout parsing.`
    : "No valid report lines matched the expected report list.";

  elements.totalLineCount.textContent = String(run.totalLines);
  elements.acceptedLineCount.textContent = String(run.acceptedLines.length);
  elements.discardedLineCount.textContent = String(run.discardedLines.length);
  elements.reportsFoundCount.textContent = String(run.parsedReports.length);

  renderAcceptedReports(run);
  renderDiscardReasons(run);
  renderReportOutputs(run);
}

function renderAcceptedReports(run) {
  if (!run.parsedReports.length) {
    elements.acceptedReports.className = "chip-list empty-state";
    elements.acceptedReports.textContent = "No accepted reports.";
    return;
  }
  elements.acceptedReports.className = "chip-list";
  elements.acceptedReports.innerHTML = run.parsedReports
    .map((report) => `<span class="chip">${report.layoutKey} (${report.rows.length})</span>`)
    .join("");
}

function renderDiscardReasons(run) {
  if (!run.discardedLines.length) {
    elements.discardReasons.className = "discard-list empty-state";
    elements.discardReasons.textContent = "No discarded lines.";
    return;
  }

  const reasonMap = new Map();
  run.discardedLines.forEach((item) => {
    const key = `${item.reason}::${item.recordCode || "blank"}`;
    if (!reasonMap.has(key)) {
      reasonMap.set(key, { reason: item.reason, recordCode: item.recordCode || "(blank)", count: 0 });
    }
    reasonMap.get(key).count += 1;
  });

  elements.discardReasons.className = "discard-list";
  elements.discardReasons.innerHTML = Array.from(reasonMap.values())
    .map((item) => `
      <div class="discard-item">
        <strong>${item.reason}</strong>
        <span>Record: ${item.recordCode} | Count: ${item.count}</span>
      </div>
    `)
    .join("");
}

function renderReportOutputs(run) {
  if (!run.parsedReports.length) {
    elements.reportOutputs.className = "report-outputs empty-state";
    elements.reportOutputs.textContent = "No parsed reports yet.";
    return;
  }

  elements.reportOutputs.className = "report-outputs";
  elements.reportOutputs.innerHTML = run.parsedReports
    .map((report) => {
      const headers = report.fields.map((field) => field.header);
      const rows = report.rows.map((item) => headers.map((header) => item.row[header]));
      return `
        <article class="report-card">
          <div class="report-card-head">
            <div>
              <h3>${report.layoutKey}</h3>
              <p>${report.rows.length} accepted line(s) routed into this report sheet.</p>
            </div>
            <span class="report-pill">${report.recordCode}</span>
          </div>
          <div class="table-wrap">${tableHtml(headers, rows)}</div>
        </article>
      `;
    })
    .join("");
}

function tableHtml(headers, rows) {
  const headHtml = headers.map((header) => `<th>${escapeHtml(String(header))}</th>`).join("");
  const bodyHtml = rows.length
    ? rows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell == null ? "" : cell))}</td>`).join("")}</tr>`)
        .join("")
    : `<tr><td colspan="${headers.length}">No rows</td></tr>`;

  return `<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

function extractFixedWidth(line, start, length) {
  return line.slice(start - 1, start - 1 + length);
}

function formatValue(rawValue, dataType) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return { value: "", display: "" };
  }

  if (dataType === "decimal") {
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
      return { value: numeric, display: numeric.toFixed(2) };
    }
    return { value: trimmed, display: trimmed };
  }

  if (dataType === "integer") {
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
      return { value: Math.trunc(numeric), display: String(Math.trunc(numeric)) };
    }
    return { value: trimmed, display: trimmed };
  }

  if (dataType === "date") {
    const digits = trimmed.replace(/[^0-9]/g, "");
    if (digits.length === 8) {
      const year = digits.slice(0, 4);
      const month = digits.slice(4, 6);
      const day = digits.slice(6, 8);
      const iso = `${year}-${month}-${day}`;
      return { value: iso, display: iso };
    }
    return { value: trimmed, display: trimmed };
  }

  return { value: trimmed, display: trimmed };
}

function buildMockPayload(sourceName) {
  const rowsBySource = {
    DATOSAURUS: [
      "BALNCE000123456720240131FUND10000001250.75OPEN    ",
      "TITLE1MONTH END BALANCE SNAPSHOT                      ",
      "ALLOCA0001234567PLAN401K055.020240201MODEL-A   ",
      "MEMBER0001234567JORDAN    RIVERA        19890615CA",
      "FOOTERTHIS LINE SHOULD BE FILTERED OUT               ",
      "BALNCE000987654320240131FUND20000000490.00HOLD    ",
      "ALLOCA0009876543PLANROTH045.520240201MODEL-B   ",
      "MEMBER0009876543AVERY     THOMAS        19921103TX"
    ]
  };

  return rowsBySource[sourceName].join("\n");
}

function buildWorkbookXml(run) {
  const styles = `
    <Styles>
      <Style ss:ID="Default" ss:Name="Normal">
        <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        <Borders/>
        <Font ss:FontName="Calibri" ss:Size="11"/>
      </Style>
      <Style ss:ID="Header">
        <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        <Font ss:Bold="1"/>
        <Interior ss:Color="#EEDBC4" ss:Pattern="Solid"/>
      </Style>
      <Style ss:ID="DateCell">
        <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        <NumberFormat ss:Format="yyyy-mm-dd"/>
      </Style>
      <Style ss:ID="NumberCell">
        <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        <NumberFormat ss:Format="0.00"/>
      </Style>
    </Styles>
  `;

  const worksheets = run.parsedReports
    .map((report) => {
      const columns = report.fields.map(() => '<Column ss:Width="110"/>').join("");
      const headerCells = report.fields
        .map((field) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(field.header)}</Data></Cell>`)
        .join("");

      const rowCells = report.rows
        .map((item) => {
          const cells = report.fields
            .map((field) => {
              const cell = workbookCell(item.typedRow[field.header], field.dataType);
              return `<Cell ss:StyleID="${cell.styleId}"><Data ss:Type="${cell.type}">${escapeXml(cell.value)}</Data></Cell>`;
            })
            .join("");
          return `<Row>${cells}</Row>`;
        })
        .join("");

      return `
        <Worksheet ss:Name="${escapeXml(report.recordCode)}">
          <Table>
            ${columns}
            <Row>${headerCells}</Row>
            ${rowCells}
          </Table>
        </Worksheet>
      `;
    })
    .join("");

  return `<?xml version="1.0"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:html="http://www.w3.org/TR/REC-html40">
      <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
        <Author>Codex</Author>
        <Created>${new Date().toISOString()}</Created>
      </DocumentProperties>
      <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
        <WindowHeight>9000</WindowHeight>
        <WindowWidth>16000</WindowWidth>
      </ExcelWorkbook>
      ${styles}
      ${worksheets}
    </Workbook>`;
}

function workbookCell(value, dataType) {
  if (value === "") {
    return { type: "String", value: "", styleId: "Default" };
  }

  if ((dataType === "decimal" || dataType === "integer") && typeof value === "number" && Number.isFinite(value)) {
    return { type: "Number", value: String(value), styleId: "NumberCell" };
  }

  if (dataType === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return { type: "DateTime", value: `${value}T00:00:00.000`, styleId: "DateCell" };
  }

  return { type: "String", value: String(value), styleId: "Default" };
}

function downloadBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value) {
  return escapeHtml(value);
}

init();
