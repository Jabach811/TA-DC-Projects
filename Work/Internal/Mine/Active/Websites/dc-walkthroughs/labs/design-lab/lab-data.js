window.DC_LAB = {
  inspirations: [
    {
      title: "Scrollytelling examples",
      source: "Shorthand",
      url: "https://shorthand.com/the-craft/12-engaging-scrollytelling-examples-to-inspire/index.html",
      note: "Used for editorial pacing, chapter reveals, and long-form visual storytelling."
    },
    {
      title: "Timeline patterns",
      source: "Webflow",
      url: "https://webflow.com/made-in-webflow/timeline?cloneable=true",
      note: "Used for horizontal and sticky timeline treatments."
    },
    {
      title: "Colorful onboarding journey",
      source: "Webflow",
      url: "https://webflow.com/made-in-webflow/website/colorful-onboarding-journey",
      note: "Used for guided onboarding card stacks and cleaner product-tour shells."
    },
    {
      title: "Dynamic decision trees",
      source: "MDPI",
      url: "https://www.mdpi.com/2998916",
      note: "Used for clarity around state visibility, branching, and local decision-making."
    }
  ],
  flows: [
    {
      slug: "payroll",
      tag: "Payroll Integration",
      title: "Payroll Integration Setup",
      summary: "Vendor identification, template delivery, EDS validation, walkthrough, and live payroll confirmation.",
      stat: "Vendor-heavy",
      branch: "Meeting vs email walkthrough",
      phases: [
        { name: "Scope", steps: ["Confirm vendor, plan name, and payroll contacts", "Pull source files and identify integration method"] },
        { name: "Template & Walkthrough", steps: ["Send setup template with field-by-field notes", "Choose meeting or email walkthrough", "Capture client or vendor confirmation"] },
        { name: "Build", steps: ["Format EDS and OnePayroll records", "Validate contribution fields and payroll cycles"] },
        { name: "Launch", steps: ["Run final queries and backup validation", "Log completion and handoff notes"] }
      ]
    },
    {
      slug: "tik",
      tag: "Re-Registration",
      title: "Re-Registration & Transfer In-Kind",
      summary: "TOA review, template prep, prior recordkeeper coordination, share confirmation, and direct handoff into balance import.",
      stat: "Deadline-critical",
      branch: "Linear handoff into Balance Import",
      phases: [
        { name: "Review", steps: ["Check TOA for every re-registration flag", "Group funds and note liquidation timeline"] },
        { name: "Prep", steps: ["Build or macro-fill the re-registration template", "Submit to Matt O'Connell's team four weeks before liquidation"] },
        { name: "Confirm", steps: ["Verify prior recordkeeper responses", "Document exceptions and waiting points"] },
        { name: "Arrival", steps: ["Track incoming shares", "Match against final files and proceed to balance import"] }
      ]
    },
    {
      slug: "balance",
      tag: "Balance Import",
      title: "Balance Import Process - All Methods",
      summary: "Cash conversion, mapping, and transfer-in-kind paths with shared validation, Informatica, and backup-query checkpoints.",
      stat: "3 methods",
      branch: "Cash vs mapping vs TIK",
      phases: [
        { name: "Method Setup", steps: ["Confirm import method and expected wire timing", "Set P3 controls and required file family"] },
        { name: "Files", steps: ["Prepare fund mapping or conversion files", "Use macro acceleration where available", "Validate transaction and source rules"] },
        { name: "Load", steps: ["Run Informatica workflow and balance import queries", "Confirm participant accounts are whole"] },
        { name: "Closeout", steps: ["Run backup queries", "Log final counts and supporting output"] }
      ]
    },
    {
      slug: "loans",
      tag: "Loans",
      title: "Loan Setup & Processing",
      summary: "P3 configuration, conversion record prep, loan detail validation, workflow load, and final confirmation.",
      stat: "Rules-heavy",
      branch: "Mostly linear",
      phases: [
        { name: "Configure", steps: ["Capture case number, conversion number, and effective date", "Set loan controls in P3"] },
        { name: "Build", steps: ["Create conversion records", "Validate amortization, balance, and payment details"] },
        { name: "Load", steps: ["Run Informatica load and submit in P3", "Review errors or rework loops"] },
        { name: "Confirm", steps: ["Send confirmation", "Run standard verification queries"] }
      ]
    },
    {
      slug: "eligibility",
      tag: "Eligibility",
      title: "Eligibility Processing - Standard & Auto-Enroll",
      summary: "Plan document review, service and age rules, auto-enroll branching, EDS build, load, and verification.",
      stat: "Branching-rich",
      branch: "Standard vs auto-enroll",
      phases: [
        { name: "Review", steps: ["Pull the plan document", "Capture service, age, exclusion, and entry-date rules"] },
        { name: "Decision", steps: ["Determine whether auto-enrollment applies", "Set the path and default contribution logic"] },
        { name: "Build", steps: ["Calculate eligibility dates", "Create the EDS file and complete quality checks"] },
        { name: "Load", steps: ["Submit the load", "Log row counts, success, and rejected records"] }
      ]
    },
    {
      slug: "deferrals",
      tag: "Deferral Elections",
      title: "Deferral Elections - Pre-Tax, Roth & Flat Dollar",
      summary: "Election-type identification, plan-limit validation, EDS formatting, load confirmation, and payroll notice.",
      stat: "Validation-centric",
      branch: "Election type logic",
      phases: [
        { name: "Intake", steps: ["Receive election request", "Identify pre-tax, Roth, or flat-dollar structure"] },
        { name: "Rules", steps: ["Check limits and plan compatibility", "Capture required participant-level details"] },
        { name: "Format", steps: ["Create EDS records", "Run format and reasonability review"] },
        { name: "Confirm", steps: ["Load and validate", "Notify client or payroll contact"] }
      ]
    },
    {
      slug: "roth",
      tag: "Roth Basis",
      title: "Roth & After-Tax Basis Tracking",
      summary: "Source-type classification, start-date logic, basis math, conversion handling, EDS entry, and final documentation.",
      stat: "Calculation-rich",
      branch: "Type A, B, or C source",
      phases: [
        { name: "Classify", steps: ["Identify Roth or after-tax source type", "Confirm plan permissions and source code"] },
        { name: "Date & Basis", steps: ["Determine start-date requirement", "Calculate basis and earnings split"] },
        { name: "Conversion", steps: ["Decide whether an in-plan conversion needs separate treatment", "Document tax-reporting dependencies"] },
        { name: "Load", steps: ["Build EDS fields", "Log final basis totals and source details"] }
      ]
    }
  ],
  variants: [
    { id: "01", slug: "ledger-noir", name: "Ledger Noir", mode: "static", family: "Editorial / Premium", note: "Casefile editorial layout with chapter spreads and dramatic serif pacing." },
    { id: "02", slug: "review-room", name: "The Review Room", mode: "interactive", family: "Editorial / Premium", note: "Presentation-deck walkthrough with a sticky briefing rail and cleaner interactions." },
    { id: "03", slug: "control-mesh", name: "Control Mesh", mode: "interactive", family: "Systems / Data Ops", note: "Mission-control shell with diagnostics, route-state colors, and topology previews." },
    { id: "04", slug: "signal-ledger", name: "Signal Ledger", mode: "static", family: "Systems / Data Ops", note: "Ledger-card catalog with print-friendly swimlanes and logic legends." },
    { id: "05", slug: "neon-runway", name: "Neon Runway", mode: "interactive", family: "Glossy Product", note: "Launch-site energy, glass surfaces, and active branch rails." },
    { id: "06", slug: "aurora-product-deck", name: "Aurora Product Deck", mode: "static", family: "Glossy Product", note: "Brighter keynote deck with aurora gradients and chapter cards." },
    { id: "07", slug: "workshop-wall", name: "Workshop Wall", mode: "interactive", family: "Warm Studio", note: "Tactile board with pinned-note lanes and collaborative progress strings." },
    { id: "08", slug: "service-blueprint-ledger", name: "Service Blueprint Ledger", mode: "static", family: "Warm Studio", note: "Consulting blueprint binder with frontstage, backstage, and evidence lanes." },
    { id: "09", slug: "signal-constellation", name: "Signal Constellation", mode: "interactive", family: "Immersive Narrative", note: "Cinematic signal corridor with energized rails and floating dock." },
    { id: "10", slug: "casefile-drift", name: "Casefile Drift", mode: "static", family: "Immersive Narrative", note: "Layered dossier board with paper drift, stamps, and margin notes." }
  ]
};
