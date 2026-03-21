@echo off
title Forma — Document Extractor
echo.
echo  ============================================
echo    FORMA - Document Extractor
echo    Starting server, please wait...
echo  ============================================
echo.

cd /d "C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder"

:: Activate the virtual environment
call venv\Scripts\activate.bat

:: Run the Flask server (browser opens automatically)
python "New App\server.py"

:: If server exits, pause so user can see any error messages
echo.
echo  Server stopped. Press any key to close.
pause > nul
