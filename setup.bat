@echo off

REM Check for Node.js installation
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js not found. Installing Node.js...
    REM Download and install Node.js (this is for Node.js 16.x)
    curl -o nodejs.msi https://nodejs.org/dist/v16.17.1/node-v16.17.1-x64.msi
    msiexec /i nodejs.msi /quiet /norestart
    del nodejs.msi
)

REM Install npm packages
echo Installing npm packages...
cd /d C:\Mediaroom
npm install
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to install npm packages.
    exit /b %ERRORLEVEL%
)

REM Start the React app
echo Starting the React app...
start "React App" cmd /k "cd /d C:\Mediaroom && npm start"
timeout /t 10 /nobreak >nul

REM Navigate to src directory and run the server
echo Starting the server...
start "Server" cmd /c "cd /d C:\Mediaroom\src && node server.mjs"

echo Setup complete.
pause
