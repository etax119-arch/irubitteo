import type { Employee } from '@/types/employee';
import type { DisplayStatus, AttendanceWithEmployee } from '@/types/attendance';

// ──────────────────────────────────────────────
// System A: Employee 실시간 상태 (checkin, checkout, absent, leave, pending, dayoff)
// ──────────────────────────────────────────────

export function getEmployeeStatusLabel(status: Employee['status'], isActive: boolean) {
  if (!isActive) return '퇴사';
  switch (status) {
    case 'checkin':
      return '근무중';
    case 'checkout':
      return '퇴근';
    case 'absent':
      return '결근';
    case 'leave':
      return '휴가';
    case 'pending':
      return '출근 전';
    case 'dayoff':
      return '휴무';
    default:
      return status;
  }
}

export function getEmployeeStatusStyle(status: Employee['status'], isActive: boolean) {
  if (!isActive) return 'bg-gray-200 text-gray-600';
  switch (status) {
    case 'checkin':
      return 'bg-green-100 text-green-700';
    case 'checkout':
      return 'bg-blue-100 text-blue-700';
    case 'absent':
      return 'bg-red-100 text-red-700';
    case 'leave':
      return 'bg-teal-100 text-teal-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'dayoff':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}

// ──────────────────────────────────────────────
// System B: 출퇴근 기록 표시 상태 (정상, 지각, 결근, 휴가)
// ──────────────────────────────────────────────

export function getAttendanceDisplayStatus(record: AttendanceWithEmployee): DisplayStatus {
  if (record.status === 'absent') return '결근';
  if (record.status === 'leave') return '휴가';
  if (record.isLate) return '지각';
  return '정상';
}

export function getDisplayStatusColor(status: DisplayStatus) {
  switch (status) {
    case '정상': return 'bg-green-100 text-green-700';
    case '지각': return 'bg-yellow-100 text-yellow-700';
    case '휴가': return 'bg-blue-100 text-blue-700';
    case '결근': return 'bg-red-100 text-red-700';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
