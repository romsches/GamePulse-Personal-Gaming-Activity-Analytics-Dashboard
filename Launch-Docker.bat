@echo off
title Launch GamePulse in Docker Desktop
color 0b

echo ========================================================
echo   Starting GamePulse Analytics via Docker Desktop
echo ========================================================
echo.

:: 1. Check if Docker Desktop daemon is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Docker Desktop is not running yet.
    echo [INFO] Starting Docker Desktop application...
    
    if exist "C:\Users\%USERNAME%\AppData\Local\Programs\DockerDesktop\Docker Desktop.exe" (
        start "" "C:\Users\%USERNAME%\AppData\Local\Programs\DockerDesktop\Docker Desktop.exe"
    ) else if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    )

    echo [INFO] Waiting for Docker Engine daemon to initialize...
    :wait_docker
    timeout /t 3 /nobreak >nul
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo [INFO] Still waiting for Docker Engine to be ready...
        goto wait_docker
    )
    echo [SUCCESS] Docker Engine is ready!
)

echo.
echo [INFO] Building and starting GamePulse container group (gamepulse-analytics)...
docker compose up -d --build

echo.
echo ========================================================
echo   GamePulse is running!
echo   - Web Dashboard: http://localhost:3000
echo   - REST API Docs: http://localhost:8000/docs
echo ========================================================
echo.
echo [INFO] You can now manage and start/stop this project directly inside
echo        the Docker Desktop GUI under the Containers tab!
echo.
echo Opening Web Dashboard in your default browser...
start http://localhost:3000

pause
