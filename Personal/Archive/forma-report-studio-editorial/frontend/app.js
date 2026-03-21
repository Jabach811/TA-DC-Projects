const state = {
  selectedReport: "",
  selectedFile: "",
  bootstrap: null,
};

function setStatus(tone, title, copy) {
  const strip = document.getElementById("status-strip");
  strip.className = `status-strip ${tone}`;
  document.getElementById("status-title").textContent = title;
  document.getElementById("status-copy").textContent = copy;
  document.getElementById("hero-status").textContent = title;
  document.getElementById("hero-status-sub").textContent = copy;
}

function setResult(result) {
  document.getElementById("result-title").textContent = result.title;
  document.getElementById("result-selected").textContent = result.selected || "-";
  document.getElementById("result-detected").textContent = result.detected || "-";
  document.getElementById("result-output").textContent = result.output || "-";
  document.getElementById("result-message").textContent = result.message || "";
  document.getElementById("side-selected").textContent = result.selected || "-";
  document.getElementById("side-detected").textContent = result.detected || "-";
}

function refreshButtons() {
  document.querySelectorAll(".type-card").forEach((button) => {
    button.classList.toggle("active", button.dataset.report === state.selectedReport);
  });
}

async function getBridge() {
  if (window.pywebview && window.pywebview.api) return window.pywebview.api;
  return {
    bootstrap: async () => ({
      settings: {
        output_root: "Pywebview bridge not connected yet",
      },
    }),
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

async function bootstrap() {
  const bridge = await getBridge();
  const data = await bridge.bootstrap();
  state.bootstrap = data;
  document.getElementById("sidebar-root").textContent = data.settings.output_root || "-";
}

async function tryRun() {
  if (!state.selectedReport || !state.selectedFile) return;

  const bridge = await getBridge();
  setStatus("warn", "Checking Match", "Making sure the selected report type matches the PDF before extraction.");

  const detection = await bridge.detect_document_type(state.selectedFile);
  const detected = detection.label || "Unknown";

  if (detected !== "Unknown" && detected !== state.selectedReport) {
    setStatus("bad", "Wrong Report Type", `This file looks like ${detected}, not ${state.selectedReport}. Pick the matching report type and try again.`);
    setResult({
      title: "Validation stopped the extraction",
      selected: state.selectedReport,
      detected,
      output: "-",
      message: "The selected report type did not match the detected document type, so the extraction was blocked.",
    });
    return;
  }

  setStatus("warn", "Running Extraction", "The parser is working on the PDF now.");
  const result = await bridge.run_extraction(state.selectedReport, state.selectedFile);

  if (result.success) {
    setStatus("good", "Extraction Complete", "The workbook was created successfully.");
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

  setStatus("bad", "Extraction Failed", result.error || "Something went wrong during extraction.");
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
  if (!picked) return;
  state.selectedFile = picked;
  document.getElementById("file-display").textContent = picked;
  setStatus("warn", "File Selected", "The app will now validate the PDF and run extraction when it has everything it needs.");
  await tryRun();
}

document.querySelectorAll(".type-card").forEach((button) => {
  button.addEventListener("click", async () => {
    state.selectedReport = button.dataset.report;
    refreshButtons();
    setStatus("warn", "Report Type Selected", "Now choose the PDF file, or extraction will begin if the file is already selected.");
    await tryRun();
  });
});

document.getElementById("pick-file-btn").addEventListener("click", pickFile);

setResult({
  title: "No extraction run yet",
  selected: "-",
  detected: "-",
  output: "-",
  message: "Choose a report type and PDF file to begin.",
});
bootstrap();
