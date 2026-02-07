import { Clock, Edit3 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getStatusColor, type AttendanceRecord } from '../../_hooks/useAttendanceHistory';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEditWorkTime: (record: AttendanceRecord) => void;
  onOpenWorkDone: (date: string, workDone: string) => void;
}

export function AttendanceTable({ records, onEditWorkTime, onOpenWorkDone }: AttendanceTableProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-duru-orange-600" />
        최근 출퇴근 기록
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">날짜</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">출근</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">퇴근</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">업무 내용</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">수정</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.slice(0, 7).map((record, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{record.date}</td>
                <td
                  className={cn(
                    'px-4 py-3',
                    record.checkin === '결근' ? 'text-red-600 font-semibold' : 'text-gray-900'
                  )}
                >
                  {record.checkin}
                </td>
                <td className="px-4 py-3 text-gray-900">{record.checkout}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      getStatusColor(record.status)
                    )}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {record.workDone !== '-' ? (
                    <button
                      onClick={() => onOpenWorkDone(record.date, record.workDone)}
                      className="text-sm text-duru-orange-600 underline hover:text-duru-orange-700"
                    >
                      확인하기
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onEditWorkTime(record)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="수정"
                  >
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
