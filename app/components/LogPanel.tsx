export default function LogPanel({ logs }: { logs: string[] }) {
  return (
    <section className="w-full max-w-6xl mt-10 bg-gray-900 text-green-400 rounded-xl shadow-inner p-4 h-48 overflow-y-auto font-mono text-xs">
      <h3 className="text-gray-300 font-semibold mb-2">🧾 System Log</h3>
      {logs.length > 0 ? (
        logs.map((log, i) => <div key={i}>{log}</div>)
      ) : (
        <p className="text-gray-500">ยังไม่มีการทำงาน</p>
      )}
    </section>
  );
}
