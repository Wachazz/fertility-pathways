@echo off
cd /d "%~dp0"
echo Connect your phone by USB with USB debugging on.
adb devices
echo.
echo Building a standalone app and installing it. First run takes several minutes.
echo This app has your key inside. Use it on your own phone only.
call npx expo run:android --variant release
pause
