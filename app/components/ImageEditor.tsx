'use client';
import { useState, DragEvent } from 'react';
import axios from 'axios';
import {
    ArrowDownTrayIcon,
    PhotoIcon,
} from '@heroicons/react/24/solid';
import StatusBadge from './StatusBadge';
import LogPanel from './LogPanel';

export default function ImageEditor() {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [resultUrl, setResultUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'ready' | 'working' | 'error'>('ready');
    const [promptMode, setPromptMode] = useState<'A' | 'B' | 'C' | 'D'>('A'); // ✅ เพิ่ม D
    const [customPrompt, setCustomPrompt] = useState(''); // ✅ ข้อความที่ผู้ใช้พิมพ์เอง
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) =>
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        addLog(`📤 อัปโหลดภาพ: ${file.name}`);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            addLog(`📤 อัปโหลดภาพ: ${file.name}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey || !image) {
            alert('กรุณาใส่ API Key และอัปโหลดภาพ');
            return;
        }

        // ✅ ถ้าเลือก D → ใช้ customPrompt แทน
        const prompt = promptMode === 'D' ? customPrompt.trim() : promptMode;

        if (promptMode === 'D' && !customPrompt.trim()) {
            alert('กรุณากรอกข้อความสำหรับ Prompt D');
            return;
        }

        addLog(`🚀 ส่งคำขอไปยัง AI (${promptMode})...`);
        setLoading(true);
        setStatus('working');
        setMessage('🧠 กำลังประมวลผล...');

        try {
            const formData = new FormData();
            formData.append('prompt', prompt);
            formData.append('data', image);

            const res = await axios.post('/api/n8n', formData, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { success, status: code, message: apiMsg, data } = res.data;
            addLog(`📩 ตอบกลับจาก API (${code}): ${apiMsg}`);

            if (!success) throw new Error(apiMsg || 'เกิดข้อผิดพลาดจาก API');
            if (!data) throw new Error('ไม่พบข้อมูลภาพใน response');

            setResultUrl(`data:image/png;base64,${data}`);
            setStatus('ready');
            setMessage(`✅ ${apiMsg || 'สำเร็จ! ภาพถูกแก้ไขแล้ว'}`);
            addLog('✅ ประมวลผลสำเร็จ');
        } catch (err: any) {
            const serverMsg =
                err.response?.data?.message ||
                err.message ||
                'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
            setStatus('error');
            setMessage(`❌ ${serverMsg}`);
            addLog(`❌ เกิดข้อผิดพลาด: ${serverMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-8">
                <StatusBadge status={status} />
            </div>

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-start">
                {/* Left Panel */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-lg border p-6 flex flex-col gap-5"
                >
                    {/* API Key */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">🔑 API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="ใส่ API Key ของคุณ..."
                        />
                    </div>

                    {/* Prompt Mode */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">🧠 เลือกรูปแบบ Prompt</label>
                        <div className="grid grid-cols-4 gap-3">
                            {['A', 'B', 'C', 'D'].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setPromptMode(mode as 'A' | 'B' | 'C' | 'D')}
                                    className={`py-2 rounded-lg font-medium border transition ${
                                        promptMode === mode
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                                    }`}
                                >
                                    {mode === 'D' ? 'Custom' : `Prompt ${mode}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ✅ ช่องกรอกข้อความสำหรับ Prompt D */}
                    {promptMode === 'D' && (
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                ✏️ กรอกข้อความที่ต้องการให้ AI ทำ
                            </label>
                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                rows={3}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="เช่น ปรับภาพให้ดูเหมือนภาพสไตล์อนิเมะ..."
                            />
                        </div>
                    )}

                    {/* Upload */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">🖼️ อัปโหลดภาพ</label>
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('fileInput')?.click()}
                            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition bg-gray-50"
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="w-full max-h-72 object-contain rounded-md"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-gray-500">
                                    <PhotoIcon className="w-10 h-10 mb-2" />
                                    <p>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                                </div>
                            )}
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                            loading ? 'bg-yellow-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'กำลังประมวลผล...' : '🚀 ส่งให้ AI แก้ไขภาพ'}
                    </button>
                </form>

                {/* Right Panel */}
                <div className="bg-white rounded-2xl shadow-lg border p-6 text-center flex flex-col h-full">
                    <h2 className="font-semibold mb-4 text-gray-700">✨ ผลลัพธ์</h2>
                    {resultUrl ? (
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={resultUrl}
                                alt="AI result"
                                className="w-full h-full object-contain rounded-lg shadow border"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-400 mt-10 italic">ยังไม่มีภาพที่ประมวลผล</p>
                    )}

                    {resultUrl && (
                        <a
                            href={resultUrl}
                            download="result.png"
                            className="inline-flex items-center justify-center gap-2 mt-5 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:scale-105 transition"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            ดาวน์โหลดภาพ
                        </a>
                    )}
                </div>
            </div>

            {/* Logs */}
            <LogPanel logs={logs} />
        </>
    );
}
