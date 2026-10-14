'use client';
import ImageEditor from './components/ImageEditor';

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-10 font-[Sarabun] text-gray-800">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Image Generator</h1>
      </header>

      <ImageEditor />

      <footer className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Gemini Image Editor · Designed by You
      </footer>
    </main>
  );
}
