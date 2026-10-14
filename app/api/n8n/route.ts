// ✅ บังคับให้ใช้ Node.js runtime (ไม่ใช้ Edge)
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ✅ log ตรวจดูตอน deploy ครั้งแรก (ลบได้ภายหลัง)
    console.log("Proxy → n8n เรียกใช้งานแล้ว");

    // ✅ อ่าน webhook URL จาก environment
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL ไม่ได้ตั้งค่าใน .env.local');
    }

    // ✅ ส่งต่อไป n8n Cloud (อย่าลืม workflow ต้อง Active)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Authorization: req.headers.get('authorization') || '',
      },
      body: formData,
    });

    // ✅ ถ้า n8n ไม่ตอบกลับ JSON (บาง workflow return binary)
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      return NextResponse.json({ success: true, message: 'Raw response', data: text });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error('❌ Proxy error:', err);
    return NextResponse.json(
      { message: 'Proxy failed', error: err.message },
      { status: 500 }
    );
  }
}
