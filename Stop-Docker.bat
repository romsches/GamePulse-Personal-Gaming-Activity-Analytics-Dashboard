@echo off
title Stop GamePulse Docker Containers
echo Stopping GamePulse containers...
docker compose stop
echo Done. You can restart them anytime from Docker Desktop!
pause
