@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo Step 1: checking your Expo login
call npx eas-cli whoami || (echo Not logged in. Running login now. & call npx eas-cli login)
echo.
echo Step 2: reading the key from .env
set KEY=
for /f "tokens=1,* delims==" %%a in ('findstr /b "EXPO_PUBLIC_ANTHROPIC_API_KEY=" .env') do set KEY=%%b
if "!KEY!"=="" (echo Key missing in .env & pause & exit /b 1)
echo Step 3: giving the key to the Expo build (not saved in any file)
call npx eas-cli env:create --name EXPO_PUBLIC_ANTHROPIC_API_KEY --value "!KEY!" --environment preview --visibility plaintext --force --non-interactive
echo.
echo Step 4: building the new app on Expo. This takes 10 to 20 minutes. A QR code will show at the end.
call npx eas-cli build --platform android --profile preview --non-interactive --json > new-app-build.json
if not exist new-app mkdir new-app
node scripts\download-build.js
echo.
echo Done. The new app is in the folder "new-app". Scan the QR code from the Expo build page or copy the APK to your phone.
pause
