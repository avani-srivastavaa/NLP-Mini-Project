@echo off
echo 🚀 Starting Library Management System...
echo.

echo 📊 Starting Backend Server...
:: Using relative paths so it works anywhere
start "Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend Server...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ✅ Both servers are starting...
echo.
echo 🌐 Frontend: http://localhost:5176 (or check the port in terminal)
echo 🔧 Backend: http://localhost:8000
echo 📊 Analytics: http://localhost:8000/analytics
echo 📱 API Docs: http://localhost:8000/docs
echo.
echo 📈 To view analytics: Open frontend → Admin Dashboard → Analytics tab
echo.
pause