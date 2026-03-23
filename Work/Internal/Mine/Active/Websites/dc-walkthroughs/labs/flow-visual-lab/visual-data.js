window.DC_FLOW_VISUALS = {
  flows: [
    {
      slug: "payroll",
      title: "Payroll Integration",
      subtitle: "Vendor identification to live payroll processing",
      summary: "Good stress-test for early branching, validation gates, and a clean merge back into the main path.",
      sections: [
        {
          label: "Phase I - Vendor Identification",
          color: "blue",
          items: [
            { kind: "node", tone: "start", icon: "Start", step: "Start", title: "Payroll Integration Begins", body: "New client or new payroll setup." },
            { kind: "node", tone: "blue", icon: "Vendor", step: "Step 01", title: "Identify the payroll vendor", body: "Confirmed from client intake or onboarding docs." },
            { kind: "node", tone: "blue", icon: "Contact", step: "Step 02", title: "Obtain vendor point of contact", body: "Name, email, phone, and who you will work with directly." }
          ]
        },
        {
          label: "Phase II - Template & Walkthrough",
          color: "green",
          items: [
            { kind: "node", tone: "green", icon: "Template", step: "Step 03", title: "Create the payroll file template", body: "Standard import format this vendor will use going forward." },
            { kind: "node", tone: "green", icon: "Send", step: "Step 04", title: "Send template to vendor contact", body: "Include field-by-field notes and a heads-up that a meeting is coming." },
            { kind: "decision", tone: "yellow", icon: "Decision", step: "Step 05", title: "Meeting or email walkthrough?", body: "This is the main early branch in the static flow.", chips: ["Meeting preferred", "Email fallback"] },
            {
              kind: "branch-group",
              branches: [
                { label: "Meeting Path", tone: "green", nodes: [{ kind: "node", tone: "green", icon: "Meet", step: "Action", title: "Meet with vendor", body: "Walk the template field by field and discuss cadence." }] },
                { label: "Email Path", tone: "yellow", nodes: [{ kind: "node", tone: "yellow", icon: "Email", step: "Action", title: "Send comprehensive email walkthrough", body: "Cover the same agenda and request written confirmation." }] }
              ]
            }
          ]
        },
        {
          label: "Phase III - Test File & Validation",
          color: "orange",
          items: [
            { kind: "node", tone: "yellow", icon: "Inbox", step: "Step 06", title: "Vendor sends test file", body: "Vendor reformats output to match your template." },
            { kind: "node", tone: "yellow", icon: "System", step: "Step 07", title: "Run test file through EDS Layout", body: "Confirms clean processing and exposes format issues." },
            { kind: "decision", tone: "red", icon: "Gate", step: "Step 08", title: "EDS validation result?", body: "Passes clean or loops back with vendor feedback.", chips: ["Pass to OnePayroll", "Fail and loop back"] },
            { kind: "node", tone: "orange", icon: "Validate", step: "Step 09", title: "Send to OnePayroll", body: "OP reviews and returns results with any issues." },
            { kind: "decision", tone: "orange", icon: "Gate", step: "Step 10", title: "OnePayroll results?", body: "All clear proceeds to production; tweaks return for resubmission.", chips: ["All clear", "Tweaks needed"] }
          ]
        },
        {
          label: "Phase IV - Live Processing",
          color: "green",
          items: [
            { kind: "node", tone: "green", icon: "Schedule", step: "Step 11a", title: "Schedule first live run", body: "Training and first payroll happen in the same meeting." },
            { kind: "node", tone: "end", icon: "Done", step: "Step 11b", title: "Process first payroll live with client", body: "Integration complete." },
            { kind: "note", tone: "blue", title: "Key Pattern", body: "Linear flow with one early fork and two validation gates. This is a strong test case for hint chips, merge language, and gate styling." }
          ]
        }
      ]
    },
    {
      slug: "balance",
      title: "Balance Import",
      subtitle: "Three-method process with shared setup and parallel branches",
      summary: "Best stress-test for path labels, multi-column branch cards, quick-reference chips, and section callouts.",
      sections: [
        {
          label: "Phase I - Shared Foundation",
          color: "orange",
          items: [
            { kind: "node", tone: "start", icon: "Start", step: "Start", title: "Balance Import Initiated", body: "Wire expected and import method already determined." },
            { kind: "decision", tone: "orange", icon: "Method", step: "Step 01", title: "Which import method applies?", body: "Cash conversion, mapping, or transfer-in-kind.", chips: ["Cash", "Mapping", "TIK"] }
          ]
        },
        {
          label: "Phase II - Parallel Method Setup",
          color: "purple",
          items: [
            {
              kind: "branch-group",
              branches: [
                { label: "Cash", tone: "blue", nodes: [{ kind: "node", tone: "blue", icon: "Cash", step: "Step 04", title: "Source mapping complete", body: "Simple setup and skip-ahead behavior." }, { kind: "note", tone: "blue", title: "Skip Behavior", body: "Cash conversion skips the CONV-file-heavy branch." }] },
                { label: "Mapping", tone: "green", nodes: [{ kind: "node", tone: "green", icon: "Map", step: "Step 06", title: "Complete fund mapping file", body: "Macro available in the VBA Repo." }, { kind: "node", tone: "green", icon: "P2", step: "Step 07", title: "Create parameter file", body: "Create ref number and set effective date." }] },
                { label: "Transfer In-Kind", tone: "purple", nodes: [{ kind: "node", tone: "purple", icon: "TIK", step: "Step 06", title: "Complete TIK fund mapping file", body: "Same foundation, but re-reg logic changes transaction type." }, { kind: "node", tone: "purple", icon: "P2", step: "Step 07", title: "Create parameter file", body: "Ref number and effective date with TIK constraints." }] }
              ]
            }
          ]
        },
        {
          label: "Phase III - Method-Specific Execution",
          color: "red",
          items: [
            {
              kind: "branch-group",
              branches: [
                { label: "Cash", tone: "blue", nodes: [{ kind: "node", tone: "blue", icon: "Workflow", step: "Step 11", title: "Run CITS Balances workflow", body: "Test runs available." }] },
                { label: "Mapping", tone: "green", nodes: [{ kind: "node", tone: "green", icon: "Workflow", step: "Step 12", title: "Run Day of Wire workflow", body: "Production-only workflow on wire day." }, { kind: "decision", tone: "red", icon: "Check", step: "Step 10", title: "Dummy participant exists?", body: "Critical check before any import.", chips: ["Confirmed", "Do not proceed"] }] },
                { label: "TIK", tone: "purple", nodes: [{ kind: "node", tone: "purple", icon: "Workflow", step: "Step 12", title: "Wait for shares then run Day of Wire workflow", body: "Same production-only constraint." }, { kind: "decision", tone: "red", icon: "Check", step: "Step 10", title: "Dummy participant exists?", body: "Critical pre-import check.", chips: ["Confirmed", "Do not proceed"] }] }
              ]
            }
          ]
        },
        {
          label: "Phase IV - Common Closeout",
          color: "green",
          items: [
            { kind: "node", tone: "orange", icon: "Query", step: "Step 13", title: "Run all balance import queries", body: "Confirm clean load across all methods." },
            { kind: "node", tone: "green", icon: "Apply", step: "Step 17", title: "Apply balances to participant accounts", body: "Shared execution point after method-specific setup." },
            { kind: "node", tone: "end", icon: "Done", step: "Complete", title: "Balance import complete", body: "Participant accounts are whole." },
            { kind: "note", tone: "red", title: "Key Difference", body: "Re-Reg flag and Process Immediate setting are the most critical quick-reference hints between Mapping and TIK." }
          ]
        }
      ]
    }
  ],
  variants: [
    { slug: "ledger-routes", name: "Ledger Routes", family: "Editorial", mode: "static" },
    { slug: "briefing-arcs", name: "Briefing Arcs", family: "Editorial", mode: "interactive" },
    { slug: "mesh-diagram", name: "Mesh Diagram", family: "Systems", mode: "interactive" },
    { slug: "signal-blueprint", name: "Signal Blueprint", family: "Systems", mode: "static" },
    { slug: "glass-lanes", name: "Glass Lanes", family: "Glossy Product", mode: "interactive" },
    { slug: "aurora-rails", name: "Aurora Rails", family: "Glossy Product", mode: "static" },
    { slug: "studio-threads", name: "Studio Threads", family: "Warm Studio", mode: "interactive" },
    { slug: "binder-map", name: "Binder Map", family: "Warm Studio", mode: "static" },
    { slug: "constellation-route", name: "Constellation Route", family: "Immersive", mode: "interactive" },
    { slug: "dossier-circuit", name: "Dossier Circuit", family: "Immersive", mode: "static" }
  ]
};
