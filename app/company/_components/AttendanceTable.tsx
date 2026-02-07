import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import type { DailyAttendanceRecord } from '@/types/companyDashboard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { BadgeVariant } from '@/components/ui/Badge';

interface AttendanceTableProps {
  selectedDate: Date;
  dailyAttendance: DailyAttendanceRecord[];
  onPrevDay: () => void;
  onNextDay: () => void;
}

function getStatusBadge(status: DailyAttendanceRecord['status']) {
  const variantMap: Record<DailyAttendanceRecord['status'], BadgeVariant> = {
    checkin: 'orange',
    checkout: 'default',
    absent: 'danger',
    pending: 'warning',
  };

  const labels = {
    checkin: '출근 완료',
    checkout: '퇴근 완료',
    absent: '결근',
    pending: '출근 전',
  };

  return (
    <Badge
      variant={variantMap[status]}
      className={`px-3 py-1 font-semibold${status === 'checkout' ? ' bg-gray-200' : ''}`}
    >
      {labels[status]}
    </Badge>
  );
}

export function AttendanceTable({
  selectedDate,
  dailyAttendance,
  onPrevDay,
  onNextDay,
}: AttendanceTableProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-duru-orange-600" />
            출퇴근 기록
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevDay}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-base font-semibold text-gray-900 min-w-[180px] text-center">
              {selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </span>
            <button
              onClick={onNextDay}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">출근</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">퇴근</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">업무 내용</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dailyAttendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={record.name} size="sm" className="text-xs font-bold" />
                    <span className="font-semibold text-gray-900">{record.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{record.phone}</td>
                <td className="px-6 py-4 text-gray-900">{record.checkinTime || '-'}</td>
                <td className="px-6 py-4 text-gray-900">{record.checkoutTime || '-'}</td>
                <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                  {record.workDone || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
