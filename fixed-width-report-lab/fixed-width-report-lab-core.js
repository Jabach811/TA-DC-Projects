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
    },
    NEWPORT: {
      label: "NEWPORT",
      recordStart: 1,
      recordLength: 2,
      reports: ["HD", "HR", "LN", "LD", "PT", "MT", "VA", "PL", "PR"],
      layouts: {
        HD: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "text" },
          { header: "PLAN-LEGAL-NAME", start: 12, length: 35, type: "text" },
          { header: "PLAN-YEAR-END-DATE", start: 47, length: 10, type: "date" }
        ],
        HR: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "text" },
          { header: "TRACKING-TYPE-CDE", start: 12, length: 1, type: "text" },
          { header: "TRACKING-YEAR-DTE", start: 13, length: 10, type: "date" },
          { header: "YR-TO-DATE-HRS-AMT", start: 23, length: 8, type: "decimal" },
          { header: "VST-SERVICE-YR-CNT", start: 31, length: 3, type: "decimal" }
        ],
        LN: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "text" },
          { header: "PART-LOAN-EXTL-ID", start: 12, length: 5, type: "text" },
          { header: "LOAN-OUTSTAND-AMT", start: 17, length: 17, type: "decimal" },
          { header: "LOAN-START-DTE", start: 34, length: 10, type: "date" },
          { header: "ORIGINAL-LOAN-AMT", start: 44, length: 17, type: "decimal" },
          { header: "SKED-LN-RPYMNT-AMT", start: 61, length: 17, type: "decimal" },
          { header: "LOAN-ANNL-INT-RTE", start: 78, length: 16, type: "decimal" },
          { header: "TOT-SKD-LNPYMNT-CNT", start: 94, length: 7, type: "decimal" },
          { header: "LOAN-1ST-PYMT-DTE", start: 101, length: 10, type: "date" },
          { header: "LOAN-PYMT-FREQ-CDE", start: 111, length: 1, type: "text" },
          { header: "MORTGAGE-LOAN-CDE", start: 112, length: 1, type: "text" },
          { header: "LOAN-DEEM-STAT-CDE", start: 113, length: 1, type: "text" },
          { header: "LOAN-MATURITY-DTE", start: 114, length: 10, type: "date" },
          { header: "TOT-LPYMT-TDTE-CNT", start: 124, length: 7, type: "decimal" },
          { header: "LST-LOAN-PYMNT-DTE", start: 131, length: 10, type: "date" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-1", start: 141, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-2", start: 158, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-3", start: 175, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-4", start: 192, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-5", start: 209, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-6", start: 226, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-7", start: 243, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-8", start: 260, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-9", start: 277, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-10", start: 294, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-11", start: 311, length: 17, type: "decimal" },
          { header: "MONTHLY-HIGH-LOAN-BALANCE-AMT-12", start: 328, length: 17, type: "decimal" },
          { header: "LON-RTH-TRM-LON-PPAL-BAS-AT", start: 345, length: 17, type: "decimal" },
          { header: "LON-ATX-TRM-LON-PPAL-BAS-AT", start: 362, length: 17, type: "decimal" }
        ],
        LD: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "text" },
          { header: "PART-LOAN-EXTL-ID", start: 12, length: 5, type: "text" },
          { header: "CONTR-MONEY-TY-CDE", start: 17, length: 3, type: "text" },
          { header: "LOAN-OUTSTAND-AMT", start: 20, length: 17, type: "decimal" },
          { header: "TTD-PRINCIPAL-PAID-AMT", start: 37, length: 17, type: "decimal" },
          { header: "TOTAL-INT-PAID-AMT", start: 54, length: 17, type: "decimal" },
          { header: "YTD-PRINCIPAL-PAID-AMT", start: 71, length: 17, type: "decimal" },
          { header: "YTD-INTEREST-PAID-AMT", start: 88, length: 17, type: "decimal" }
        ],
        PT: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "text" },
          { header: "PART-LOCATION-ID", start: 12, length: 9, type: "text" },
          { header: "STMNT-DEL-LCTN-NME", start: 21, length: 35, type: "text" },
          { header: "AFFILIATE-TAX-ID", start: 56, length: 9, type: "text" },
          { header: "PARTICIPANT-NME", start: 65, length: 35, type: "text" },
          { header: "PART-ADDR-1", start: 100, length: 35, type: "text" },
          { header: "PART-ADDR-2", start: 135, length: 35, type: "text" },
          { header: "PART-ADDR-3", start: 170, length: 35, type: "text" },
          { header: "PARTICIPANT-CITY", start: 205, length: 35, type: "text" },
          { header: "PART-ST-CNTRY-CDE", start: 240, length: 3, type: "text" },
          { header: "PART-ZIP-CDE", start: 243, length: 9, type: "text" },
          { header: "EXT-EMPLOYEE-ID", start: 252, length: 20, type: "text" },
          { header: "PART-BIRTH-DTE", start: 272, length: 10, type: "date" },
          { header: "PLAN-ENROLL-DTE", start: 282, length: 10, type: "date" },
          { header: "EMPLOYEE-HIRE-DTE", start: 292, length: 10, type: "date" },
          { header: "EMPLY-TERM-DTE", start: 302, length: 10, type: "date" },
          { header: "PART-DEATH-DTE", start: 312, length: 10, type: "date" },
          { header: "PART-SUSPENS-DTE", start: 322, length: 10, type: "date" },
          { header: "PART-DISABLE-DTE", start: 332, length: 10, type: "date" },
          { header: "PART-INACTIVE-DTE", start: 342, length: 10, type: "date" },
          { header: "EMPLY-RETIRE-DTE", start: 352, length: 10, type: "date" },
          { header: "EMPLY-REHIRE-DTE", start: 362, length: 10, type: "date" },
          { header: "PART-VEST-DTE", start: 372, length: 10, type: "date" },
          { header: "PART-STATUS-CDE", start: 382, length: 2, type: "text" },
          { header: "HI-COMP-EMPLOY-CDE", start: 384, length: 1, type: "text" },
          { header: "EMP-FAMLY-MEMB-CDE", start: 385, length: 1, type: "text" },
          { header: "KEY-EMPLOYEE-CDE", start: 386, length: 1, type: "text" },
          { header: "FORMER-KY-EMPLY-CD", start: 387, length: 1, type: "text" },
          { header: "COMPLIANCE-GRP-CDE", start: 388, length: 5, type: "text" },
          { header: "ASSOCIATED-HCE-TIN", start: 393, length: 9, type: "text" },
          { header: "EMPLOY-RLTV-TAX-ID", start: 402, length: 9, type: "text" },
          { header: "PART-SPOUSE-CDE", start: 411, length: 1, type: "text" },
          { header: "TOP-TEN-OWNER-CDE", start: 412, length: 1, type: "text" },
          { header: "EMP-OWNRSHP-LVL-CD", start: 413, length: 1, type: "text" },
          { header: "EMP-LNEAL-ASND-CDE", start: 414, length: 1, type: "text" },
          { header: "EMP-LNEAL-DSND-CDE", start: 415, length: 1, type: "text" },
          { header: "FRMR-HGH-CMP-EMP-C", start: 416, length: 1, type: "text" },
          { header: "MARITAL-ST-CDE", start: 417, length: 1, type: "text" },
          { header: "PLAN-YTD-SAL-AMT", start: 418, length: 17, type: "decimal" },
          { header: "PLAN-YR-SAL-UPD-DTE", start: 435, length: 10, type: "date" },
          { header: "PYTD-SALARY-DEDUCTION-AMT", start: 445, length: 17, type: "decimal" },
          { header: "PYTD-SALARY-DEDUCTION-DTE", start: 462, length: 10, type: "date" },
          { header: "PYTD-EMPLOYER-MATCH-MONEY-AMT", start: 472, length: 17, type: "decimal" },
          { header: "PYTD-EMPLOYER-MATCH-MONEY-DTE", start: 489, length: 10, type: "date" },
          { header: "PYTD-VOLUNTARY-MONEY-AMT", start: 499, length: 17, type: "decimal" },
          { header: "PYTD-VOLUNTARY-MONEY-DTE", start: 516, length: 10, type: "date" },
          { header: "AVAIL-HARDSHIP-WITHDRAWAL-AMT", start: 526, length: 17, type: "decimal" },
          { header: "PART-SPD-END-DT", start: 543, length: 10, type: "date" },
          { header: "PLN-MT-FIR-CNB-DT", start: 553, length: 10, type: "date" },
          { header: "PYTD-ROTH-ELECTIVE-DEFERRAL-AT", start: 563, length: 17, type: "decimal" },
          { header: "PYTD-ROTH-EDFR-DT", start: 580, length: 10, type: "date" },
          { header: "ROTH-BASIS-AT", start: 590, length: 17, type: "decimal" },
          { header: "ROTH-TRM-LOAN-PPAL-BAS-RCY-AT", start: 607, length: 17, type: "decimal" },
          { header: "AFTER-TAX-BASIS-AT", start: 624, length: 17, type: "decimal" },
          { header: "ATX-TRM-LOAN-PPAL-BAS-RCY-AT", start: 641, length: 17, type: "decimal" },
          { header: "PRE87-AFTER-TAX-BASIS-AT", start: 658, length: 17, type: "decimal" },
          { header: "ORN-PART-TAX-ID", start: 675, length: 9, type: "text" },
          { header: "PART-CMR-GENDER-CD", start: 684, length: 1, type: "text" },
          { header: "CALENDAR-YTD-SALARY-DDN-AT", start: 685, length: 17, type: "decimal" },
          { header: "DEFAULTED-PARTICIPANT-CD", start: 702, length: 1, type: "text" }
        ],
        MT: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "text" },
          { header: "CONTR-MONEY-TY-CDE", start: 12, length: 3, type: "text" },
          { header: "PART-VESTED-RTE", start: 15, length: 16, type: "text" },
          { header: "MONEY-TYPE-VESTED-AMT", start: 31, length: 17, type: "decimal" },
          { header: "YTD-MONY-TYP-TOTAL-CONTRIB-AMT", start: 48, length: 17, type: "decimal" },
          { header: "YTD-MONY-TYP-TOTAL-DISTRIB-AMT", start: 65, length: 17, type: "decimal" },
          { header: "YTD-MONY-TYP-TOTAL-EARNING-AMT", start: 82, length: 17, type: "decimal" },
          { header: "MNYT-TOTAL-CONTRIB", start: 99, length: 17, type: "decimal" },
          { header: "MNYT-TOTAL-DISTRIB", start: 116, length: 17, type: "decimal" },
          { header: "TTD-MONY-TYP-TOTAL-EARNING-AMT", start: 133, length: 17, type: "decimal" },
          { header: "MNYT-AVAILABLE-PRE-1989-AMT", start: 150, length: 17, type: "decimal" },
          { header: "MNYT-PREVIOUS-YEAR-END-AMT", start: 167, length: 17, type: "decimal" },
          { header: "MNYT-BATCH-CONVERSION-AMT", start: 184, length: 17, type: "decimal" }
        ],
        VA: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "decimal" },
          { header: "CONTR-MONEY-TY-CDE", start: 12, length: 3, type: "text" },
          { header: "PROV-EXT-INV-VH-ID", start: 15, length: 10, type: "text" },
          { header: "PART-ALLOCAT-AMT", start: 25, length: 17, type: "decimal" },
          { header: "PART-ALLOCAT-RATE", start: 42, length: 16, type: "decimal" },
          { header: "MNYT-VEH-CONVERSION-AMT", start: 59, length: 16, type: "decimal" },
          { header: "PARTICIPANT-ALLOCATION-FEE-AT", start: 75, length: 11, type: "decimal" }
        ],
        PL: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "text" },
          { header: "PROV-EXT-INV-VH-ID", start: 12, length: 10, type: "text" },
          { header: "PLAN-ACCT-TYP-CD", start: 22, length: 1, type: "text" },
          { header: "FRF-ACCOUNT-TYP-CD", start: 23, length: 1, type: "text" },
          { header: "COMBINED-FORFEITURE-TYPE-CD", start: 24, length: 1, type: "text" },
          { header: "FORFEITURE-AT", start: 25, length: 17, type: "decimal" },
          { header: "FORFEITURE-CLOSEOUT-AT", start: 42, length: 17, type: "decimal" },
          { header: "FORFEITURE-CDSC-FEE-AT", start: 59, length: 11, type: "decimal" }
        ],
        PR: [
          { header: "RECORD-CDE", start: 1, length: 2, type: "text" },
          { header: "PART-TAX-ID", start: 3, length: 9, type: "text" },
          { header: "PLAN-ENROLL-DTE", start: 12, length: 10, type: "date" },
          { header: "INI-PRE-TAX-ERL", start: 22, length: 16, type: "decimal" },
          { header: "INI-PST-TAX-ERL", start: 38, length: 16, type: "decimal" },
          { header: "INI-PRE-TAX-AT", start: 54, length: 17, type: "decimal" },
          { header: "INI-PST-TAX-AT", start: 71, length: 17, type: "decimal" },
          { header: "ERL-STA-RPT-DT", start: 88, length: 10, type: "date" },
          { header: "PSV-DFLT-PCT-RT-CD", start: 98, length: 1, type: "text" },
          { header: "AUT-PTX-ICR-ELN-CD", start: 99, length: 1, type: "text" },
          { header: "ROTH-EDFR-ERL-RT", start: 100, length: 16, type: "decimal" },
          { header: "ROTH-EDFR-ERL-AT", start: 116, length: 17, type: "decimal" },
          { header: "PART-QACA-CD", start: 133, length: 1, type: "text" },
          { header: "PART-EACA-CD", start: 134, length: 1, type: "text" },
          { header: "QACA-FIR-CNB-DT", start: 135, length: 10, type: "date" },
          { header: "QACA-OPT-OUT-DT", start: 145, length: 10, type: "date" },
          { header: "QACA-NXT-ICR-DT", start: 155, length: 10, type: "date" },
          { header: "EACA-OPT-OUT-DT", start: 165, length: 10, type: "date" },
          { header: "EACA-START-DT", start: 175, length: 10, type: "date" }
        ]
      }
    }
    ,
    NATIONWIDE: {
      label: "NATIONWIDE",
      recordStart: 1,
      recordLength: 2,
      reports: ["HD", "PT", "HR", "LN", "LD", "VA", "MT", "PL", "PR"],
      layouts: {
        HD: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Plan Legal Name", start: 12, length: 35, type: "text" },
          { header: "Plan Year-End Date", start: 47, length: 10, type: "date" }
        ],
        PT: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Location ID", start: 12, length: 9, type: "text" },
          { header: "Location Name", start: 21, length: 35, type: "text" },
          { header: "Affiliate Tax ID", start: 56, length: 9, type: "text" },
          { header: "Participant Name", start: 65, length: 35, type: "text" },
          { header: "Participant Address 1", start: 100, length: 35, type: "text" },
          { header: "Participant Address 2", start: 135, length: 35, type: "text" },
          { header: "Participant Address 3", start: 170, length: 35, type: "text" },
          { header: "Participant City", start: 205, length: 35, type: "text" },
          { header: "State Code", start: 240, length: 3, type: "text" },
          { header: "Participant Zip Code", start: 243, length: 9, type: "text" },
          { header: "External Employee ID", start: 252, length: 20, type: "text" },
          { header: "Participant Birth Date", start: 272, length: 10, type: "date" },
          { header: "Plan Enroll Date", start: 282, length: 10, type: "date" },
          { header: "Employee Hire Date", start: 292, length: 10, type: "date" },
          { header: "Employee Termination Date", start: 302, length: 10, type: "date" },
          { header: "Participant Death Date", start: 312, length: 10, type: "date" },
          { header: "Participant Suspense Start Date", start: 322, length: 10, type: "date" },
          { header: "Participant Disable Date", start: 332, length: 10, type: "date" },
          { header: "Participant Inactive Date", start: 342, length: 10, type: "date" },
          { header: "Employee Retire Date", start: 352, length: 10, type: "date" },
          { header: "Employee Rehire Date", start: 362, length: 10, type: "date" },
          { header: "Participant Vest Date", start: 372, length: 10, type: "date" },
          { header: "Participant Status Code", start: 382, length: 2, type: "text" },
          { header: "Compliance Group Code", start: 388, length: 5, type: "text" },
          { header: "Plan YTD Salary Amount", start: 418, length: 17, type: "decimal" },
          { header: "Plan YTD Salary Change Date", start: 435, length: 10, type: "date" },
          { header: "Plan YTD Salary Deduction Amount", start: 445, length: 17, type: "decimal" },
          { header: "Plan YTD Salary Deduction Change Date", start: 462, length: 10, type: "date" },
          { header: "Plan YTD Employer Match Amount", start: 472, length: 17, type: "decimal" },
          { header: "Plan YTD Employer Match Date", start: 489, length: 10, type: "date" },
          { header: "Plan YTD Voluntary Money Amount", start: 499, length: 17, type: "decimal" },
          { header: "Available Hardship Withdrawal Amount", start: 526, length: 17, type: "decimal" },
          { header: "First Contribution Date", start: 553, length: 10, type: "date" },
          { header: "Plan YTD Roth Elective Deferral Amount", start: 563, length: 17, type: "decimal" },
          { header: "Plan YTD Roth Elective Deferral Date", start: 580, length: 10, type: "date" },
          { header: "Roth Basis Amount", start: 590, length: 17, type: "decimal" },
          { header: "After-tax Basis Amount", start: 624, length: 17, type: "decimal" },
          { header: "Original Participant Tax ID", start: 675, length: 9, type: "text" },
          { header: "Participant Customer Gender", start: 684, length: 1, type: "text" },
          { header: "Calendar YTD Salary Deduction Amount", start: 685, length: 17, type: "decimal" },
          { header: "Participant Investment Elections Defaulted", start: 702, length: 1, type: "text" }
        ],
        HR: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Hours Tracking Type Code", start: 12, length: 1, type: "text" },
          { header: "Tracking Year Date", start: 13, length: 10, type: "date" },
          { header: "Year to Date Hours", start: 23, length: 8, type: "decimal" },
          { header: "Vested Service Years Count", start: 31, length: 3, type: "integer" },
          { header: "Hours Included in Years Code", start: 34, length: 1, type: "text" }
        ],
        LN: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Loan ID", start: 12, length: 5, type: "text" },
          { header: "Outstanding Principal Amount", start: 17, length: 17, type: "decimal" },
          { header: "Loan Start Date", start: 34, length: 10, type: "date" },
          { header: "Original Loan Amount", start: 44, length: 17, type: "decimal" },
          { header: "Scheduled Payment Amount", start: 61, length: 17, type: "decimal" },
          { header: "Annual Interest Rate", start: 78, length: 16, type: "decimal" },
          { header: "Total Scheduled Loan Payments", start: 94, length: 7, type: "integer" },
          { header: "Loan First Payment Due Date", start: 101, length: 10, type: "date" },
          { header: "Loan Maturity Date", start: 114, length: 10, type: "date" },
          { header: "Total Loan Payments Made", start: 124, length: 7, type: "integer" },
          { header: "Date of Last Loan Payment", start: 131, length: 10, type: "date" },
          { header: "Month 1 High Balance", start: 141, length: 17, type: "decimal" },
          { header: "Month 2 High Balance", start: 158, length: 17, type: "decimal" },
          { header: "Month 3 High Balance", start: 175, length: 17, type: "decimal" },
          { header: "Month 4 High Balance", start: 192, length: 17, type: "decimal" },
          { header: "Month 5 High Balance", start: 209, length: 17, type: "decimal" },
          { header: "Month 6 High Balance", start: 226, length: 17, type: "decimal" },
          { header: "Month 7 High Balance", start: 243, length: 17, type: "decimal" },
          { header: "Month 8 High Balance", start: 260, length: 17, type: "decimal" },
          { header: "Month 9 High Balance", start: 277, length: 17, type: "decimal" },
          { header: "Month 10 High Balance", start: 294, length: 17, type: "decimal" },
          { header: "Month 11 High Balance", start: 311, length: 17, type: "decimal" },
          { header: "Month 12 High Balance", start: 328, length: 17, type: "decimal" },
          { header: "Roth Basis Loan Amount", start: 345, length: 17, type: "decimal" },
          { header: "After-tax Basis Loan Amount", start: 362, length: 17, type: "decimal" }
        ],
        LD: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Loan ID", start: 12, length: 5, type: "text" },
          { header: "Money Type Code", start: 17, length: 3, type: "text" },
          { header: "Outstanding Amount by Money Type", start: 20, length: 17, type: "decimal" },
          { header: "Loan-to-Date Principal Paid Amount", start: 37, length: 17, type: "decimal" },
          { header: "Loan-to-Date Interest Paid Amount", start: 54, length: 17, type: "decimal" },
          { header: "Year-to-Date Principal Paid Amount", start: 71, length: 17, type: "decimal" },
          { header: "Year-to-Date Interest Paid Amount", start: 88, length: 17, type: "decimal" }
        ],
        VA: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Money Type Code", start: 12, length: 3, type: "text" },
          { header: "Vehicle ID", start: 15, length: 10, type: "text" },
          { header: "Participant Allocation Amount", start: 25, length: 17, type: "decimal" },
          { header: "Participant Allocation Rate", start: 42, length: 16, type: "decimal" },
          { header: "Money Type Vehicle Conversion Amount", start: 58, length: 17, type: "decimal" },
          { header: "Participant Allocation Fee Amount", start: 75, length: 11, type: "decimal" }
        ],
        MT: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Money Type Code", start: 12, length: 3, type: "text" },
          { header: "Participant Vested Percentage Rate", start: 15, length: 15, type: "decimal" },
          { header: "Vested Amount", start: 31, length: 17, type: "decimal" },
          { header: "Year-to-Date Contribution Amount", start: 48, length: 17, type: "decimal" },
          { header: "Year-to-Date Distribution Amount", start: 65, length: 17, type: "decimal" },
          { header: "Year-to-Date Earnings Amount", start: 82, length: 17, type: "decimal" },
          { header: "Inception-to-Date Contribution Amount", start: 99, length: 17, type: "decimal" },
          { header: "Inception-to-Date Distribution Amount", start: 116, length: 17, type: "decimal" },
          { header: "Inception-to-Date Earning Amount", start: 133, length: 17, type: "decimal" },
          { header: "Available Pre-1989 Amount", start: 150, length: 17, type: "decimal" },
          { header: "Previous Year-End Balance Amount", start: 167, length: 17, type: "decimal" },
          { header: "Converted Balance Amount", start: 184, length: 17, type: "decimal" }
        ],
        PL: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Vehicle ID", start: 12, length: 10, type: "text" },
          { header: "Plan Account Type Code", start: 22, length: 1, type: "text" },
          { header: "Forfeiture Account Type Code", start: 23, length: 1, type: "text" },
          { header: "Forfeiture Account Combined Assets", start: 24, length: 1, type: "text" },
          { header: "Forfeiture Amount", start: 25, length: 17, type: "decimal" },
          { header: "Forfeiture Closeout Amount", start: 42, length: 17, type: "decimal" },
          { header: "Forfeiture CDSD Fee Amount", start: 59, length: 11, type: "decimal" }
        ],
        PR: [
          { header: "Record Code", start: 1, length: 2, type: "text" },
          { header: "Participant Tax ID", start: 3, length: 9, type: "text" },
          { header: "Plan Enrollment Date", start: 12, length: 10, type: "date" },
          { header: "Pre-tax Rate", start: 22, length: 16, type: "decimal" },
          { header: "Post-tax Rate", start: 38, length: 16, type: "decimal" },
          { header: "Pre-tax Amount", start: 54, length: 17, type: "decimal" },
          { header: "Post-tax Amount", start: 71, length: 17, type: "decimal" },
          { header: "Status Reported Date", start: 88, length: 10, type: "date" },
          { header: "Automatic Pre-tax Contribution Increase Election Code", start: 99, length: 1, type: "text" },
          { header: "Roth Elective Deferral Contribution Enrollment Rate", start: 100, length: 16, type: "decimal" },
          { header: "Roth Elective Deferral Contribution Enrollment Amount", start: 116, length: 17, type: "decimal" },
          { header: "Qualified Automatic Contribution Arrangement Code", start: 133, length: 1, type: "text" },
          { header: "Eligible Automatic Contribution Arrangement Code", start: 134, length: 1, type: "text" },
          { header: "Qualified Automatic Contribution Arrangement First Contribution Date", start: 135, length: 10, type: "date" },
          { header: "Qualified Automatic Contribution Arrangement Opt Out Date", start: 145, length: 10, type: "date" },
          { header: "Qualified Automatic Contribution Arrangement Next Deferral Increase Date", start: 155, length: 10, type: "date" },
          { header: "Eligible Automatic Contribution Arrangement Opt Out Date", start: 165, length: 10, type: "date" },
          { header: "Eligible Automatic Contribution Arrangement Start Date", start: 175, length: 10, type: "date" }
        ]
      }
    },
    EMPOWER: {
      label: "EMPOWER",
      recordStart: 1,
      recordLength: 6,
      reports: ["SUBSET", "HOURS", "YTDDSV", "EMP", "SALARY", "DFRL", "BENE", "PYEB", "PPAY", "OWNER", "LOMNTY", "ITD", "PARTS", "LOANS", "BALANC", "ALLOC"],
      layouts: {
        SUBSET: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "BASIS", start: 136, length: 4, type: "text" },
          { header: "VALUE", start: 140, length: 9, type: "decimal" },
          { header: "EFFECTIVE DATE", start: 149, length: 8, type: "date" }
        ],
        HOURS: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "COMP YEAR", start: 136, length: 4, type: "integer" },
          { header: "EFFECTIVE DATE", start: 140, length: 8, type: "date" },
          { header: "CREDITED HOURS", start: 148, length: 82, type: "decimal" }
        ],
        EMP: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "DATE OF HIRE", start: 136, length: 8, type: "date" },
          { header: "DATE OF TERMINATION", start: 144, length: 8, type: "date" },
          { header: "EMPLOYEE ID", start: 152, length: 18, type: "text" },
          { header: "HIGHLY COMPENSATED INDICATOR", start: 182, length: 1, type: "text" }
        ],
        SALARY: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "SALARY AMOUNT", start: 136, length: 18, type: "decimal" },
          { header: "SALARY AMOUNT QUALIFIER", start: 154, length: 2, type: "text" },
          { header: "EMPLOYEE TYPE CODE", start: 156, length: 1, type: "text" },
          { header: "SALARY AMOUNT EFFECTIVE DATE", start: 157, length: 8, type: "date" }
        ],
        DFRL: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "DEFERRAL TYPE", start: 136, length: 6, type: "text" },
          { header: "EFFECTIVE DATE", start: 159, length: 8, type: "date" },
          { header: "DEFERRAL PERCENT", start: 167, length: 9, type: "decimal" },
          { header: "DEFERRAL AMOUNT", start: 176, length: 18, type: "decimal" },
          { header: "NEXT SCHEDULED CHANGE DATE", start: 246, length: 8, type: "date" }
        ],
        YTDDSV: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "GROUP NAME", start: 136, length: 70, type: "text" },
          { header: "SSET NAME", start: 218, length: 80, type: "text" },
          { header: "PROCESSED DATE", start: 327, length: 8, type: "date" },
          { header: "EFFECTIVE DATE", start: 335, length: 8, type: "date" },
          { header: "DISB AMOUNT", start: 485, length: 17, type: "decimal" },
          { header: "WITHHOLDING AMOUNT", start: 519, length: 17, type: "decimal" },
          { header: "CHECK AMOUNT", start: 558, length: 17, type: "decimal" }
        ],
        PYEB: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "BASIS", start: 136, length: 4, type: "text" },
          { header: "VALUE", start: 140, length: 6, type: "decimal" },
          { header: "MONEY TYPE", start: 146, length: 3, type: "text" },
          { header: "SEQUENECE NUMBER", start: 149, length: 4, type: "integer" },
          { header: "EFFECTIVE DATE", start: 153, length: 8, type: "date" },
          { header: "BALANCE", start: 161, length: 182, type: "decimal" }
        ],
        PPAY: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "DISB TYPE", start: 141, length: 10, type: "text" },
          { header: "EFFDATE", start: 192, length: 8, type: "date" },
          { header: "NEXT SCHED PAY DUE DATE", start: 200, length: 8, type: "date" },
          { header: "EXTERNAL REQUEST ID", start: 208, length: 50, type: "text" },
          { header: "PPAY PER PERIOD AMT", start: 264, length: 17, type: "decimal" },
          { header: "PPAY CUR PAYMENT NUM", start: 281, length: 5, type: "integer" },
          { header: "PPAY NUM SCHED PAYMENTS", start: 286, length: 5, type: "integer" }
        ],
        BENE: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "RECORDED DATE", start: 136, length: 8, type: "date" },
          { header: "BENE LAST NAME", start: 144, length: 35, type: "text" },
          { header: "BENE FIRST NAME", start: 179, length: 20, type: "text" },
          { header: "RELATIONSHIP", start: 219, length: 3, type: "text" },
          { header: "PERCENT", start: 222, length: 8, type: "decimal" },
          { header: "BENE BIRTH DATE", start: 234, length: 8, type: "date" }
        ],
        OWNER: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "OWNERSHIP INDICATOR", start: 136, length: 1, type: "text" },
          { header: "SETTLEMENT DATE", start: 137, length: 8, type: "date" },
          { header: "OWNER SSN", start: 145, length: 9, type: "text" },
          { header: "OWNER LAST NAME", start: 154, length: 35, type: "text" },
          { header: "OWNER FIRST NAME", start: 189, length: 20, type: "text" }
        ],
        LOMNTY: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "LOAN NUMBER", start: 136, length: 10, type: "text" },
          { header: "MONEY TYPE", start: 146, length: 3, type: "text" },
          { header: "SEQUENCE NUMBER", start: 149, length: 4, type: "integer" },
          { header: "SPLIT PERCENT", start: 153, length: 11, type: "decimal" },
          { header: "EFFECTIVE DATE", start: 164, length: 8, type: "date" },
          { header: "TERMINATION DATE", start: 172, length: 8, type: "date" }
        ],
        ITD: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "MONEY TYPE", start: 136, length: 3, type: "text" },
          { header: "SEQUENCE NUMBER", start: 139, length: 4, type: "integer" },
          { header: "FINANCIAL ACTIVITY CODE", start: 143, length: 3, type: "text" },
          { header: "DEPOSIT TYPE", start: 146, length: 3, type: "text" },
          { header: "AMOUNT", start: 149, length: 18, type: "decimal" },
          { header: "ROTH FIRST CONTRIBUTION DATE", start: 257, length: 10, type: "date" }
        ],
        PARTS: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "DATE OF BIRTH", start: 136, length: 8, type: "date" },
          { header: "PARTICIPATION DATE", start: 340, length: 8, type: "date" },
          { header: "EMAIL ADDRESS", start: 348, length: 80, type: "text" },
          { header: "MAIL HOLD DATE", start: 608, length: 8, type: "date" }
        ],
        LOANS: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "LOAN NUMBER", start: 136, length: 10, type: "text" },
          { header: "FIRST DUE DATE", start: 162, length: 8, type: "date" },
          { header: "REPAY AMOUNT", start: 172, length: 18, type: "decimal" },
          { header: "ORIGINAL LOAN AMOUNT", start: 198, length: 18, type: "decimal" },
          { header: "OUTSTANDING PRINCIPAL", start: 249, length: 18, type: "decimal" },
          { header: "MATURITY DATE", start: 267, length: 8, type: "date" },
          { header: "LAST REPAYMENT DATE", start: 410, length: 8, type: "date" }
        ],
        BALANC: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "MONEY TYPE", start: 136, length: 3, type: "text" },
          { header: "SEQUENCE NUMBER", start: 139, length: 4, type: "integer" },
          { header: "INVESTMENT OPTION", start: 143, length: 7, type: "text" },
          { header: "AMOUNT", start: 150, length: 18, type: "decimal" },
          { header: "UNITS/SHARES", start: 168, length: 54, type: "decimal" },
          { header: "BALANCE EFFECTIVE DATE", start: 276, length: 8, type: "date" }
        ],
        ALLOC: [
          { header: "RECORD TYPE", start: 1, length: 6, type: "text" },
          { header: "GROUP ACCOUNT", start: 7, length: 13, type: "text" },
          { header: "SSN", start: 20, length: 9, type: "text" },
          { header: "LAST NAME", start: 46, length: 35, type: "text" },
          { header: "FIRST NAME", start: 81, length: 20, type: "text" },
          { header: "MONEY TYPE", start: 136, length: 3, type: "text" },
          { header: "SEQUENCE NUMBER", start: 139, length: 4, type: "integer" },
          { header: "INVESTMENT OPTION", start: 143, length: 7, type: "text" },
          { header: "PERCENT", start: 150, length: 7, type: "decimal" },
          { header: "DEFAULT INDICATOR", start: 157, length: 1, type: "text" },
          { header: "MODEL NUMBER", start: 158, length: 3, type: "text" }
        ]
      }
    },
    ADP: {
      label: "ADP",
      recordStart: 1,
      recordLength: 2,
      reports: ["PH", "PF", "IN", "LH", "LF", "BR"],
      layouts: {
        PH: [
          { header: "Record ID", start: 1, length: 2, type: "text" },
          { header: "Social Security Number", start: 3, length: 9, type: "text" },
          { header: "Name", start: 12, length: 30, type: "text" },
          { header: "Employee File Number", start: 42, length: 13, type: "text" },
          { header: "Status", start: 55, length: 2, type: "text" },
          { header: "Date of Birth", start: 57, length: 8, type: "date" },
          { header: "Date of Hire", start: 65, length: 8, type: "date" },
          { header: "Date of Plan Entry/Eligibility", start: 73, length: 8, type: "date" },
          { header: "Date of Termination", start: 81, length: 8, type: "date" },
          { header: "Years of Service", start: 113, length: 5, type: "decimal" },
          { header: "Current Year-to-date Hours of Service", start: 118, length: 7, type: "decimal" },
          { header: "Participant Address - Line 1", start: 190, length: 30, type: "text" },
          { header: "Participant Address - Line 2", start: 220, length: 30, type: "text" },
          { header: "Participant Address - City", start: 250, length: 18, type: "text" },
          { header: "Participant Address - State", start: 268, length: 2, type: "text" },
          { header: "Participant Address - Zip Code", start: 270, length: 9, type: "text" },
          { header: "Before-Tax Deferral Percent", start: 329, length: 5, type: "decimal" },
          { header: "Leave of Absence Date", start: 334, length: 8, type: "date" },
          { header: "Rehire Date", start: 426, length: 8, type: "date" },
          { header: "Employer Match Eligibility Date", start: 434, length: 8, type: "date" },
          { header: "Eligible Date", start: 463, length: 8, type: "date" },
          { header: "Roth Deferral Percent", start: 539, length: 4, type: "decimal" },
          { header: "Roth First Contribution Date", start: 543, length: 8, type: "date" },
          { header: "ROTH TAX BASIS", start: 563, length: 11, type: "decimal" }
        ],
        PF: [
          { header: "Record ID", start: 1, length: 2, type: "text" },
          { header: "Social Security Number", start: 3, length: 9, type: "text" },
          { header: "Fund ID", start: 12, length: 2, type: "text" },
          { header: "Source ID", start: 14, length: 1, type: "text" },
          { header: "Contribution Allocation Percent", start: 15, length: 4, type: "decimal" },
          { header: "Gross Contributions Year-to-date", start: 20, length: 11, type: "decimal" },
          { header: "Conversion Balance-Market Value", start: 32, length: 11, type: "decimal" },
          { header: "Cost Balance", start: 44, length: 11, type: "decimal" },
          { header: "Share Balance", start: 56, length: 13, type: "decimal" },
          { header: "Vested Percent", start: 69, length: 4, type: "decimal" }
        ],
        IN: [
          { header: "Record ID", start: 1, length: 2, type: "text" },
          { header: "Social Security Number", start: 3, length: 9, type: "text" },
          { header: "Start Date", start: 12, length: 8, type: "date" },
          { header: "End Date", start: 20, length: 8, type: "date" },
          { header: "Next Pay Date", start: 28, length: 8, type: "date" },
          { header: "Frequency", start: 36, length: 1, type: "text" },
          { header: "Maximum Number of Payments", start: 37, length: 3, type: "integer" },
          { header: "Number of Payments-to-date", start: 40, length: 3, type: "integer" },
          { header: "Method", start: 43, length: 1, type: "text" },
          { header: "Exclusion Amount", start: 45, length: 13, type: "decimal" },
          { header: "Installment Amount or Percent", start: 65, length: 11, type: "decimal" },
          { header: "State Withholding Amount", start: 79, length: 11, type: "decimal" },
          { header: "Federal Withholding Amount", start: 99, length: 11, type: "decimal" }
        ],
        LH: [
          { header: "Record ID", start: 1, length: 2, type: "text" },
          { header: "Social Security Number", start: 3, length: 9, type: "text" },
          { header: "Loan Number", start: 12, length: 3, type: "integer" },
          { header: "Date of Loan Issue Date", start: 15, length: 8, type: "date" },
          { header: "Date of Next Loan Payment", start: 23, length: 8, type: "date" },
          { header: "Date of Previous Loan Payment", start: 31, length: 8, type: "date" },
          { header: "Loan Original Amount", start: 39, length: 11, type: "decimal" },
          { header: "Loan Balance Current", start: 50, length: 11, type: "decimal" },
          { header: "Loan Interest Rate", start: 61, length: 7, type: "decimal" },
          { header: "Loan Payment Amount", start: 68, length: 11, type: "decimal" },
          { header: "Loan Payoff Date", start: 80, length: 8, type: "date" },
          { header: "Principal in Arrears", start: 90, length: 11, type: "decimal" },
          { header: "Interest in Arrears", start: 101, length: 11, type: "decimal" },
          { header: "Loan Total Expected Interest", start: 112, length: 11, type: "decimal" },
          { header: "Loan Total Interest Paid to Date", start: 127, length: 11, type: "decimal" }
        ],
        LF: [
          { header: "Record ID", start: 1, length: 2, type: "text" },
          { header: "Social Security Number", start: 3, length: 9, type: "text" },
          { header: "Fund ID", start: 12, length: 2, type: "text" },
          { header: "Source ID", start: 14, length: 1, type: "text" },
          { header: "Loan Number", start: 15, length: 3, type: "integer" },
          { header: "Original Loan Amount", start: 19, length: 11, type: "decimal" },
          { header: "Principal Amount Repaid", start: 31, length: 11, type: "decimal" },
          { header: "Interest Amount Repaid", start: 43, length: 9, type: "decimal" }
        ],
        BR: [
          { header: "Record ID", start: 1, length: 2, type: "text" },
          { header: "Social Security Number", start: 3, length: 9, type: "text" },
          { header: "Trade Date", start: 12, length: 4, type: "text" },
          { header: "Highest Loan Balance", start: 16, length: 11, type: "decimal" }
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
