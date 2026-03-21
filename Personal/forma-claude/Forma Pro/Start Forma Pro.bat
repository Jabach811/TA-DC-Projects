@echo off
title Forma Pro
echo.
echo  ============================================
echo    FORMA PRO — Document Intelligence
echo    Starting server, please wait...
echo  ============================================
echo.

cd /d "C:\Users\mabac\OneDrive\Desktop\Joel\Hipco Project\Forma -  Main Folder"
call venv\Scripts\activate.bat
python "Forma Pro\server.py"

echo.
echo  Server stopped. Press any key to close.
pause > nul
