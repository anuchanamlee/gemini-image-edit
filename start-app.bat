@echo off
setlocal

:: 🔍 ระบุตำแหน่งสคริปต์อัตโนมัติ
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo 🚀 Starting AI Image Edit Web App from: %SCRIPT_DIR%

:: ✅ หยุด container เก่า (ถ้ามี)
docker compose down

:: ✅ สร้างและรัน container (เฉพาะ Next.js)
docker compose up -d --build

:: ✅ แสดงสถานะ container ปัจจุบัน
echo 🔍 Checking container status...
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

:: ✅ รอให้เว็บพร้อมก่อนเปิด Tunnel
echo ⏳ Waiting for containers to start...
timeout /t 8 >nul

:: ✅ เปิด Cloudflare Tunnel ไปยัง Next.js (พอร์ต 3000)
echo 🌐 Opening Cloudflare Tunnel...
cloudflared tunnel --url http://localhost:3000

echo ✅ All systems up and running!
pause
endlocal
