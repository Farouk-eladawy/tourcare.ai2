@echo off
chcp 65001 >nul
echo ========================================================
echo       TourCare.ai Auto-Deploy Script for Netlify
echo ========================================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH.
    pause
    exit /b
)

echo [1/5] Initializing Git repository...
if not exist .git (
    git init
) else (
    echo Git repository already initialized.
)

echo [2/5] Configuring Remote Repository...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Farouk-eladawy/tourcare.ai2.git

echo [3/5] Staging files...
git add .

echo [4/5] Committing changes...
set /p commit_msg="Enter commit message (Press Enter for default 'Auto-deploy'): "
if "%commit_msg%"=="" set commit_msg=Auto-deploy via Script
git commit -m "%commit_msg%"

echo [5/5] Pushing to GitHub (main branch)...
git branch -M main
git push -u origin main --force

echo.
echo ========================================================
echo       Deployment Process Completed!
echo ========================================================
echo Now go to Netlify Dashboard and import this repository.
echo.
pause
