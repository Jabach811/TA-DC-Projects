@echo off
setlocal

set PORT=8080
set EMP=%~1

if "%EMP%"=="" (
  set /p EMP=Enter employee id (p1, p2, p3, p4): 
)

if "%EMP%"=="" (
  echo No employee id provided.
  pause
  goto :eof
)

start "" "http://localhost:%PORT%/employees/%EMP%/index.html"
