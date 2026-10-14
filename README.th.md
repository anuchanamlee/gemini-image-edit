# 🎨 AI Image Edit + n8n Workflow (Docker + Cloud)

ระบบเว็บสำหรับ **แก้ไขภาพด้วย AI (Google Gemini)** โดยใช้ **n8n** เป็นตัวกลาง  
ผู้ใช้สามารถอัปโหลดภาพ → เลือก Preset / ใส่ Prompt เอง → ระบบส่งไปยัง n8n และ Gemini → แสดงผลลัพธ์เป็นภาพใหม่ให้ดาวน์โหลดได้ทันที 🚀

## 🧩 ภาพรวมระบบ

- **Frontend:** Next.js (React + TailwindCSS)  
- **Workflow / Backend:** n8n — ตรวจสอบสิทธิ์, ส่งต่อไป Gemini, และบันทึก log  
- **AI Model:** Google Gemini (เช่น Gemini 2.5 Flash Image)  
- **Deployment:** Docker + Cloudflare Tunnel (รองรับ Windows 10 / 11)

## ⚙️ สิ่งที่ต้องติดตั้งก่อนเริ่มใช้งาน

- ก่อนเริ่มรันระบบ ให้ติดตั้งโปรแกรมต่อไปนี้ก่อน:

-**Docker Desktop**
- ใช้สำหรับรันระบบทั้งหมดใน Container
- ดาวน์โหลดได้ที่: https://www.docker.com/products/docker-desktop/

- **Cloudflare Tunnel**
- ใช้สำหรับเปิดเว็บให้เข้าจากภายนอกอัตโนมัติ
- วิธีติดตั้ง: เปิด PowerShell แล้วพิมพ์คำสั่ง

- winget install Cloudflare.cloudflared


## 🧠 ติดตั้ง n8n (ผ่าน Docker)




1. เปิด **Docker Desktop**
2. ไปที่ **Docker Hub** → ค้นหา `n8nio/n8n` → กด **Pull**
3. ไปที่แท็บ **Images** → กด **Run**
4. ตั้งค่าตามนี้:  
   - Container name: `n8n`  
   - Port: `5678:5678`  
   - Volume: `n8n_data:/home/node/.n8n`
   - ENV:
     ```
     GENERIC_TIMEZONE=Asia/Bangkok
     TZ=Asia/Bangkok
     N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
     N8N_RUNNERS_ENABLED=true
     ```
5. เปิดเบราว์เซอร์ที่ http://localhost:5678  
6. สร้างบัญชีผู้ใช้ใหม่  
✅ เสร็จสิ้น n8n พร้อมใช้งาน

## 🔧 ติดตั้งและตั้งค่า Workflow

1. เปิด n8n → สร้าง workflow ใหม่ 3 อัน:
   - add user + key generator  
   - auto create folders and upload  
   - ระบบตรวจสอบสิทธิ์ + พรีเซ็ตข้อความ + Gemini image edit + การบันทึก log ลง Google Sheet + การตอบกลับ webhook  

2. เปิดโฟลเดอร์ `N8N_Workflow/`  
   - เปิดไฟล์ `.json` ด้วย Notepad  
   - คัดลอกทั้งหมดแล้ววางใน workflow ที่ตรงชื่อ  
   - กด **Save**

3. ตั้งค่า Credentials ให้ครบ:  
   - Google Sheets  
   - Google Drive  
   - Gemini API  

4. กด **Activate** workflow ทั้งหมด


## 🌐 เปิดเว็บ AI Image Edit

1. ดับเบิลคลิก `start-app.bat`
2. ระบบจะ:
   - สร้างและรัน container (Next.js)
   - เปิด Cloudflare Tunnel อัตโนมัติ
3. รอจนขึ้นข้อความเช่น  


🌐 Opening Cloudflare Tunnel...
https://blue-ocean-xxxx.trycloudflare.com

4. เปิดลิงก์นั้นในเบราว์เซอร์  
✅ ระบบพร้อมใช้งาน



✅ สรุปสั้นสุด

ขั้นตอนการเริ่มต้นใช้งานระบบแบบรวดเร็ว:

1️⃣ ติดตั้ง Docker และ Cloudflare Tunnel
เตรียมเครื่องให้พร้อมสำหรับการรันระบบ

2️⃣ รัน n8n ผ่าน Docker
หลังรันสำเร็จ จะสามารถเปิดได้ที่:
👉 http://localhost:5678

3️⃣ นำเข้า (Import) Workflow ที่เตรียมไว้
ระบบ n8n จะพร้อมทำงานทันที

4️⃣ รันไฟล์ start-app.bat
เปิดหน้าเว็บ AI Image Edit เพื่อใช้งานได้เลย 🚀

## 👨‍💻 ผู้พัฒนา
พัฒนาโดย: **Anucha Namlee (Automation Workflow Designer)**  
ติดต่อ: [anucha.namlee.work@gmail.com]  