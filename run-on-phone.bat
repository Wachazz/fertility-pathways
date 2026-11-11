@echo off
cd /d "%~dp0"
echo Checking phone connection...
adb devices
echo.
echo Building and installing on your phone. First run takes several minutes.
call npx expo run:android
pause
