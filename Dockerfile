# ---------- Stage 1 : Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# ติดตั้ง dependency
COPY package*.json ./
RUN npm ci

# ก็อปโค้ดทั้งหมดเข้าไป แล้ว build
COPY . .
RUN npm run build

# ---------- Stage 2 : Runtime ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# คัดลอกจาก stage แรกมาเฉพาะผลลัพธ์ที่จำเป็น
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "run", "start"]
