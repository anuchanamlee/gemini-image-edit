import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

export default function StatusBadge({ status }: { status: 'ready' | 'working' | 'error' }) {
  const base =
    'flex items-center justify-center gap-2 px-5 py-2 rounded-full font-medium transition text-sm';

  switch (status) {
    case 'ready':
      return (
        <div className={`${base} bg-green-50 text-green-700 border border-green-300`}>
          <CheckCircleIcon className="w-5 h-5" />
          ระบบพร้อมทำงาน
        </div>
      );
    case 'working':
      return (
        <div className={`${base} bg-yellow-50 text-yellow-700 border border-yellow-300 animate-pulse`}>
          <ClockIcon className="w-5 h-5" />
          ระบบกำลังทำงาน...
        </div>
      );
    case 'error':
      return (
        <div className={`${base} bg-red-50 text-red-700 border border-red-300`}>
          <XCircleIcon className="w-5 h-5" />
          ติดต่อ Server ไม่ได้
        </div>
      );
  }
}
