@echo off
cd /d "%~dp0.."
node server\test-key.mjs
echo.
echo You can close this window.
pause
