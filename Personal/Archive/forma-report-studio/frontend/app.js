const state = {
  selectedReport: "",
  selectedFile: "",
};

function setStatus(tone, title, copy) {
  const card = document.getElementById("status-card");
  card.className = `status-card ${tone}`;
  document.getElementById("status-title").textContent = title;
  document.getElementById("status-copy").textContent = copy;
}

function setResult(result) {
  document.getElementById("result-title").textContent = result.title;
  document.getElementById("result-selected").textContent = result.selected || "-";
  document.getElementById("result-detected").textContent = result.detected || "-";
  document.getElementById("result-output").textContent = result.output || "-";
  document.getElementById("result-message").textContent = result.message || "";
}

function refreshButtons() {
  document.querySelectorAll(".report-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.report === state.selectedReport);
  });
}

async function getBridge() {
  if (window.pywebview && window.pywebview.api) return window.pywebview.api;
  return {
    pick_pdf_file: async () => "",
    detect_document_type: async () => ({ label: "Unknown", confidence: 0 }),
    run_extraction: async (reportType, pdfPath) => ({
      success: false,
      report_type: reportType,
      input_file: pdfPath,
      error: "Bridge unavailable. Launch through the Python desktop host.",
    }),
  };
}

async function tryRun() {
  if (!state.selectedReport || !state.selectedFile) {
    return;
  }

  const bridge = await getBridge();
  setStatus("warn", "Checking report type", "Making sure the selected button matches the PDF.");

  const detection = await bridge.detect_document_type(state.selectedFile);
  const detected = detection.label || "Unknown";

  if (detected !== "Unknown" && detected !== state.selectedReport) {
    setStatus(
      "bad",
      "Wrong report type selected",
      `This file looks like ${detected}, not ${state.selectedReport}. Pick the matching button and try again.`
    );
    setResult({
      title: "Validation stopped the extraction",
      selected: state.selectedReport,
      detected,
      output: "-",
      message: "The app blocked the run because the selected report button did not match the detected PDF type.",
    });
    return;
  }

  setStatus("warn", "Running extraction", "The parser is working on the file now.");

  const result = await bridge.run_extraction(state.selectedReport, state.selectedFile);
  if (result.success) {
    setStatus("good", "Extraction complete", "The workbook was created successfully.");
    setResult({
      title: "Workbook created successfully",
      selected: state.selectedReport,
      detected: result.detected_type || detected,
      output: result.output_file || "-",
      message: result.warnings && result.warnings.length
        ? result.warnings.join(" ")
        : "The file was processed and saved.",
    });
    return;
  }

  setStatus("bad", "Extraction failed", result.error || "Something went wrong during extraction.");
  setResult({
    title: "Extraction failed",
    selected: state.selectedReport,
    detected: result.detected_type || detected,
    output: "-",
    message: result.error || "Something went wrong during extraction.",
  });
}

async function pickFile() {
  const bridge = await getBridge();
  const picked = await bridge.pick_pdf_file();
  if (!picked) {
    return;
  }
  state.selectedFile = picked;
  document.getElementById("file-display").textContent = picked;
  setStatus("warn", "File selected", "Report type check will run automatically when both choices are ready.");
  await tryRun();
}

document.querySelectorAll(".report-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    state.selectedReport = button.dataset.report;
    refreshButtons();
    setStatus("warn", "Report type selected", "Now choose the PDF file, or extraction will begin if the file is already selected.");
    await tryRun();
  });
});

document.getElementById("pick-file-btn").addEventListener("click", pickFile);

setResult({
  title: "No extraction run yet",
  selected: "-",
  detected: "-",
  output: "-",
  message: "Choose a report type and a PDF file to begin.",
});
