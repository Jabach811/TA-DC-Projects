(function () {
  window.FIDELITY_SOURCE_CONFIG = {
    label: "FIDELITY",
    recordStart: 30,
    recordLength: 2,
    reports: ["01", "02D", "02E", "03", "04", "05", "06", "07D", "07DR", "07Y", "08", "09", "09R", "09PRIOR", "10", "11", "14", "3N", "3P", "3V", "44", "57", "58", "60", "61", "70", "70R", "70PRIOR", "70RPRIOR", "93", "EA", "15", "15NC", "15WDL", "16", "17", "18", "18R", "24", "30", "31", "37", "38", "3A", "40", "41", "45", "47", "49", "49ACH", "49ACHAD", "49ACHBN", "49EFTAD", "49EFTBN", "51", "63", "65", "66", "67", "76", "68", "69", "77", "78", "79", "WF"],
    resolveRecord: function (line, sliceValue, trimValue) {
      if (sliceValue(line, 25, 7) === "49ACHAD") { return "49ACHAD"; }
      if (sliceValue(line, 25, 7) === "49ACHBN") { return "49ACHBN"; }
      if (sliceValue(line, 25, 7) === "49EFTAD") { return "49EFTAD"; }
      if (sliceValue(line, 25, 7) === "49EFTBN") { return "49EFTBN"; }
      if (sliceValue(line, 25, 7) === "09PRIOR") { return "09PRIOR"; }
      if (sliceValue(line, 25, 7) === "70PRIOR" && sliceValue(line, 80, 1) === "Y") { return "70RPRIOR"; }
      if (sliceValue(line, 25, 7) === "70PRIOR") { return "70PRIOR"; }
      if (sliceValue(line, 27, 5) === "49ACH") { return "49ACH"; }
      switch (sliceValue(line, 30, 2)) {
        case "02": return sliceValue(line, 32, 1) === "D" ? "02D" : (sliceValue(line, 32, 1) === "E" ? "02E" : "");
        case "07": if (sliceValue(line, 32, 1) === "Y") { return "07Y"; } if (sliceValue(line, 32, 1) === "D" && sliceValue(line, 33, 2) === "01" && sliceValue(line, 80, 1) === "Y") { return "07DR"; } if (sliceValue(line, 32, 1) === "D") { return "07D"; } return "";
        case "09": return sliceValue(line, 80, 1) === "Y" ? "09R" : "09";
        case "15": if (sliceValue(line, 32, 3) === "WDL") { return "15WDL"; } if (sliceValue(line, 32, 3) === "CLS") { return "15"; } if (trimValue(sliceValue(line, 32, 8)) === "" && trimValue(sliceValue(line, 40, 2)) !== "") { return "15NC"; } return "15";
        case "18": return sliceValue(line, 80, 1) === "Y" ? "18R" : "18";
        case "70": return sliceValue(line, 80, 1) === "Y" ? "70R" : "70";
        default: return sliceValue(line, 30, 2);
      }
    },
    layouts: {
    "01": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Idber",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Name (Free Form)",
            "start": 32,
            "length": 20,
            "type": "text"
        },
        {
            "header": "Name Middle Initial (Free F",
            "start": 52,
            "length": 15,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 67,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Or S Marital Status",
            "start": 76,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Or F Gender",
            "start": 77,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Tax Type Id",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "02D": [
        {
            "header": "Plan Num",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Idber",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record I",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Field Typ",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 33,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Hire Dat",
            "start": 37,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Particip",
            "start": 45,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Vesting",
            "start": 53,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Date-Of",
            "start": 61,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Termina",
            "start": 69,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Space",
            "start": 77,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "02E": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Field Type",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Number",
            "start": 33,
            "length": 11,
            "type": "integer"
        },
        {
            "header": "Reserved",
            "start": 44,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 45,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 47,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 59,
            "length": 22,
            "type": "text"
        }
    ],
    "03": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Record Type",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Line Number",
            "start": 33,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Address",
            "start": 35,
            "length": 32,
            "type": "text"
        },
        {
            "header": "Country Code",
            "start": 67,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 69,
            "length": 10,
            "type": "text"
        },
        {
            "header": "Statement / Bad Addres",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "04": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Record Type",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "City",
            "start": 33,
            "length": 20,
            "type": "text"
        },
        {
            "header": "State",
            "start": 53,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 55,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Code",
            "start": 63,
            "length": 5,
            "type": "text"
        },
        {
            "header": "+ 4 Code",
            "start": 68,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 72,
            "length": 6,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Statement / Bad Ad",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "05": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Record Type",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Country",
            "start": 33,
            "length": 23,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 56,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 57,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 58,
            "length": 19,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 77,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Statement / Bad A",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "06": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Name",
            "start": 32,
            "length": 20,
            "type": "text"
        },
        {
            "header": "Name",
            "start": 52,
            "length": 20,
            "type": "text"
        },
        {
            "header": "Security",
            "start": 72,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 75,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 79,
            "length": 2,
            "type": "text"
        }
    ],
    "07D": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identif",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Field Type",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Key Field Number",
            "start": 33,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Date",
            "start": 35,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 43,
            "length": 38,
            "type": "text"
        }
    ],
    "07DR": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Field Type",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Field Number",
            "start": 33,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Date Of 1St Roth Co",
            "start": 35,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 43,
            "length": 37,
            "type": "text"
        },
        {
            "header": "Roth Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "07Y": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Field Type",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Field Number",
            "start": 33,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Employees",
            "start": 35,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 36,
            "length": 45,
            "type": "text"
        }
    ],
    "08": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identif",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Salary",
            "start": 32,
            "length": 13,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 45,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 46,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Zeros",
            "start": 48,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 56,
            "length": 25,
            "type": "text"
        }
    ],
    "09": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Tax Percentage",
            "start": 32,
            "length": 5,
            "type": "decimal"
        },
        {
            "header": "Tax Percentage",
            "start": 37,
            "length": 5,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 42,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Tax Supplemental",
            "start": 43,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Tax Supplemental P",
            "start": 48,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Sharing Election",
            "start": 53,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Election Pctg",
            "start": 58,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 63,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 64,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 73,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 74,
            "length": 6,
            "type": "text"
        },
        {
            "header": "Elections",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "09R": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 32,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Percentage",
            "start": 37,
            "length": 5,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 42,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 43,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Supplemental Perc",
            "start": 48,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 53,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Catch-Up Percenta",
            "start": 58,
            "length": 5,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 63,
            "length": 10,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 73,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 74,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 75,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Roth Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "09PRIOR": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 25,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Before Tax Perce",
            "start": 32,
            "length": 5,
            "type": "text"
        },
        {
            "header": "After Tax Percen",
            "start": 37,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 42,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Before Tax Suppl",
            "start": 43,
            "length": 5,
            "type": "text"
        },
        {
            "header": "After Tax Supple",
            "start": 48,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Zeros",
            "start": 53,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Catch-Up Electio",
            "start": 58,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 63,
            "length": 1,
            "type": "text"
        }
    ],
    "10": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Source",
            "start": 32,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Identifier",
            "start": 34,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Election",
            "start": 38,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Election",
            "start": 43,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 48,
            "length": 32,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "11": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Code",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 33,
            "length": 6,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 38,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 46,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 47,
            "length": 34,
            "type": "text"
        }
    ],
    "14": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Iden",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Div",
            "start": 32,
            "length": 20,
            "type": "text"
        },
        {
            "header": "Division Cha",
            "start": 52,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 60,
            "length": 21,
            "type": "text"
        }
    ],
    "3N": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Idber",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Election Number",
            "start": 32,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Amount",
            "start": 34,
            "length": 17,
            "type": "decimal"
        },
        {
            "header": "Option Code",
            "start": 51,
            "length": 2,
            "type": "text"
        },
        {
            "header": "P, C Deferral Format Code",
            "start": 53,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Effective Date",
            "start": 54,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Deferral Start Date",
            "start": 62,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Expiration Date",
            "start": 70,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Space",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 79,
            "length": 2,
            "type": "text"
        }
    ],
    "3P": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Ind",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Id",
            "start": 33,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 37,
            "length": 6,
            "type": "text"
        },
        {
            "header": "Number",
            "start": 43,
            "length": 4,
            "type": "integer"
        },
        {
            "header": "Start Date",
            "start": 47,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Skip Rebal Date",
            "start": 55,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 63,
            "length": 17,
            "type": "text"
        }
    ],
    "3V": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Part History Seq Number",
            "start": 32,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Status Effective Date - 1",
            "start": 34,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Change - 1",
            "start": 42,
            "length": 2,
            "type": "text"
        },
        {
            "header": "\u2018I\u2019 Or Space Litrature Ignore Ind - 1",
            "start": 44,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Status Effective Date - 2",
            "start": 45,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Change - 2",
            "start": 53,
            "length": 2,
            "type": "text"
        },
        {
            "header": "\u2018I\u2019 Or Space Litrature Ignore Ind - 2",
            "start": 55,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 56,
            "length": 25,
            "type": "text"
        }
    ],
    "44": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifer",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Modifier # 1",
            "start": 33,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 38,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Modifier # 2",
            "start": 39,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 44,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 45,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 46,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 47,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 48,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 49,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 50,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 51,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 52,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 53,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 54,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 55,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 56,
            "length": 25,
            "type": "text"
        }
    ],
    "57": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "I.D.",
            "start": 32,
            "length": 10,
            "type": "text"
        },
        {
            "header": "I.D.",
            "start": 42,
            "length": 10,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 52,
            "length": 29,
            "type": "text"
        }
    ],
    "58": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Salary",
            "start": 32,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 41,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Zeros",
            "start": 42,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 50,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 51,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 52,
            "length": 29,
            "type": "text"
        }
    ],
    "60": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Class",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "District",
            "start": 33,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Department",
            "start": 41,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Location/Store",
            "start": 49,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Union Code",
            "start": 57,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Payment Frequency",
            "start": 65,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Code",
            "start": 66,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Compensated Flag",
            "start": 74,
            "length": 1,
            "type": "text"
        },
        {
            "header": "/ 16 (B) Flag",
            "start": 75,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Minimis Eligibility Indicator",
            "start": 76,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 77,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Restriction Code",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Restriction Reason",
            "start": 79,
            "length": 2,
            "type": "text"
        }
    ],
    "61": [
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Eligibility Date",
            "start": 32,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Adjusted Date Of Hire \u2013 Rehire Date",
            "start": 40,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Retirement Date",
            "start": 48,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 56,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Bis Accrual Start Date",
            "start": 61,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 69,
            "length": 12,
            "type": "text"
        }
    ],
    "70": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Tax Amount",
            "start": 32,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Tax Amount",
            "start": 41,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 50,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Tax Supplemental Amount",
            "start": 51,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Tax Supplemental Amount",
            "start": 60,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Amount",
            "start": 69,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Deferral Type Indicator",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Elections",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "70R": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 32,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Amount",
            "start": 41,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 50,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 51,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Supplemental Amount",
            "start": 60,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Catch-Up Amount",
            "start": 69,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Deferral Type Indicator",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Roth Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "70PRIOR": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 25,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Before Tax Amount",
            "start": 32,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "After Tax Amount",
            "start": 41,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 50,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Before Tax Supplemental Amount",
            "start": 51,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "After Tax Supplemental Amount",
            "start": 60,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Catch-Up Amount",
            "start": 69,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "70RPRIOR": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 25,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 32,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Roth Amount",
            "start": 41,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 50,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 51,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Roth Supplemental Amount",
            "start": 60,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Roth Catch-Up Amount",
            "start": 69,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Roth Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "93": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Election",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Cash Percentage",
            "start": 33,
            "length": 3,
            "type": "decimal"
        },
        {
            "header": "Deferral",
            "start": 36,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Withholding",
            "start": 37,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Payment Method",
            "start": 38,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 39,
            "length": 42,
            "type": "text"
        }
    ],
    "EA": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Idber",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Address Status Code",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "E-Mail Type Code",
            "start": 33,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 35,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Thru 3 E-Mail Record Sequence Nbr",
            "start": 37,
            "length": 1,
            "type": "integer"
        },
        {
            "header": "Address Text",
            "start": 38,
            "length": 35,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 73,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 74,
            "length": 7,
            "type": "text"
        }
    ],
    "15": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Record Type",
            "start": 32,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Class",
            "start": 35,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Identifier",
            "start": 38,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Source",
            "start": 42,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Amount",
            "start": 44,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 55,
            "length": 26,
            "type": "text"
        }
    ],
    "15NC": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 32,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Type",
            "start": 40,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Source",
            "start": 42,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Contribution Amount",
            "start": 44,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 55,
            "length": 26,
            "type": "text"
        }
    ],
    "15WDL": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Record Type",
            "start": 32,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Option",
            "start": 36,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Bucket Number",
            "start": 40,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Key Source",
            "start": 42,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Restriction Amount",
            "start": 44,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 55,
            "length": 26,
            "type": "text"
        }
    ],
    "16": [
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Market Value",
            "start": 32,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "12/31/88 Contributions",
            "start": 43,
            "length": 11,
            "type": "text"
        },
        {
            "header": "12/31/88 Withdrawals",
            "start": 54,
            "length": 11,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 65,
            "length": 14,
            "type": "text"
        },
        {
            "header": "Source Type Code",
            "start": 79,
            "length": 2,
            "type": "text"
        }
    ],
    "17": [
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Process Indicator",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Key Fund Number",
            "start": 33,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 37,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Key Source",
            "start": 41,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Key Class",
            "start": 43,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Start Exclusion Amount",
            "start": 46,
            "length": 13,
            "type": "decimal"
        },
        {
            "header": "Zeros",
            "start": 59,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 64,
            "length": 22,
            "type": "text"
        }
    ],
    "18": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Process Indicator",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "86-Gross",
            "start": 33,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "86-Rpt",
            "start": 44,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Process Indicator",
            "start": 55,
            "length": 1,
            "type": "text"
        },
        {
            "header": "87-Gross",
            "start": 56,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "87-Rpt",
            "start": 67,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 78,
            "length": 3,
            "type": "text"
        }
    ],
    "18R": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Process Indicator",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Gross",
            "start": 33,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Rpt",
            "start": 44,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 55,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 56,
            "length": 22,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 78,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Roth Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "24": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Key Distribution Code",
            "start": 32,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Key Federal Withholding Indicator",
            "start": 34,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Key State Withholding Indicator",
            "start": 35,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Federal With.",
            "start": 36,
            "length": 5,
            "type": "decimal"
        },
        {
            "header": "With. Dollar Amount",
            "start": 41,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Key Withdrawal Type",
            "start": 52,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 53,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 57,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Key B - F Indicator",
            "start": 66,
            "length": 1,
            "type": "text"
        },
        {
            "header": "State",
            "start": 67,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Year Life Expectancy Divisor",
            "start": 69,
            "length": 3,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 72,
            "length": 8,
            "type": "text"
        },
        {
            "header": "Key Withdrawal/Swp Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "30": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Key Fund",
            "start": 32,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 36,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Add/Replace Indicator",
            "start": 40,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Key Source",
            "start": 41,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Basis",
            "start": 43,
            "length": 11,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 54,
            "length": 27,
            "type": "text"
        }
    ],
    "31": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Payee Last Name",
            "start": 33,
            "length": 20,
            "type": "text"
        },
        {
            "header": "Payee First Name",
            "start": 53,
            "length": 10,
            "type": "text"
        },
        {
            "header": "Key Plus Tax/Check Switch",
            "start": 63,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 64,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Payee Ssn",
            "start": 65,
            "length": 11,
            "type": "text"
        },
        {
            "header": "4 Alt Payee Number",
            "start": 76,
            "length": 1,
            "type": "integer"
        },
        {
            "header": "4 Alt Payee Total",
            "start": 77,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 78,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Key Association Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "37": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Id",
            "start": 32,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Amount",
            "start": 44,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Rate",
            "start": 53,
            "length": 4,
            "type": "decimal"
        },
        {
            "header": "# Of Payments",
            "start": 57,
            "length": 3,
            "type": "integer"
        },
        {
            "header": "Frequency",
            "start": 60,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Zeros",
            "start": 61,
            "length": 2,
            "type": "text"
        },
        {
            "header": "First Payment Date",
            "start": 63,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Residence Flag",
            "start": 71,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Loan Date",
            "start": 72,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Space",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "38": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifer",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Id",
            "start": 32,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Balance",
            "start": 44,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Type",
            "start": 53,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 54,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Payment Amount",
            "start": 55,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Repayment Method",
            "start": 64,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 65,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Date Last Payment Received",
            "start": 66,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Space",
            "start": 74,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 75,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Deemed Distribution Indicator",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "3A": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Zeros",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "### Part-Loan-Id-3A",
            "start": 32,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Part-Loan-Final-Py-Dt",
            "start": 44,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Spaces",
            "start": 52,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 55,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 58,
            "length": 23,
            "type": "text"
        }
    ],
    "40": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Id",
            "start": 32,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Default Indicator",
            "start": 44,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Default Date",
            "start": 45,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Date Of First Post Default Repay",
            "start": 53,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 61,
            "length": 20,
            "type": "text"
        }
    ],
    "41": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Id",
            "start": 32,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Source",
            "start": 44,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Deemed Amount",
            "start": 46,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Taxable Deemed Amount",
            "start": 57,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Default Interst Amount",
            "start": 68,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 79,
            "length": 2,
            "type": "text"
        }
    ],
    "45": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Amount",
            "start": 32,
            "length": 7,
            "type": "decimal"
        },
        {
            "header": "Space",
            "start": 39,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 40,
            "length": 41,
            "type": "text"
        }
    ],
    "47": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Status",
            "start": 32,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Of Dependents",
            "start": 33,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Type",
            "start": 35,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Counter",
            "start": 37,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Frequency",
            "start": 40,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Next Payment Date",
            "start": 41,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Method",
            "start": 49,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 50,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Id",
            "start": 51,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Rule",
            "start": 58,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Payment Amount",
            "start": 65,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 74,
            "length": 6,
            "type": "text"
        },
        {
            "header": "\u201cR\u201d Swp Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "49": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Number",
            "start": 32,
            "length": 9,
            "type": "integer"
        },
        {
            "header": "Number",
            "start": 41,
            "length": 17,
            "type": "integer"
        },
        {
            "header": "Type",
            "start": 58,
            "length": 1,
            "type": "text"
        },
        {
            "header": "On Bank Account",
            "start": 59,
            "length": 20,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Type Indicator",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "49ACH": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 27,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Number",
            "start": 32,
            "length": 9,
            "type": "integer"
        },
        {
            "header": "Number",
            "start": 41,
            "length": 17,
            "type": "integer"
        },
        {
            "header": "Type",
            "start": 58,
            "length": 1,
            "type": "text"
        },
        {
            "header": "On Bank Account",
            "start": 59,
            "length": 20,
            "type": "text"
        },
        {
            "header": "Day Of Monthly Debit",
            "start": 79,
            "length": 2,
            "type": "integer"
        }
    ],
    "49ACHAD": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 25,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Address For Bank",
            "start": 32,
            "length": 22,
            "type": "text"
        },
        {
            "header": "For Bank",
            "start": 54,
            "length": 20,
            "type": "text"
        },
        {
            "header": "For Bank",
            "start": 74,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Code For Bank",
            "start": 76,
            "length": 5,
            "type": "text"
        }
    ],
    "49ACHBN": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 25,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Name",
            "start": 32,
            "length": 49,
            "type": "text"
        }
    ],
    "49EFTAD": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 25,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Address For Bank",
            "start": 32,
            "length": 22,
            "type": "text"
        },
        {
            "header": "For Bank",
            "start": 54,
            "length": 20,
            "type": "text"
        },
        {
            "header": "For Bank",
            "start": 74,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Code For Bank",
            "start": 76,
            "length": 5,
            "type": "text"
        }
    ],
    "49EFTBN": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 25,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Name",
            "start": 32,
            "length": 49,
            "type": "text"
        }
    ],
    "51": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 32,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Loan Bal Date",
            "start": 34,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Bal Amount",
            "start": 42,
            "length": 7,
            "type": "decimal"
        },
        {
            "header": "Filler",
            "start": 49,
            "length": 32,
            "type": "text"
        }
    ],
    "63": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 10,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Or 000A Service Unit Amount",
            "start": 32,
            "length": 4,
            "type": "decimal"
        },
        {
            "header": "Transaction Date",
            "start": 36,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Space",
            "start": 44,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 45,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Space",
            "start": 46,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Service Period Begin Date",
            "start": 47,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Service Period End Date",
            "start": 55,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Reserved",
            "start": 63,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 70,
            "length": 11,
            "type": "text"
        }
    ],
    "65": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Life Expectancy Divisor",
            "start": 25,
            "length": 3,
            "type": "decimal"
        },
        {
            "header": "Reserved",
            "start": 28,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Type",
            "start": 32,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Account Type",
            "start": 37,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Account Status",
            "start": 38,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Deferred Rbd Date",
            "start": 39,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Notification Indicator",
            "start": 47,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Attained Indicator",
            "start": 48,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Original Recipient Date Of Death",
            "start": 49,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Election Indicator",
            "start": 57,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Life Expectancy Indicator",
            "start": 58,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Year Life Expectancy Divisor",
            "start": 59,
            "length": 4,
            "type": "decimal"
        },
        {
            "header": "Oldest Beneficiarys Birthdate",
            "start": 63,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Status",
            "start": 71,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Of Dependents",
            "start": 72,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Account Setup Date",
            "start": 74,
            "length": 6,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "66": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Type",
            "start": 32,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Valuation Balance",
            "start": 37,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Year\u2019S Acct Valuation Bal",
            "start": 48,
            "length": 11,
            "type": "decimal"
        },
        {
            "header": "Year\u2019S Calculated Mrd Amt",
            "start": 59,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Year\u2019S Beneficiary Relation",
            "start": 68,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Prior Year\u2019S Beneficiary Birthdate",
            "start": 69,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Conversion Indicator",
            "start": 77,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Beneficiary Indicator",
            "start": 78,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 79,
            "length": 2,
            "type": "text"
        }
    ],
    "67": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Type",
            "start": 32,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Year Accum Distributions",
            "start": 37,
            "length": 9,
            "type": "text"
        },
        {
            "header": "To 3/31 Accum Distributions",
            "start": 46,
            "length": 9,
            "type": "text"
        },
        {
            "header": "To Conversion Dt Distributions",
            "start": 55,
            "length": 9,
            "type": "text"
        },
        {
            "header": "Withholding Indicator",
            "start": 64,
            "length": 1,
            "type": "text"
        },
        {
            "header": "W/H Percentage",
            "start": 65,
            "length": 5,
            "type": "decimal"
        },
        {
            "header": "W/H Amount",
            "start": 70,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Withholding Indicator",
            "start": 79,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 80,
            "length": 1,
            "type": "text"
        }
    ],
    "76": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 11,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 24,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Type",
            "start": 32,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Account Type",
            "start": 37,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 38,
            "length": 11,
            "type": "text"
        },
        {
            "header": "Original Participants\u2019 Date Of Birth",
            "start": 49,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Filler",
            "start": 57,
            "length": 24,
            "type": "text"
        }
    ],
    "68": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Name",
            "start": 32,
            "length": 22,
            "type": "text"
        },
        {
            "header": "Name",
            "start": 54,
            "length": 14,
            "type": "text"
        },
        {
            "header": "Beneficiary Number",
            "start": 68,
            "length": 1,
            "type": "integer"
        },
        {
            "header": "Date Of Birth",
            "start": 69,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Relation",
            "start": 77,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Percentage",
            "start": 78,
            "length": 3,
            "type": "decimal"
        }
    ],
    "69": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Name",
            "start": 32,
            "length": 22,
            "type": "text"
        },
        {
            "header": "Name",
            "start": 54,
            "length": 14,
            "type": "text"
        },
        {
            "header": "Beneficiary Number",
            "start": 68,
            "length": 1,
            "type": "integer"
        },
        {
            "header": "Date Of Birth",
            "start": 69,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Relation",
            "start": 77,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Percentage",
            "start": 78,
            "length": 3,
            "type": "decimal"
        }
    ],
    "77": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Transaction Code",
            "start": 32,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Source",
            "start": 35,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Item Number",
            "start": 37,
            "length": 2,
            "type": "integer"
        },
        {
            "header": "Symbol",
            "start": 39,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Value",
            "start": 43,
            "length": 13,
            "type": "decimal"
        },
        {
            "header": "Shares",
            "start": 56,
            "length": 12,
            "type": "decimal"
        },
        {
            "header": "Cost",
            "start": 68,
            "length": 13,
            "type": "decimal"
        }
    ],
    "78": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Source",
            "start": 32,
            "length": 2,
            "type": "text"
        },
        {
            "header": "As-Of-Date",
            "start": 34,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Contributions",
            "start": 42,
            "length": 11,
            "type": "text"
        },
        {
            "header": "Contributions",
            "start": 53,
            "length": 11,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 64,
            "length": 17,
            "type": "text"
        }
    ],
    "79": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Id",
            "start": 32,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 44,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 48,
            "length": 3,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 51,
            "length": 4,
            "type": "text"
        },
        {
            "header": "Source",
            "start": 55,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Loan Balance",
            "start": 57,
            "length": 9,
            "type": "decimal"
        },
        {
            "header": "Spaces",
            "start": 66,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Type",
            "start": 68,
            "length": 1,
            "type": "text"
        },
        {
            "header": "Reinvestment Order",
            "start": 69,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 71,
            "length": 9,
            "type": "text"
        }
    ],
    "WF": [
        {
            "header": "Plan Number",
            "start": 1,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Spaces",
            "start": 6,
            "length": 7,
            "type": "text"
        },
        {
            "header": "Participant Id",
            "start": 13,
            "length": 12,
            "type": "text"
        },
        {
            "header": "Reserved",
            "start": 25,
            "length": 5,
            "type": "text"
        },
        {
            "header": "Record Identifier",
            "start": 30,
            "length": 2,
            "type": "text"
        },
        {
            "header": "Source",
            "start": 32,
            "length": 2,
            "type": "text"
        },
        {
            "header": "As-Of Date",
            "start": 34,
            "length": 8,
            "type": "date"
        },
        {
            "header": "Withdrawals",
            "start": 42,
            "length": 11,
            "type": "text"
        },
        {
            "header": "Forfeitures",
            "start": 53,
            "length": 11,
            "type": "text"
        },
        {
            "header": "Filler",
            "start": 64,
            "length": 17,
            "type": "text"
        }
    ]
}
  };
}());