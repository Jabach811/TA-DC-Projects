$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputRoot = Join-Path $root 'provider-mocks'
$voyaRoot = Join-Path $outputRoot 'VOYA_mock_folder'
$appsRoot = Split-Path (Split-Path $root -Parent) -Parent
$voyaConfigPath = Join-Path $appsRoot 'voya-folder-extraction-console\voya_config_preview.json'

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Format-FixedValue {
  param(
    [object]$Value,
    [int]$Length,
    [string]$Type = 'text'
  )

  $text = if ($null -eq $Value) { '' } else { [string]$Value }
  if ($text.Length -gt $Length) {
    return $text.Substring(0, $Length)
  }

  if ($Type -in @('decimal', 'integer')) {
    return $text.PadLeft($Length)
  }

  return $text.PadRight($Length)
}

function New-FixedWidthLine {
  param(
    [array]$Fields,
    [hashtable]$Values
  )

  $max = 0
  foreach ($field in $Fields) {
    $end = [int]$field.start + [int]$field.length - 1
    if ($end -gt $max) { $max = $end }
  }

  $chars = New-Object char[] $max
  for ($i = 0; $i -lt $max; $i += 1) {
    $chars[$i] = ' '
  }

  foreach ($field in $Fields) {
    $name = [string]$field.header
    if (-not $Values.ContainsKey($name)) { continue }
    $value = Format-FixedValue -Value $Values[$name] -Length ([int]$field.length) -Type ([string]$field.type)
    $start = [int]$field.start - 1
    for ($i = 0; $i -lt $value.Length; $i += 1) {
      $chars[$start + $i] = $value[$i]
    }
  }

  return -join $chars
}

function Write-AsciiLines {
  param(
    [string]$Path,
    [string[]]$Lines
  )

  $dir = Split-Path -Parent $Path
  Ensure-Directory -Path $dir
  $encoding = [System.Text.Encoding]::ASCII
  [System.IO.File]::WriteAllLines($Path, $Lines, $encoding)
}

Ensure-Directory -Path $root
Ensure-Directory -Path $outputRoot
Ensure-Directory -Path $voyaRoot

$empowerFields = @{
  SUBSET = @(
    @{ header = 'RECORD TYPE'; start = 1; length = 6; type = 'text' },
    @{ header = 'GROUP ACCOUNT'; start = 7; length = 13; type = 'text' },
    @{ header = 'SSN'; start = 20; length = 9; type = 'text' },
    @{ header = 'LAST NAME'; start = 46; length = 35; type = 'text' },
    @{ header = 'FIRST NAME'; start = 81; length = 20; type = 'text' },
    @{ header = 'BASIS'; start = 136; length = 4; type = 'text' },
    @{ header = 'VALUE'; start = 140; length = 9; type = 'decimal' },
    @{ header = 'EFFECTIVE DATE'; start = 149; length = 8; type = 'date' }
  )
  EMP = @(
    @{ header = 'RECORD TYPE'; start = 1; length = 6; type = 'text' },
    @{ header = 'GROUP ACCOUNT'; start = 7; length = 13; type = 'text' },
    @{ header = 'SSN'; start = 20; length = 9; type = 'text' },
    @{ header = 'LAST NAME'; start = 46; length = 35; type = 'text' },
    @{ header = 'FIRST NAME'; start = 81; length = 20; type = 'text' },
    @{ header = 'DATE OF HIRE'; start = 136; length = 8; type = 'date' },
    @{ header = 'DATE OF TERMINATION'; start = 144; length = 8; type = 'date' },
    @{ header = 'EMPLOYEE ID'; start = 152; length = 18; type = 'text' },
    @{ header = 'HIGHLY COMPENSATED INDICATOR'; start = 182; length = 1; type = 'text' }
  )
  DFRL = @(
    @{ header = 'RECORD TYPE'; start = 1; length = 6; type = 'text' },
    @{ header = 'GROUP ACCOUNT'; start = 7; length = 13; type = 'text' },
    @{ header = 'SSN'; start = 20; length = 9; type = 'text' },
    @{ header = 'LAST NAME'; start = 46; length = 35; type = 'text' },
    @{ header = 'FIRST NAME'; start = 81; length = 20; type = 'text' },
    @{ header = 'DEFERRAL TYPE'; start = 136; length = 6; type = 'text' },
    @{ header = 'EFFECTIVE DATE'; start = 159; length = 8; type = 'date' },
    @{ header = 'DEFERRAL PERCENT'; start = 167; length = 9; type = 'decimal' },
    @{ header = 'DEFERRAL AMOUNT'; start = 176; length = 18; type = 'decimal' }
  )
  BALANC = @(
    @{ header = 'RECORD TYPE'; start = 1; length = 6; type = 'text' },
    @{ header = 'GROUP ACCOUNT'; start = 7; length = 13; type = 'text' },
    @{ header = 'SSN'; start = 20; length = 9; type = 'text' },
    @{ header = 'LAST NAME'; start = 46; length = 35; type = 'text' },
    @{ header = 'FIRST NAME'; start = 81; length = 20; type = 'text' },
    @{ header = 'MONEY TYPE'; start = 136; length = 3; type = 'text' },
    @{ header = 'SEQUENCE NUMBER'; start = 139; length = 4; type = 'integer' },
    @{ header = 'INVESTMENT OPTION'; start = 143; length = 7; type = 'text' },
    @{ header = 'AMOUNT'; start = 150; length = 18; type = 'decimal' },
    @{ header = 'UNITS/SHARES'; start = 168; length = 54; type = 'decimal' },
    @{ header = 'BALANCE EFFECTIVE DATE'; start = 276; length = 8; type = 'date' }
  )
  ALLOC = @(
    @{ header = 'RECORD TYPE'; start = 1; length = 6; type = 'text' },
    @{ header = 'GROUP ACCOUNT'; start = 7; length = 13; type = 'text' },
    @{ header = 'SSN'; start = 20; length = 9; type = 'text' },
    @{ header = 'LAST NAME'; start = 46; length = 35; type = 'text' },
    @{ header = 'FIRST NAME'; start = 81; length = 20; type = 'text' },
    @{ header = 'MONEY TYPE'; start = 136; length = 3; type = 'text' },
    @{ header = 'SEQUENCE NUMBER'; start = 139; length = 4; type = 'integer' },
    @{ header = 'INVESTMENT OPTION'; start = 143; length = 7; type = 'text' },
    @{ header = 'PERCENT'; start = 150; length = 7; type = 'decimal' },
    @{ header = 'DEFAULT INDICATOR'; start = 157; length = 1; type = 'text' },
    @{ header = 'MODEL NUMBER'; start = 158; length = 3; type = 'text' }
  )
  LOANS = @(
    @{ header = 'RECORD TYPE'; start = 1; length = 6; type = 'text' },
    @{ header = 'GROUP ACCOUNT'; start = 7; length = 13; type = 'text' },
    @{ header = 'SSN'; start = 20; length = 9; type = 'text' },
    @{ header = 'LAST NAME'; start = 46; length = 35; type = 'text' },
    @{ header = 'FIRST NAME'; start = 81; length = 20; type = 'text' },
    @{ header = 'LOAN NUMBER'; start = 136; length = 10; type = 'text' },
    @{ header = 'FIRST DUE DATE'; start = 162; length = 8; type = 'date' },
    @{ header = 'REPAY AMOUNT'; start = 172; length = 18; type = 'decimal' },
    @{ header = 'ORIGINAL LOAN AMOUNT'; start = 198; length = 18; type = 'decimal' },
    @{ header = 'OUTSTANDING PRINCIPAL'; start = 249; length = 18; type = 'decimal' },
    @{ header = 'MATURITY DATE'; start = 267; length = 8; type = 'date' }
  )
}

$newportFields = @{
  HD = @(
    @{ header = 'RECORD-CDE'; start = 1; length = 2; type = 'text' },
    @{ header = 'PART-TAX-ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'PLAN-LEGAL-NAME'; start = 12; length = 35; type = 'text' },
    @{ header = 'PLAN-YEAR-END-DATE'; start = 47; length = 10; type = 'date' }
  )
  PT = @(
    @{ header = 'RECORD-CDE'; start = 1; length = 2; type = 'text' },
    @{ header = 'PART-TAX-ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'PARTICIPANT-NME'; start = 65; length = 35; type = 'text' },
    @{ header = 'PART-BIRTH-DTE'; start = 272; length = 10; type = 'date' },
    @{ header = 'PART-STATUS-CDE'; start = 382; length = 2; type = 'text' },
    @{ header = 'PLAN-YTD-SAL-AMT'; start = 418; length = 17; type = 'decimal' }
  )
  MT = @(
    @{ header = 'RECORD-CDE'; start = 1; length = 2; type = 'text' },
    @{ header = 'PART-TAX-ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'CONTR-MONEY-TY-CDE'; start = 12; length = 3; type = 'text' },
    @{ header = 'MONEY-TYPE-VESTED-AMT'; start = 31; length = 17; type = 'decimal' },
    @{ header = 'MNYT-BATCH-CONVERSION-AMT'; start = 184; length = 17; type = 'decimal' }
  )
  VA = @(
    @{ header = 'RECORD-CDE'; start = 1; length = 2; type = 'text' },
    @{ header = 'PART-TAX-ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'CONTR-MONEY-TY-CDE'; start = 12; length = 3; type = 'text' },
    @{ header = 'PROV-EXT-INV-VH-ID'; start = 15; length = 10; type = 'text' },
    @{ header = 'PART-ALLOCAT-AMT'; start = 25; length = 17; type = 'decimal' },
    @{ header = 'MNYT-VEH-CONVERSION-AMT'; start = 59; length = 16; type = 'decimal' }
  )
  PR = @(
    @{ header = 'RECORD-CDE'; start = 1; length = 2; type = 'text' },
    @{ header = 'PART-TAX-ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'PLAN-ENROLL-DTE'; start = 12; length = 10; type = 'date' },
    @{ header = 'INI-PRE-TAX-ERL'; start = 22; length = 16; type = 'decimal' },
    @{ header = 'ROTH-EDFR-ERL-AT'; start = 116; length = 17; type = 'decimal' }
  )
}

$nationwideFields = @{
  HD = @(
    @{ header = 'Record Code'; start = 1; length = 2; type = 'text' },
    @{ header = 'Participant Tax ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'Plan Legal Name'; start = 12; length = 35; type = 'text' },
    @{ header = 'Plan Year-End Date'; start = 47; length = 10; type = 'date' }
  )
  PT = @(
    @{ header = 'Record Code'; start = 1; length = 2; type = 'text' },
    @{ header = 'Participant Tax ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'Participant Name'; start = 65; length = 35; type = 'text' },
    @{ header = 'Participant Birth Date'; start = 272; length = 10; type = 'date' },
    @{ header = 'Participant Status Code'; start = 382; length = 2; type = 'text' },
    @{ header = 'Plan YTD Salary Amount'; start = 418; length = 17; type = 'decimal' }
  )
  MT = @(
    @{ header = 'Record Code'; start = 1; length = 2; type = 'text' },
    @{ header = 'Participant Tax ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'Money Type Code'; start = 12; length = 3; type = 'text' },
    @{ header = 'Money Type Vested Amount'; start = 31; length = 17; type = 'decimal' },
    @{ header = 'Converted Balance Amount'; start = 184; length = 17; type = 'decimal' }
  )
  VA = @(
    @{ header = 'Record Code'; start = 1; length = 2; type = 'text' },
    @{ header = 'Participant Tax ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'Money Type Code'; start = 12; length = 3; type = 'text' },
    @{ header = 'Vehicle ID'; start = 15; length = 10; type = 'text' },
    @{ header = 'Participant Allocation Amount'; start = 25; length = 17; type = 'decimal' },
    @{ header = 'Money Type Vehicle Conversion Amount'; start = 59; length = 17; type = 'decimal' }
  )
  PR = @(
    @{ header = 'Record Code'; start = 1; length = 2; type = 'text' },
    @{ header = 'Participant Tax ID'; start = 3; length = 9; type = 'text' },
    @{ header = 'Plan Enrollment Date'; start = 12; length = 10; type = 'date' },
    @{ header = 'Pre-tax Amount'; start = 54; length = 17; type = 'decimal' },
    @{ header = 'Roth Elective Deferral Contribution Enrollment Amount'; start = 116; length = 17; type = 'decimal' }
  )
}

$adpFields = @{
  PH = @(
    @{ header = 'Record ID'; start = 1; length = 2; type = 'text' },
    @{ header = 'Social Security Number'; start = 3; length = 9; type = 'text' },
    @{ header = 'Name'; start = 12; length = 30; type = 'text' },
    @{ header = 'Employee File Number'; start = 42; length = 13; type = 'text' },
    @{ header = 'Status'; start = 55; length = 2; type = 'text' },
    @{ header = 'Date of Birth'; start = 57; length = 8; type = 'date' },
    @{ header = 'Date of Hire'; start = 65; length = 8; type = 'date' },
    @{ header = 'Eligible Date'; start = 463; length = 8; type = 'date' }
  )
  PF = @(
    @{ header = 'Record ID'; start = 1; length = 2; type = 'text' },
    @{ header = 'Social Security Number'; start = 3; length = 9; type = 'text' },
    @{ header = 'Fund ID'; start = 12; length = 2; type = 'text' },
    @{ header = 'Source ID'; start = 14; length = 1; type = 'text' },
    @{ header = 'Contribution Allocation Percent'; start = 15; length = 4; type = 'decimal' },
    @{ header = 'Gross Contributions Year-to-date'; start = 20; length = 11; type = 'decimal' },
    @{ header = 'Conversion Balance-Market Value'; start = 32; length = 11; type = 'decimal' },
    @{ header = 'Cost Balance'; start = 44; length = 11; type = 'decimal' }
  )
  IN = @(
    @{ header = 'Record ID'; start = 1; length = 2; type = 'text' },
    @{ header = 'Social Security Number'; start = 3; length = 9; type = 'text' },
    @{ header = 'Start Date'; start = 12; length = 8; type = 'date' },
    @{ header = 'Next Pay Date'; start = 28; length = 8; type = 'date' },
    @{ header = 'Method'; start = 43; length = 1; type = 'text' },
    @{ header = 'Installment Amount or Percent'; start = 65; length = 11; type = 'decimal' }
  )
  LH = @(
    @{ header = 'Record ID'; start = 1; length = 2; type = 'text' },
    @{ header = 'Social Security Number'; start = 3; length = 9; type = 'text' },
    @{ header = 'Loan Number'; start = 12; length = 3; type = 'integer' },
    @{ header = 'Date of Loan Issue Date'; start = 15; length = 8; type = 'date' },
    @{ header = 'Loan Original Amount'; start = 39; length = 11; type = 'decimal' },
    @{ header = 'Loan Balance Current'; start = 50; length = 11; type = 'decimal' }
  )
}

function New-FidelityLine {
  param(
    [hashtable]$placements,
    [int]$length = 90
  )
  $chars = New-Object char[] $length
  for ($i = 0; $i -lt $length; $i += 1) { $chars[$i] = ' ' }
  foreach ($startKey in $placements.Keys) {
    $start = [int]$startKey
    $value = [string]$placements[$startKey]
    for ($i = 0; $i -lt $value.Length -and ($start - 1 + $i) -lt $length; $i += 1) {
      $chars[$start - 1 + $i] = $value[$i]
    }
  }
  -join $chars
}

$empowerLines = @(
  'TITLE1 EMPOWER MOCK DATA'
  (New-FixedWidthLine $empowerFields.SUBSET @{
      'RECORD TYPE' = 'SUBSET'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '111223333'; 'LAST NAME' = 'ADAMS'; 'FIRST NAME' = 'JORDAN'; 'BASIS' = 'ROTH'; 'VALUE' = '1250.75'; 'EFFECTIVE DATE' = '20260101'
    }),
  (New-FixedWidthLine $empowerFields.EMP @{
      'RECORD TYPE' = 'EMP'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '111223333'; 'LAST NAME' = 'ADAMS'; 'FIRST NAME' = 'JORDAN'; 'DATE OF HIRE' = '20190415'; 'EMPLOYEE ID' = 'E10001'; 'HIGHLY COMPENSATED INDICATOR' = 'N'
    }),
  (New-FixedWidthLine $empowerFields.DFRL @{
      'RECORD TYPE' = 'DFRL'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '111223333'; 'LAST NAME' = 'ADAMS'; 'FIRST NAME' = 'JORDAN'; 'DEFERRAL TYPE' = 'PRE'; 'EFFECTIVE DATE' = '20260101'; 'DEFERRAL PERCENT' = '6.50'; 'DEFERRAL AMOUNT' = '0'
    }),
  (New-FixedWidthLine $empowerFields.BALANC @{
      'RECORD TYPE' = 'BALANC'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '111223333'; 'LAST NAME' = 'ADAMS'; 'FIRST NAME' = 'JORDAN'; 'MONEY TYPE' = 'EE1'; 'SEQUENCE NUMBER' = '1'; 'INVESTMENT OPTION' = 'FND1001'; 'AMOUNT' = '15234.67'; 'UNITS/SHARES' = '456.1234'; 'BALANCE EFFECTIVE DATE' = '20260131'
    }),
  (New-FixedWidthLine $empowerFields.BALANC @{
      'RECORD TYPE' = 'BALANC'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '111223333'; 'LAST NAME' = 'ADAMS'; 'FIRST NAME' = 'JORDAN'; 'MONEY TYPE' = 'RTH'; 'SEQUENCE NUMBER' = '2'; 'INVESTMENT OPTION' = 'FND2002'; 'AMOUNT' = '8040.12'; 'UNITS/SHARES' = '209.8801'; 'BALANCE EFFECTIVE DATE' = '20260131'
    }),
  (New-FixedWidthLine $empowerFields.BALANC @{
      'RECORD TYPE' = 'BALANC'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '222334444'; 'LAST NAME' = 'BROOKS'; 'FIRST NAME' = 'MAYA'; 'MONEY TYPE' = 'ERM'; 'SEQUENCE NUMBER' = '1'; 'INVESTMENT OPTION' = 'FND1001'; 'AMOUNT' = '12890.55'; 'UNITS/SHARES' = '344.1100'; 'BALANCE EFFECTIVE DATE' = '20260131'
    }),
  (New-FixedWidthLine $empowerFields.ALLOC @{
      'RECORD TYPE' = 'ALLOC'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '111223333'; 'LAST NAME' = 'ADAMS'; 'FIRST NAME' = 'JORDAN'; 'MONEY TYPE' = 'EE1'; 'SEQUENCE NUMBER' = '1'; 'INVESTMENT OPTION' = 'FND1001'; 'PERCENT' = '60.0'; 'DEFAULT INDICATOR' = 'N'; 'MODEL NUMBER' = '101'
    }),
  (New-FixedWidthLine $empowerFields.ALLOC @{
      'RECORD TYPE' = 'ALLOC'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '111223333'; 'LAST NAME' = 'ADAMS'; 'FIRST NAME' = 'JORDAN'; 'MONEY TYPE' = 'RTH'; 'SEQUENCE NUMBER' = '2'; 'INVESTMENT OPTION' = 'FND2002'; 'PERCENT' = '40.0'; 'DEFAULT INDICATOR' = 'N'; 'MODEL NUMBER' = '101'
    }),
  (New-FixedWidthLine $empowerFields.LOANS @{
      'RECORD TYPE' = 'LOANS'; 'GROUP ACCOUNT' = 'GRP0000000001'; 'SSN' = '222334444'; 'LAST NAME' = 'BROOKS'; 'FIRST NAME' = 'MAYA'; 'LOAN NUMBER' = 'LN0001'; 'FIRST DUE DATE' = '20260215'; 'REPAY AMOUNT' = '125.00'; 'ORIGINAL LOAN AMOUNT' = '5000.00'; 'OUTSTANDING PRINCIPAL' = '4325.25'; 'MATURITY DATE' = '20291215'
    }),
  'FOOTER EMPOWER MOCK DATA'
)

$newportLines = @(
  'TITLE1 NEWPORT MOCK DATA'
  (New-FixedWidthLine $newportFields.HD @{
      'RECORD-CDE' = 'HD'; 'PART-TAX-ID' = '000000000'; 'PLAN-LEGAL-NAME' = 'NEWPORT MOCK SAVINGS PLAN'; 'PLAN-YEAR-END-DATE' = '2025-12-31'
    }),
  (New-FixedWidthLine $newportFields.PT @{
      'RECORD-CDE' = 'PT'; 'PART-TAX-ID' = '111223333'; 'PARTICIPANT-NME' = 'JORDAN ADAMS'; 'PART-BIRTH-DTE' = '1988-04-12'; 'PART-STATUS-CDE' = 'AC'; 'PLAN-YTD-SAL-AMT' = '82000.50'
    }),
  (New-FixedWidthLine $newportFields.MT @{
      'RECORD-CDE' = 'MT'; 'PART-TAX-ID' = '111223333'; 'CONTR-MONEY-TY-CDE' = 'EMP'; 'MONEY-TYPE-VESTED-AMT' = '15250.75'; 'MNYT-BATCH-CONVERSION-AMT' = '15250.75'
    }),
  (New-FixedWidthLine $newportFields.VA @{
      'RECORD-CDE' = 'VA'; 'PART-TAX-ID' = '111223333'; 'CONTR-MONEY-TY-CDE' = 'EMP'; 'PROV-EXT-INV-VH-ID' = 'FUND000001'; 'PART-ALLOCAT-AMT' = '15250.75'; 'MNYT-VEH-CONVERSION-AMT' = '15250.75'
    }),
  (New-FixedWidthLine $newportFields.VA @{
      'RECORD-CDE' = 'VA'; 'PART-TAX-ID' = '111223333'; 'CONTR-MONEY-TY-CDE' = 'RTH'; 'PROV-EXT-INV-VH-ID' = 'FUND000002'; 'PART-ALLOCAT-AMT' = '4800.20'; 'MNYT-VEH-CONVERSION-AMT' = '4800.20'
    }),
  (New-FixedWidthLine $newportFields.VA @{
      'RECORD-CDE' = 'VA'; 'PART-TAX-ID' = '222334444'; 'CONTR-MONEY-TY-CDE' = 'MAT'; 'PROV-EXT-INV-VH-ID' = 'FUND000001'; 'PART-ALLOCAT-AMT' = '9750.00'; 'MNYT-VEH-CONVERSION-AMT' = '9750.00'
    }),
  (New-FixedWidthLine $newportFields.PR @{
      'RECORD-CDE' = 'PR'; 'PART-TAX-ID' = '111223333'; 'PLAN-ENROLL-DTE' = '2024-01-01'; 'INI-PRE-TAX-ERL' = '6.0000'; 'ROTH-EDFR-ERL-AT' = '3.5000'
    }),
  'FOOTER NEWPORT MOCK DATA'
)

$nationwideLines = @(
  'TITLE1 NATIONWIDE MOCK DATA'
  (New-FixedWidthLine $nationwideFields.HD @{
      'Record Code' = 'HD'; 'Participant Tax ID' = '000000000'; 'Plan Legal Name' = 'NATIONWIDE MOCK SAVINGS PLAN'; 'Plan Year-End Date' = '2025-12-31'
    }),
  (New-FixedWidthLine $nationwideFields.PT @{
      'Record Code' = 'PT'; 'Participant Tax ID' = '111223333'; 'Participant Name' = 'JORDAN ADAMS'; 'Participant Birth Date' = '1988-04-12'; 'Participant Status Code' = 'AC'; 'Plan YTD Salary Amount' = '82000.50'
    }),
  (New-FixedWidthLine $nationwideFields.MT @{
      'Record Code' = 'MT'; 'Participant Tax ID' = '111223333'; 'Money Type Code' = 'EMP'; 'Money Type Vested Amount' = '15510.40'; 'Converted Balance Amount' = '15510.40'
    }),
  (New-FixedWidthLine $nationwideFields.VA @{
      'Record Code' = 'VA'; 'Participant Tax ID' = '111223333'; 'Money Type Code' = 'EMP'; 'Vehicle ID' = 'FUND000101'; 'Participant Allocation Amount' = '15510.40'; 'Money Type Vehicle Conversion Amount' = '15510.40'
    }),
  (New-FixedWidthLine $nationwideFields.VA @{
      'Record Code' = 'VA'; 'Participant Tax ID' = '111223333'; 'Money Type Code' = 'RTH'; 'Vehicle ID' = 'FUND000202'; 'Participant Allocation Amount' = '5225.80'; 'Money Type Vehicle Conversion Amount' = '5225.80'
    }),
  (New-FixedWidthLine $nationwideFields.VA @{
      'Record Code' = 'VA'; 'Participant Tax ID' = '222334444'; 'Money Type Code' = 'MAT'; 'Vehicle ID' = 'FUND000101'; 'Participant Allocation Amount' = '9100.00'; 'Money Type Vehicle Conversion Amount' = '9100.00'
    }),
  (New-FixedWidthLine $nationwideFields.PR @{
      'Record Code' = 'PR'; 'Participant Tax ID' = '111223333'; 'Plan Enrollment Date' = '2024-01-01'; 'Pre-tax Amount' = '6.0000'; 'Roth Elective Deferral Contribution Enrollment Amount' = '3.5000'
    }),
  'FOOTER NATIONWIDE MOCK DATA'
)

$adpLines = @(
  'TITLE1 ADP MOCK DATA'
  (New-FixedWidthLine $adpFields.PH @{
      'Record ID' = 'PH'; 'Social Security Number' = '111223333'; 'Name' = 'JORDAN ADAMS'; 'Employee File Number' = 'EMP10001'; 'Status' = 'AC'; 'Date of Birth' = '19880412'; 'Date of Hire' = '20190415'; 'Eligible Date' = '20200101'
    }),
  (New-FixedWidthLine $adpFields.PF @{
      'Record ID' = 'PF'; 'Social Security Number' = '111223333'; 'Fund ID' = 'F1'; 'Source ID' = 'A'; 'Contribution Allocation Percent' = '60'; 'Gross Contributions Year-to-date' = '350000'; 'Conversion Balance-Market Value' = '152500'; 'Cost Balance' = '140200'
    }),
  (New-FixedWidthLine $adpFields.PF @{
      'Record ID' = 'PF'; 'Social Security Number' = '111223333'; 'Fund ID' = 'F2'; 'Source ID' = 'R'; 'Contribution Allocation Percent' = '40'; 'Gross Contributions Year-to-date' = '120000'; 'Conversion Balance-Market Value' = '48000'; 'Cost Balance' = '43000'
    }),
  (New-FixedWidthLine $adpFields.PF @{
      'Record ID' = 'PF'; 'Social Security Number' = '222334444'; 'Fund ID' = 'F1'; 'Source ID' = 'M'; 'Contribution Allocation Percent' = '100'; 'Gross Contributions Year-to-date' = '220000'; 'Conversion Balance-Market Value' = '97500'; 'Cost Balance' = '88000'
    }),
  (New-FixedWidthLine $adpFields.IN @{
      'Record ID' = 'IN'; 'Social Security Number' = '111223333'; 'Start Date' = '20260101'; 'Next Pay Date' = '20260415'; 'Method' = 'D'; 'Installment Amount or Percent' = '250.00'
    }),
  (New-FixedWidthLine $adpFields.LH @{
      'Record ID' = 'LH'; 'Social Security Number' = '222334444'; 'Loan Number' = '1'; 'Date of Loan Issue Date' = '20230401'; 'Loan Original Amount' = '50000'; 'Loan Balance Current' = '41255'
    }),
  'FOOTER ADP MOCK DATA'
)

$fidelityLines = @(
  'TITLE1 FIDELITY MOCK DATA'
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '15'; 32 = 'CLS'; 35 = 'A01'; 38 = 'FND1'; 42 = 'E1'; 44 = '15250.75'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '15'; 32 = 'CLS'; 35 = 'A01'; 38 = 'FND2'; 42 = 'R1'; 44 = '4800.20'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000222334444'; 30 = '15'; 32 = 'CLS'; 35 = 'A01'; 38 = 'FND1'; 42 = 'M1'; 44 = '9750.00'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '15'; 40 = 'NC'; 42 = 'E1'; 44 = '1200.00'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '15'; 32 = 'WDL1'; 40 = '01'; 44 = '350.00'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '02'; 32 = 'D'; 40 = '20260101'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '02'; 32 = 'E'; 40 = '20260201'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '07'; 32 = 'D'; 40 = '6.5000'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '07'; 32 = 'D'; 33 = '01'; 80 = 'Y'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '07'; 32 = 'Y'; 40 = 'AUTO'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '32'; 40 = 'FUND A'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '33'; 40 = 'FUND B'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 30 = '34'; 40 = 'FUND C'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 25 = '49EFTAD'; 44 = 'BANK A'
    }),
  (New-FidelityLine @{
      1 = '54321'; 13 = '000111223333'; 25 = '49ACHBN'; 44 = 'BANK B'
    }),
  'FOOTER FIDELITY MOCK DATA'
)

$voyaLibrary = Get-Content -Raw -Path $voyaConfigPath | ConvertFrom-Json

$voyaSamples = @{
  AA = @(
    @{ 'AA-PLAN-NUM' = '123456'; 'AA-PLAN-SEQ' = '001'; 'AA-ADDRESS-PREFIX' = 'HM'; 'AA-ADDRESS-ID' = 'ADDR0000000000000001'; 'AA-SEQ-NUM' = '001'; 'AA-REC-TYPE' = 'AA'; 'AA-LAST-CHG-DATE' = '20260115'; 'AA-NAME' = 'JORDAN ADAMS'; 'AA-ADDR-L1' = '101 MAIN STREET'; 'AA-ADDR-L4-CITY' = 'SEATTLE'; 'AA-ADR-L4-STATE' = 'WA'; 'AA-ADDR-L4-ZIP' = '981011234' },
    @{ 'AA-PLAN-NUM' = '123456'; 'AA-PLAN-SEQ' = '001'; 'AA-ADDRESS-PREFIX' = 'ML'; 'AA-ADDRESS-ID' = 'ADDR0000000000000002'; 'AA-SEQ-NUM' = '002'; 'AA-REC-TYPE' = 'AA'; 'AA-LAST-CHG-DATE' = '20260120'; 'AA-NAME' = 'MAYA BROOKS'; 'AA-ADDR-L1' = '202 PINE AVE'; 'AA-ADDR-L4-CITY' = 'PORTLAND'; 'AA-ADR-L4-STATE' = 'OR'; 'AA-ADDR-L4-ZIP' = '972051111' }
  )
  AF = @(
    @{ 'PTAF-PLAN-NUM' = '123456'; 'PTAF-PLAN-SEQ' = '001'; 'PTAF-PART-ID' = 'PART0000000000001'; 'PTAF-YEAR' = '2025'; 'PTAF-REC-TYPE' = 'AF'; 'PTAF-401K-EE-CNTRB' = '00000125000'; 'PTAF-ROTH-CNTRB' = '00000045000' },
    @{ 'PTAF-PLAN-NUM' = '123456'; 'PTAF-PLAN-SEQ' = '001'; 'PTAF-PART-ID' = 'PART0000000000002'; 'PTAF-YEAR' = '2025'; 'PTAF-REC-TYPE' = 'AF'; 'PTAF-401K-EE-CNTRB' = '00000098000'; 'PTAF-ROTH-CNTRB' = '00000000000' }
  )
  PS = @(
    @{ 'PS-PLAN-NUM' = '123456'; 'PS-PLAN-SEQ' = '001'; 'PS-PART-ID' = '111223333'; 'PS-PART-SUB-PLAN' = 'CORE01'; 'PS-PART-EXT' = '00'; 'PS-SRC' = 'E'; 'PS-REC-TYPE' = 'PS'; 'PS-ENTRY-DATE' = '20200101'; 'PS-FIRST-CNTRB-DATE' = '20200201'; 'PS-DEFERRAL-RATE' = '00650'; 'PS-DEFERRAL-AMOUNT' = '0002500' },
    @{ 'PS-PLAN-NUM' = '123456'; 'PS-PLAN-SEQ' = '001'; 'PS-PART-ID' = '222334444'; 'PS-PART-SUB-PLAN' = 'CORE01'; 'PS-PART-EXT' = '00'; 'PS-SRC' = 'R'; 'PS-REC-TYPE' = 'PS'; 'PS-ENTRY-DATE' = '20210301'; 'PS-FIRST-CNTRB-DATE' = '20210401'; 'PS-DEFERRAL-RATE' = '00350'; 'PS-DEFERRAL-AMOUNT' = '0001250' }
  )
  SC = @(
    @{ 'AHSC-PLAN-NUM' = '123456'; 'AHSC-PLAN-SEQ' = '001'; 'AHSC-SOURCE' = 'E'; 'AHSC-RECORD-TYPE' = 'SC'; 'AHSC-SOURCE-NAME' = 'Employee Pre-Tax'; 'AHSC-SHORT-SOURCE-NAME' = 'PRETAX' },
    @{ 'AHSC-PLAN-NUM' = '123456'; 'AHSC-PLAN-SEQ' = '001'; 'AHSC-SOURCE' = 'R'; 'AHSC-RECORD-TYPE' = 'SC'; 'AHSC-SOURCE-NAME' = 'Roth Contribution'; 'AHSC-SHORT-SOURCE-NAME' = 'ROTH' }
  )
}

foreach ($code in $voyaSamples.Keys) {
  $config = $voyaLibrary.$code
  $lines = foreach ($row in $voyaSamples[$code]) {
    New-FixedWidthLine -Fields $config.fields -Values $row
  }
  Write-AsciiLines -Path (Join-Path $voyaRoot ("EXTRACT_{0}_123456.TXT" -f $code)) -Lines $lines
}

Write-AsciiLines -Path (Join-Path $voyaRoot 'README_IGNORE_ME.txt') -Lines @('This file is intentionally here to test skip logic in the Voya folder parser.')
Write-AsciiLines -Path (Join-Path $outputRoot 'EMPOWER_mock_dataset.txt') -Lines $empowerLines
Write-AsciiLines -Path (Join-Path $outputRoot 'NEWPORT_mock_dataset.txt') -Lines $newportLines
Write-AsciiLines -Path (Join-Path $outputRoot 'NATIONWIDE_mock_dataset.txt') -Lines $nationwideLines
Write-AsciiLines -Path (Join-Path $outputRoot 'ADP_mock_dataset.txt') -Lines $adpLines
Write-AsciiLines -Path (Join-Path $outputRoot 'FIDELITY_mock_dataset.txt') -Lines $fidelityLines

Write-Host 'Mock data generated in:'
Write-Host "  $outputRoot"
Write-Host "  $voyaRoot"
