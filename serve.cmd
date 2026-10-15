@echo off
rem Serves the mockup at http://localhost:8000 so pages can load data\product.json.
rem Double-click this file, or run "serve" from the project folder. Close the window to stop.
cd /d "%~dp0"
start "" http://localhost:8000/
python -m http.server 8000
