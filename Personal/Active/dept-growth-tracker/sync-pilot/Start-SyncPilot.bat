@echo off
setlocal
cd /d "%~dp0"

set PORT=8080
set MANAGER_URL=http://localhost:%PORT%/manager/index.html

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "%MANAGER_URL%"
  echo Starting local server on port %PORT%...
  echo Keep this window open while using the tracker.
  py -m http.server %PORT%
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "%MANAGER_URL%"
  echo Starting local server on port %PORT%...
  echo Keep this window open while using the tracker.
  python -m http.server %PORT%
  goto :eof
)

echo Python was not found.
echo Install Python, then re-run this file.
pause
