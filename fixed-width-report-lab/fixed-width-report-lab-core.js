(function () {
  var dataSourceSelect = document.getElementById("dataSourceSelect");
  var sourceDetails = document.getElementById("sourceDetails");
  var fileInput = document.getElementById("fileInput");
  var filePickerText = document.getElementById("filePickerText");
  var caseNumberInput = document.getElementById("caseNumberInput");
  var caseNumberMessage = document.getElementById("caseNumberMessage");
  var planNameInput = document.getElementById("planNameInput");
  var payloadInput = document.getElementById("payloadInput");
  var totalLinesText = document.getElementById("totalLinesText");
  var acceptedLinesText = document.getElementById("acceptedLinesText");
  var discardedLinesText = document.getElementById("discardedLinesText");
  var reportsFoundText = document.getElementById("reportsFoundText");
  var discardText = document.getElementById("discardText");
  var errorText = document.getElementById("errorText");
  var reportOutputs = document.getElementById("reportOutputs");
  var exportBtn = document.getElementById("exportWorkbookBtn");

  var currentFileName = "";
  var lastParseResult = null;
  var PREVIEW_ROW_LIMIT = 20;

  var CONFIG = {
    DATOSAURUS: {
      label: "DATOSAURUS",
      recordStart: 1,
      recordLength: 6,
      reports: ["BALNCE", "ALLOCA", "MEMBER"],
      layouts: {
        BALNCE: [
          { header: "Record", start: 1, length: 6, type: "text" },
          { header: "Account", start: 7, length: 10, type: "text" },
          { header: "As Of Date", start: 17, length: 8, type: "date" },
          { header: "Fund", start: 25, length: 8, type: "text" },
          { header: "Balance", start: 33, length: 10, type: "decimal" },
          { header: "Status", start: 43, length: 8, type: "text" },
          { header: "Currency", start: 51, length: 3, type: "text" },
          { header: "Advisor", start: 54, length: 8, type: "text" },
          { header: "Office", start: 62, length: 6, type: "text" },
          { header: "Risk", start: 68, length: 4, type: "text" },
          { header: "Comment", start: 72, length: 12, type: "text" }
        ],
        ALLOCA: [
          { header: "Record", start: 1, length: 6, type: "text" },
          { header: "Account", start: 7, length: 10, type: "text" },
          { header: "Plan", start: 17, length: 8, type: "text" },
          { header: "Percent", start: 25, length: 5, type: "decimal" },
          { header: "Effective Date", start: 30, length: 8, type: "date" },
          { header: "Model", start: 38, length: 10, type: "text" },
          { header: "Source Sys", start: 48, length: 8, type: "text" },
          { header: "Auto", start: 56, length: 1, type: "text" },
          { header: "Model Grp", start: 57, length: 6, type: "text" },
          { header: "Rep ID", start: 63, length: 6, type: "text" },
          { header: "Channel", start: 69, length: 6, type: "text" }
        ],
        MEMBER: [
          { header: "Record", start: 1, length: 6, type: "text" },
          { header: "Member ID", start: 7, length: 10, type: "text" },
          { header: "First Name", start: 17, length: 10, type: "text" },
          { header: "Last Name", start: 27, length: 14, type: "text" },
          { header: "Birth Date", start: 41, length: 8, type: "date" },
          { header: "State", start: 49, length: 2, type: "text" },
          { header: "Email", start: 51, length: 18, type: "text" },
          { header: "Segment", start: 69, length: 8, type: "text" },
          { header: "Tier", start: 77, length: 4, type: "text" },
          { header: "Enroll Date", start: 81, length: 8, type: "date" }
        ]
      }
    },
    LEDGERPRO: {
      label: "LEDGERPRO",
      recordStart: 4,
      recordLength: 5,
      reports: ["SUMRY", "DETAL", "AGENT"],
      layouts: {
        SUMRY: [
          { header: "Prefix", start: 1, length: 3, type: "text" },
          { header: "Record", start: 4, length: 5, type: "text" },
          { header: "Batch", start: 9, length: 6, type: "text" },
          { header: "Run Date", start: 15, length: 8, type: "date" },
          { header: "Region", start: 23, length: 6, type: "text" },
          { header: "Total", start: 29, length: 8, type: "decimal" },
          { header: "Owner", start: 37, length: 8, type: "text" },
          { header: "Product", start: 45, length: 8, type: "text" },
          { header: "Count", start: 53, length: 4, type: "integer" },
          { header: "Cycle", start: 57, length: 6, type: "text" }
        ],
        DETAL: [
          { header: "Prefix", start: 1, length: 3, type: "text" },
          { header: "Record", start: 4, length: 5, type: "text" },
          { header: "Case ID", start: 9, length: 8, type: "text" },
          { header: "Item Code", start: 17, length: 6, type: "text" },
          { header: "Units", start: 23, length: 4, type: "integer" },
          { header: "Amount", start: 27, length: 8, type: "decimal" },
          { header: "Status", start: 35, length: 6, type: "text" },
          { header: "Queue", start: 41, length: 6, type: "text" },
          { header: "Analyst", start: 47, length: 8, type: "text" },
          { header: "Region", start: 55, length: 6, type: "text" },
          { header: "Note", start: 61, length: 10, type: "text" }
        ],
        AGENT: [
          { header: "Prefix", start: 1, length: 3, type: "text" },
          { header: "Record", start: 4, length: 5, type: "text" },
          { header: "Agent ID", start: 9, length: 6, type: "text" },
          { header: "Agent Name", start: 15, length: 12, type: "text" },
          { header: "Start Date", start: 27, length: 8, type: "date" },
          { header: "State", start: 35, length: 2, type: "text" },
          { header: "Team", start: 37, length: 8, type: "text" },
          { header: "Channel", start: 45, length: 6, type: "text" },
          { header: "License", start: 51, length: 8, type: "text" },
          { header: "Active", start: 59, length: 1, type: "text" }
        ]
      }
    },
    NEXUSOPS: {
      label: "NEXUSOPS",
      recordStart: 3,
      recordLength: 4,
      reports: ["ENRL", "TERM", "DEPN"],
      layouts: {
        ENRL: [
          { header: "Prefix", start: 1, length: 2, type: "text" },
          { header: "Record", start: 3, length: 4, type: "text" },
          { header: "Employee ID", start: 7, length: 8, type: "text" },
          { header: "Plan", start: 15, length: 6, type: "text" },
          { header: "Coverage", start: 21, length: 8, type: "text" },
          { header: "Start Date", start: 29, length: 8, type: "date" },
          { header: "Option", start: 37, length: 6, type: "text" },
          { header: "Payroll", start: 43, length: 8, type: "text" },
          { header: "Location", start: 51, length: 8, type: "text" },
          { header: "Status", start: 59, length: 8, type: "text" }
        ],
        TERM: [
          { header: "Prefix", start: 1, length: 2, type: "text" },
          { header: "Record", start: 3, length: 4, type: "text" },
          { header: "Employee ID", start: 7, length: 8, type: "text" },
          { header: "Term Date", start: 15, length: 8, type: "date" },
          { header: "Reason", start: 23, length: 10, type: "text" },
          { header: "Status", start: 33, length: 6, type: "text" },
          { header: "Dept", start: 39, length: 8, type: "text" },
          { header: "Manager", start: 47, length: 10, type: "text" },
          { header: "Final Pay", start: 57, length: 8, type: "decimal" },
          { header: "Rehire", start: 65, length: 1, type: "text" }
        ],
        DEPN: [
          { header: "Prefix", start: 1, length: 2, type: "text" },
          { header: "Record", start: 3, length: 4, type: "text" },
          { header: "Employee ID", start: 7, length: 8, type: "text" },
          { header: "Dependent", start: 15, length: 10, type: "text" },
          { header: "Relation", start: 25, length: 6, type: "text" },
          { header: "Birth Date", start: 31, length: 8, type: "date" },
          { header: "Gender", start: 39, length: 1, type: "text" },
          { header: "Covered", start: 40, length: 1, type: "text" },
          { header: "Plan", start: 41, length: 6, type: "text" },
          { header: "Start", start: 47, length: 8, type: "date" },
          { header: "End", start: 55, length: 8, type: "date" }
        ]
      }
    },
    CLAIMWIRE: {
      label: "CLAIMWIRE",
      recordStart: 5,
      recordLength: 3,
      reports: ["HDR", "CLM", "PAY"],
      layouts: {
        HDR: [
          { header: "Control", start: 1, length: 4, type: "text" },
          { header: "Record", start: 5, length: 3, type: "text" },
          { header: "File Date", start: 8, length: 8, type: "date" },
          { header: "Carrier", start: 16, length: 8, type: "text" },
          { header: "Batch ID", start: 24, length: 6, type: "text" },
          { header: "Division", start: 30, length: 8, type: "text" },
          { header: "LOB", start: 38, length: 6, type: "text" },
          { header: "Submitter", start: 44, length: 8, type: "text" },
          { header: "Version", start: 52, length: 3, type: "text" }
        ],
        CLM: [
          { header: "Control", start: 1, length: 4, type: "text" },
          { header: "Record", start: 5, length: 3, type: "text" },
          { header: "Claim ID", start: 8, length: 9, type: "text" },
          { header: "Member ID", start: 17, length: 8, type: "text" },
          { header: "Service Date", start: 25, length: 8, type: "date" },
          { header: "Amount", start: 33, length: 8, type: "decimal" },
          { header: "Proc Code", start: 41, length: 6, type: "text" },
          { header: "Provider", start: 47, length: 8, type: "text" },
          { header: "Network", start: 55, length: 6, type: "text" },
          { header: "Paid Status", start: 61, length: 6, type: "text" }
        ],
        PAY: [
          { header: "Control", start: 1, length: 4, type: "text" },
          { header: "Record", start: 5, length: 3, type: "text" },
          { header: "Claim ID", start: 8, length: 9, type: "text" },
          { header: "Check No", start: 17, length: 6, type: "text" },
          { header: "Paid Date", start: 23, length: 8, type: "date" },
          { header: "Paid Amt", start: 31, length: 8, type: "decimal" },
          { header: "Method", start: 39, length: 6, type: "text" },
          { header: "Bank", start: 45, length: 8, type: "text" },
          { header: "Trace", start: 53, length: 8, type: "text" },
          { header: "Recon", start: 61, length: 1, type: "text" }
        ]
      }
    },
    FUNDTRACK: {
      label: "FUNDTRACK",
      recordStart: 2,
      recordLength: 7,
      reports: ["POSHOLD", "TXNADJ", "CASHSUM"],
      layouts: {
        POSHOLD: [
          { header: "Flag", start: 1, length: 1, type: "text" },
          { header: "Record", start: 2, length: 7, type: "text" },
          { header: "Account", start: 9, length: 8, type: "text" },
          { header: "Fund", start: 17, length: 8, type: "text" },
          { header: "Units", start: 25, length: 8, type: "decimal" },
          { header: "Price", start: 33, length: 8, type: "decimal" },
          { header: "Market Value", start: 41, length: 10, type: "decimal" },
          { header: "Cost Basis", start: 51, length: 10, type: "decimal" },
          { header: "Asset Class", start: 61, length: 8, type: "text" },
          { header: "CUSIP", start: 69, length: 9, type: "text" }
        ],
        TXNADJ: [
          { header: "Flag", start: 1, length: 1, type: "text" },
          { header: "Record", start: 2, length: 7, type: "text" },
          { header: "Account", start: 9, length: 8, type: "text" },
          { header: "Trade Date", start: 17, length: 8, type: "date" },
          { header: "Txn Type", start: 25, length: 6, type: "text" },
          { header: "Amount", start: 31, length: 9, type: "decimal" },
          { header: "Fund", start: 40, length: 8, type: "text" },
          { header: "NAV", start: 48, length: 8, type: "decimal" },
          { header: "Broker", start: 56, length: 8, type: "text" },
          { header: "Settle", start: 64, length: 8, type: "date" }
        ],
        CASHSUM: [
          { header: "Flag", start: 1, length: 1, type: "text" },
          { header: "Record", start: 2, length: 7, type: "text" },
          { header: "Account", start: 9, length: 8, type: "text" },
          { header: "As Of Date", start: 17, length: 8, type: "date" },
          { header: "Currency", start: 25, length: 3, type: "text" },
          { header: "Cash Balance", start: 28, length: 10, type: "decimal" },
          { header: "Available", start: 38, length: 10, type: "decimal" },
          { header: "Pending", start: 48, length: 10, type: "decimal" },
          { header: "Sweep", start: 58, length: 8, type: "text" },
          { header: "Desk", start: 66, length: 6, type: "text" }
        ]
      }
    }
  };

  function trimValue(value) {
    return String(value).replace(/^\s+|\s+$/g, "");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function sliceValue(line, start, length) {
    return trimValue(line.substring(start - 1, start - 1 + length));
  }

  function formatValue(value, type) {
    var clean = trimValue(value);
    var digits;
    if (!clean) {
      return "";
    }
    if (type === "date") {
      digits = clean.replace(/[^0-9]/g, "");
      if (digits.length === 8) {
        return digits.substring(0, 4) + "-" + digits.substring(4, 6) + "-" + digits.substring(6, 8);
      }
    }
    if (type === "decimal") {
      if (!isNaN(Number(clean))) {
        return Number(clean).toFixed(2);
      }
    }
    if (type === "integer") {
      if (!isNaN(Number(clean))) {
        return String(parseInt(clean, 10));
      }
    }
    return clean;
  }

  function getSelectedSource() {
    return CONFIG[dataSourceSelect.value];
  }

  function loadSourceOptions() {
    var key;
    var html = "";
    for (key in CONFIG) {
      if (CONFIG.hasOwnProperty(key)) {
        html += "<option value=\"" + escapeHtml(key) + "\">" + escapeHtml(CONFIG[key].label) + "</option>";
      }
    }
    dataSourceSelect.innerHTML = html;
  }

  function renderReportList(countsByReport) {
    var source = getSelectedSource();
    var cards = [];
    var i;
    for (i = 0; i < source.reports.length; i += 1) {
      var reportCode = source.reports[i];
      var count = countsByReport && countsByReport[reportCode] ? countsByReport[reportCode].length : 0;
      cards.push(
        "<div class=\"report-list-item\">" +
        "<span class=\"pill\">" + escapeHtml(reportCode) + "</span>" +
        "<strong>" + count + "</strong>" +
        "</div>"
      );
    }
    sourceDetails.innerHTML = "<div class=\"report-list-grid\">" + cards.join("") + "</div>";
  }

  function updateFileText() {
    filePickerText.innerHTML = currentFileName ? escapeHtml(currentFileName) : "No file chosen";
  }

  function clearResults() {
    totalLinesText.innerHTML = "0";
    acceptedLinesText.innerHTML = "0";
    discardedLinesText.innerHTML = "0";
    reportsFoundText.innerHTML = "None yet.";
    discardText.innerHTML = "None yet.";
    errorText.innerHTML = "";
    reportOutputs.innerHTML = "No parsed reports.";
    lastParseResult = null;
    if (exportBtn) {
      exportBtn.disabled = true;
    }
    if (dataSourceSelect.value) {
      renderReportList({});
    }
  }

  function setCaseMessage(message, isError) {
    if (!caseNumberMessage) {
      return;
    }
    caseNumberMessage.innerHTML = message;
    caseNumberMessage.className = isError ? "field-note error" : "field-note";
  }

  function validateAndFormatCaseNumber(applyFormatting) {
    if (!caseNumberInput) {
      return { valid: true, formatted: "", empty: true };
    }
    var raw = trimValue(caseNumberInput.value || "").toUpperCase();
    if (!raw) {
      setCaseMessage("", false);
      return { valid: true, formatted: "", empty: true };
    }

    var compact = raw.replace(/\s+/g, "");
    var prefix = compact.substring(0, 2);
    var digits = compact.substring(2).replace(/\D/g, "");
    var validPrefixes = {
      QK: { first: 5, spaces: 3, total: 10 },
      NQ: { first: 5, spaces: 3, total: 10 },
      TA: { first: 6, spaces: 2, total: 11 },
      TE: { first: 6, spaces: 2, total: 11 },
      TG: { first: 6, spaces: 2, total: 11 },
      JK: { first: 6, spaces: 2, total: 11 },
      TO: { first: 6, spaces: 2, total: 11 }
    };
    var rule = validPrefixes[prefix];

    if (!rule) {
      setCaseMessage("Case number must start with QK, NQ, TA, TE, TG, JK, or TO.", true);
      return { valid: false, formatted: raw, empty: false };
    }

    if (digits.length < rule.total) {
      setCaseMessage("Case number needs " + rule.total + " digits after " + prefix + ".", true);
      return { valid: false, formatted: raw, empty: false };
    }

    if (digits.length > rule.total) {
      setCaseMessage("Case number has too many digits for " + prefix + ".", true);
      return { valid: false, formatted: raw, empty: false };
    }

    var formatted = prefix + digits.substring(0, rule.first) + Array(rule.spaces + 1).join(" ") + digits.substring(rule.first);
    if (applyFormatting) {
      caseNumberInput.value = formatted;
    }
    setCaseMessage("Case number format looks good.", false);
    return { valid: true, formatted: formatted, empty: false };
  }

  function safeFilePart(value, fallback) {
    var clean = trimValue(value || "");
    if (!clean) {
      return fallback;
    }
    return clean.replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").replace(/^\.+|\.+$/g, "");
  }

  function tableHtml(headers, rows) {
    var html = "<table><thead><tr>";
    var i;
    for (i = 0; i < headers.length; i += 1) {
      html += "<th>" + escapeHtml(headers[i]) + "</th>";
    }
    html += "</tr></thead><tbody>";
    if (!rows.length) {
      html += "<tr><td colspan=\"" + headers.length + "\">No rows</td></tr>";
    }
    for (i = 0; i < rows.length; i += 1) {
      html += "<tr>";
      for (var j = 0; j < rows[i].length; j += 1) {
        html += "<td>" + escapeHtml(rows[i][j]) + "</td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table>";
    return html;
  }

  function renderParse(result) {
    lastParseResult = result;
    totalLinesText.innerHTML = String(result.totalLines);
    acceptedLinesText.innerHTML = String(result.acceptedLines);
    discardedLinesText.innerHTML = String(result.discardedLines);
    renderReportList(result.grouped);
    if (exportBtn) {
      exportBtn.disabled = !result.foundReports.length;
    }

    if (result.foundReports.length) {
      var chips = [];
      for (var i = 0; i < result.foundReports.length; i += 1) {
        chips.push("<span class=\"pill\">" + escapeHtml(result.foundReports[i]) + "</span>");
      }
      reportsFoundText.innerHTML = chips.join("");
    } else {
      reportsFoundText.innerHTML = "No matching reports found.";
    }

    if (result.discardReasons.length) {
      discardText.innerHTML = result.discardReasons.join("<br>");
    } else {
      discardText.innerHTML = "No discarded lines.";
    }

    if (result.errors.length) {
      errorText.innerHTML = "<div class=\"error-box\">" + result.errors.join("<br>") + "</div>";
    } else {
      errorText.innerHTML = "";
    }

    if (!result.blocks.length) {
      reportOutputs.innerHTML = "No parsed reports.";
      return;
    }

    reportOutputs.innerHTML = result.blocks.join("");
  }

  function parsePayload() {
    var source = getSelectedSource();
    var recordStart = source.recordStart;
    var recordLength = source.recordLength;
    var expected = source.reports;
    var layoutsByReport = source.layouts;
    if (!trimValue(payloadInput.value)) {
      clearResults();
      return;
    }
    var lines = payloadInput.value.split(/\r?\n/);
    var grouped = {};
    var foundReports = [];
    var discardMap = {};
    var totalLines = 0;
    var acceptedLines = 0;
    var discardedLines = 0;
    var blocks = [];
    var i;

    for (i = 0; i < lines.length; i += 1) {
      var line = lines[i];
      if (!trimValue(line)) {
        continue;
      }
      totalLines += 1;
      var record = sliceValue(line, recordStart, recordLength);
      if (expected.indexOf(record) === -1) {
        discardedLines += 1;
        discardMap["Unexpected record: " + (record || "(blank)")] = true;
        continue;
      }
      if (!layoutsByReport[record] || !layoutsByReport[record].length) {
        discardedLines += 1;
        discardMap["Missing layout for: " + record] = true;
        continue;
      }
      if (!grouped[record]) {
        grouped[record] = [];
        foundReports.push(record);
      }
      var fields = layoutsByReport[record];
      var row = [];
      for (var k = 0; k < fields.length; k += 1) {
        row.push(formatValue(sliceValue(line, fields[k].start, fields[k].length), fields[k].type));
      }
      grouped[record].push(row);
      acceptedLines += 1;
    }

    for (i = 0; i < expected.length; i += 1) {
      var code = expected[i];
      if (grouped[code]) {
        var headers = [];
        var layouts = layoutsByReport[code];
        var previewRows = grouped[code].slice(0, PREVIEW_ROW_LIMIT);
        for (var h = 0; h < layouts.length; h += 1) {
          headers.push(layouts[h].header);
        }
        blocks.push(
          "<div class=\"report-card\">" +
          "<h3>" + escapeHtml(code) + "</h3>" +
          "<p class=\"muted\">Showing " + previewRows.length + " of " + grouped[code].length + " row(s)</p>" +
          "<div class=\"report-table-wrap\">" + tableHtml(headers, previewRows) + "</div>" +
          "</div>"
        );
      }
    }

    var discardReasons = [];
    for (var key in discardMap) {
      if (discardMap.hasOwnProperty(key)) {
        discardReasons.push(key);
      }
    }

    renderParse({
      totalLines: totalLines,
      acceptedLines: acceptedLines,
      discardedLines: discardedLines,
      foundReports: foundReports,
      discardReasons: discardReasons,
      grouped: grouped,
      sourceLabel: source.label,
      currentFileName: currentFileName,
      caseNumber: validateAndFormatCaseNumber(true).formatted,
      planName: planNameInput ? trimValue(planNameInput.value) : "",
      layoutsByReport: layoutsByReport,
      errors: [],
      blocks: blocks
    });
  }

  function workbookCell(value, type) {
    var normalizedType = (type || "text").toLowerCase();
    if (value === "" || value == null) {
      return { kind: "text", value: "", styleId: 1 };
    }
    if (normalizedType === "integer" && !isNaN(Number(value))) {
      return { kind: "number", value: String(parseInt(value, 10)), styleId: 2 };
    }
    if (normalizedType === "decimal" && !isNaN(Number(value))) {
      return { kind: "number", value: String(Number(value)), styleId: 3 };
    }
    if (normalizedType === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      return { kind: "date", value: String(value), styleId: 4 };
    }
    return { kind: "text", value: String(value), styleId: 1 };
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function columnLetter(index) {
    var result = "";
    var current = index;
    while (current > 0) {
      var remainder = (current - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      current = Math.floor((current - 1) / 26);
    }
    return result;
  }

  function excelSerialFromIsoDate(iso) {
    var parts = iso.split("-");
    var utc = Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return String(Math.floor(utc / 86400000) + 25569);
  }

  function textCell(ref, text, styleId) {
    return "<c r=\"" + ref + "\" t=\"inlineStr\" s=\"" + styleId + "\"><is><t>" + escapeXml(text) + "</t></is></c>";
  }

  function numberCell(ref, value, styleId) {
    return "<c r=\"" + ref + "\" s=\"" + styleId + "\"><v>" + value + "</v></c>";
  }

  function formulaCell(ref, formula, text, styleId) {
    return "<c r=\"" + ref + "\" t=\"str\" s=\"" + styleId + "\"><f>" + escapeXml(formula) + "</f><v>" + escapeXml(text) + "</v></c>";
  }

  function worksheetXml(rows, columns) {
    var colsXml = columns && columns.length ? "<cols>" + columns.join("") + "</cols>" : "";
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
      "<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">" +
      colsXml +
      "<sheetData>" + rows.join("") + "</sheetData>" +
      "</worksheet>";
  }

  function buildWorkbookFiles(result) {
    var source = getSelectedSource();
    var titleRows = [];
    var sheetFiles = [];
    var sheetDefs = [];
    var contentOverrides = [];
    var workbookRels = [];
    var i;
    var sheetIndex = 1;

    titleRows.push("<row r=\"1\">" + textCell("A1", "Fixed-Width Report Extraction Console", 5) + textCell("B1", "", 1) + textCell("C1", "", 1) + "</row>");
    titleRows.push("<row r=\"2\">" + textCell("A2", "Data Source", 6) + textCell("B2", result.sourceLabel, 1) + "</row>");
    titleRows.push("<row r=\"3\">" + textCell("A3", "Input File", 6) + textCell("B3", result.currentFileName || "Not Provided", 1) + "</row>");
    titleRows.push("<row r=\"4\">" + textCell("A4", "Total Lines", 6) + numberCell("B4", String(result.totalLines), 2) + "</row>");
    titleRows.push("<row r=\"6\">" + textCell("A6", "Report Name", 6) + textCell("B6", "Row Count", 6) + textCell("C6", "Open Sheet", 6) + "</row>");

    for (i = 0; i < source.reports.length; i += 1) {
      var code = source.reports[i];
      var count = result.grouped[code] ? result.grouped[code].length : 0;
      var titleRowNumber = 7 + i;
      titleRows.push("<row r=\"" + titleRowNumber + "\">" +
        textCell("A" + titleRowNumber, code, 1) +
        numberCell("B" + titleRowNumber, String(count), 2) +
        formulaCell("C" + titleRowNumber, "HYPERLINK(\"#'" + code + "'!A1\",\"Open\")", "Open", 7) +
        "</row>");
    }

    sheetDefs.push({ name: "Title Page", path: "xl/worksheets/sheet1.xml" });
    workbookRels.push("<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet1.xml\"/>");
    contentOverrides.push("<Override PartName=\"/xl/worksheets/sheet1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");
    sheetFiles.push({
      path: "xl/worksheets/sheet1.xml",
      content: worksheetXml(titleRows, [
        "<col min=\"1\" max=\"1\" width=\"24\" customWidth=\"1\"/>",
        "<col min=\"2\" max=\"2\" width=\"24\" bestFit=\"1\" customWidth=\"1\"/>",
        "<col min=\"3\" max=\"3\" width=\"14\" customWidth=\"1\"/>"
      ])
    });

    for (i = 0; i < source.reports.length; i += 1) {
      var reportCode = source.reports[i];
      var rows = result.grouped[reportCode];
      var fields = result.layoutsByReport[reportCode];
      if (!fields) {
        continue;
      }
      sheetIndex += 1;
      var rowXml = [];
      var c;
      var headerCells = [];
      for (c = 0; c < fields.length; c += 1) {
        headerCells.push(textCell(columnLetter(c + 1) + "1", fields[c].header, 6));
      }
      rowXml.push("<row r=\"1\">" + headerCells.join("") + "</row>");
      for (var r = 0; rows && r < rows.length; r += 1) {
        var currentRow = rows[r] || [];
        var dataCells = [];
        for (c = 0; c < fields.length; c += 1) {
          var typed = workbookCell(currentRow[c], fields[c].type);
          var ref = columnLetter(c + 1) + String(r + 2);
          if (typed.kind === "number") {
            dataCells.push(numberCell(ref, typed.value, typed.styleId));
          } else if (typed.kind === "date") {
            dataCells.push(numberCell(ref, excelSerialFromIsoDate(typed.value), typed.styleId));
          } else {
            dataCells.push(textCell(ref, typed.value, typed.styleId));
          }
        }
        rowXml.push("<row r=\"" + (r + 2) + "\">" + dataCells.join("") + "</row>");
      }
      var sheetPath = "xl/worksheets/sheet" + sheetIndex + ".xml";
      sheetDefs.push({ name: reportCode, path: sheetPath });
      workbookRels.push("<Relationship Id=\"rId" + sheetIndex + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet" + sheetIndex + ".xml\"/>");
      contentOverrides.push("<Override PartName=\"/xl/worksheets/sheet" + sheetIndex + ".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");
      sheetFiles.push({
        path: sheetPath,
        content: worksheetXml(rowXml, [
          "<col min=\"1\" max=\"" + fields.length + "\" width=\"18\" customWidth=\"1\"/>"
        ])
      });
    }

    var workbookSheets = [];
    for (i = 0; i < sheetDefs.length; i += 1) {
      workbookSheets.push("<sheet name=\"" + escapeXml(sheetDefs[i].name) + "\" sheetId=\"" + (i + 1) + "\" r:id=\"rId" + (i + 1) + "\"/>");
    }

    return [
      { path: "[Content_Types].xml", content: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\"><Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/><Default Extension=\"xml\" ContentType=\"application/xml\"/><Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/><Override PartName=\"/xl/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\"/><Override PartName=\"/docProps/core.xml\" ContentType=\"application/vnd.openxmlformats-package.core-properties+xml\"/><Override PartName=\"/docProps/app.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.extended-properties+xml\"/>" + contentOverrides.join("") + "</Types>" },
      { path: "_rels/.rels", content: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/><Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties\" Target=\"docProps/core.xml\"/><Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties\" Target=\"docProps/app.xml\"/></Relationships>" },
      { path: "docProps/core.xml", content: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><cp:coreProperties xmlns:cp=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:dcterms=\"http://purl.org/dc/terms/\" xmlns:dcmitype=\"http://purl.org/dc/dcmitype/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><dc:creator>OpenAI Codex</dc:creator><cp:lastModifiedBy>OpenAI Codex</cp:lastModifiedBy><dcterms:created xsi:type=\"dcterms:W3CDTF\">" + new Date().toISOString() + "</dcterms:created><dcterms:modified xsi:type=\"dcterms:W3CDTF\">" + new Date().toISOString() + "</dcterms:modified></cp:coreProperties>" },
      { path: "docProps/app.xml", content: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Properties xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties\" xmlns:vt=\"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes\"><Application>Microsoft Excel</Application></Properties>" },
      { path: "xl/workbook.xml", content: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"><sheets>" + workbookSheets.join("") + "</sheets></workbook>" },
      { path: "xl/_rels/workbook.xml.rels", content: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" + workbookRels.join("") + "<Relationship Id=\"rId" + (sheetDefs.length + 1) + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/></Relationships>" },
      { path: "xl/styles.xml", content: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><styleSheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\"><fonts count=\"3\"><font><sz val=\"11\"/><name val=\"Calibri\"/></font><font><b/><sz val=\"11\"/><name val=\"Calibri\"/></font><font><b/><sz val=\"16\"/><name val=\"Calibri\"/></font></fonts><fills count=\"3\"><fill><patternFill patternType=\"none\"/></fill><fill><patternFill patternType=\"gray125\"/></fill><fill><patternFill patternType=\"solid\"><fgColor rgb=\"FFD9ECFF\"/><bgColor indexed=\"64\"/></patternFill></fill></fills><borders count=\"1\"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs><cellXfs count=\"8\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\"><alignment horizontal=\"center\" vertical=\"center\"/></xf><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf><xf numFmtId=\"1\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyNumberFormat=\"1\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf><xf numFmtId=\"2\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyNumberFormat=\"1\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf><xf numFmtId=\"14\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyNumberFormat=\"1\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf><xf numFmtId=\"0\" fontId=\"2\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyFont=\"1\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf><xf numFmtId=\"0\" fontId=\"1\" fillId=\"2\" borderId=\"0\" xfId=\"0\" applyFont=\"1\" applyFill=\"1\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf></cellXfs><cellStyles count=\"1\"><cellStyle name=\"Normal\" xfId=\"0\" builtinId=\"0\"/></cellStyles></styleSheet>" }
    ].concat(sheetFiles);
  }

  function crc32(bytes) {
    var crc = -1;
    for (var i = 0; i < bytes.length; i += 1) {
      crc ^= bytes[i];
      for (var j = 0; j < 8; j += 1) {
        crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function dosTime(date) {
    return ((date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)) & 0xFFFF;
  }

  function dosDate(date) {
    return ((((date.getFullYear() - 1980) & 0x7F) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()) & 0xFFFF;
  }

  function writeUInt16(array, value) {
    array.push(value & 255, (value >>> 8) & 255);
  }

  function writeUInt32(array, value) {
    array.push(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);
  }

  function createZip(files) {
    var encoder = new TextEncoder();
    var localParts = [];
    var centralParts = [];
    var offset = 0;
    var now = new Date();
    var time = dosTime(now);
    var date = dosDate(now);

    for (var i = 0; i < files.length; i += 1) {
      var file = files[i];
      var nameBytes = encoder.encode(file.path);
      var dataBytes = encoder.encode(file.content);
      var crc = crc32(dataBytes);
      var localHeader = [];
      writeUInt32(localHeader, 0x04034b50);
      writeUInt16(localHeader, 20);
      writeUInt16(localHeader, 0);
      writeUInt16(localHeader, 0);
      writeUInt16(localHeader, time);
      writeUInt16(localHeader, date);
      writeUInt32(localHeader, crc);
      writeUInt32(localHeader, dataBytes.length);
      writeUInt32(localHeader, dataBytes.length);
      writeUInt16(localHeader, nameBytes.length);
      writeUInt16(localHeader, 0);
      var localArray = new Uint8Array(localHeader.length + nameBytes.length + dataBytes.length);
      localArray.set(localHeader, 0);
      localArray.set(nameBytes, localHeader.length);
      localArray.set(dataBytes, localHeader.length + nameBytes.length);
      localParts.push(localArray);

      var centralHeader = [];
      writeUInt32(centralHeader, 0x02014b50);
      writeUInt16(centralHeader, 20);
      writeUInt16(centralHeader, 20);
      writeUInt16(centralHeader, 0);
      writeUInt16(centralHeader, 0);
      writeUInt16(centralHeader, time);
      writeUInt16(centralHeader, date);
      writeUInt32(centralHeader, crc);
      writeUInt32(centralHeader, dataBytes.length);
      writeUInt32(centralHeader, dataBytes.length);
      writeUInt16(centralHeader, nameBytes.length);
      writeUInt16(centralHeader, 0);
      writeUInt16(centralHeader, 0);
      writeUInt16(centralHeader, 0);
      writeUInt16(centralHeader, 0);
      writeUInt32(centralHeader, 0);
      writeUInt32(centralHeader, offset);
      var centralArray = new Uint8Array(centralHeader.length + nameBytes.length);
      centralArray.set(centralHeader, 0);
      centralArray.set(nameBytes, centralHeader.length);
      centralParts.push(centralArray);
      offset += localArray.length;
    }

    var centralSize = 0;
    for (var c = 0; c < centralParts.length; c += 1) {
      centralSize += centralParts[c].length;
    }
    var endRecord = [];
    writeUInt32(endRecord, 0x06054b50);
    writeUInt16(endRecord, 0);
    writeUInt16(endRecord, 0);
    writeUInt16(endRecord, files.length);
    writeUInt16(endRecord, files.length);
    writeUInt32(endRecord, centralSize);
    writeUInt32(endRecord, offset);
    writeUInt16(endRecord, 0);

    var blobs = [];
    for (var lp = 0; lp < localParts.length; lp += 1) {
      blobs.push(localParts[lp]);
    }
    for (var cp = 0; cp < centralParts.length; cp += 1) {
      blobs.push(centralParts[cp]);
    }
    blobs.push(new Uint8Array(endRecord));
    return new Blob(blobs, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  function downloadWorkbook() {
    if (!lastParseResult || !lastParseResult.foundReports.length) {
      return;
    }
    var caseState = validateAndFormatCaseNumber(true);
    if (!caseState.valid || caseState.empty) {
      setCaseMessage("Enter a valid case number before exporting.", true);
      if (caseNumberInput) {
        caseNumberInput.focus();
      }
      return;
    }
    var files = buildWorkbookFiles(lastParseResult);
    var blob = createZip(files);
    var anchor = document.createElement("a");
    var url = URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = safeFilePart(caseState.formatted, "Case Number") + " - " + safeFilePart(lastParseResult.planName, "Plan Name") + " - Full Parse.xlsx";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  fileInput.onchange = function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (event) {
      payloadInput.value = String(event.target.result || "").replace(/\r\n/g, "\n");
      currentFileName = file.name;
      updateFileText();
      parsePayload();
    };
    reader.readAsText(file);
  };

  dataSourceSelect.onchange = function () {
    renderReportList({});
    parsePayload();
  };

  if (caseNumberInput) {
    caseNumberInput.oninput = function () {
      caseNumberInput.value = String(caseNumberInput.value || "").toUpperCase();
      validateAndFormatCaseNumber(false);
    };
    caseNumberInput.onblur = function () {
      validateAndFormatCaseNumber(true);
    };
  }

  if (exportBtn) {
    exportBtn.onclick = function () {
      downloadWorkbook();
    };
  }

  if (fileInput.value) {
    fileInput.value = "";
  }

  loadSourceOptions();
  dataSourceSelect.value = "DATOSAURUS";
  renderReportList({});
  currentFileName = "";
  updateFileText();
  clearResults();
}());
