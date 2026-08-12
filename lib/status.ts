import { formatDateAsKST } from '@/lib/kst';
import type { Employee } from '@/types/employee';
import type { AttendanceStatus } from '@/types/attendance';

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
      return '휴무';
    case 'annual_leave':
      return '연차';
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
    case 'annual_leave':
      return 'bg-purple-100 text-purple-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'dayoff':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}

// ──────────────────────────────────────────────
// System C: 최근 출퇴근 기록 상태 (출근, 퇴근, 결근, 휴무)
// ──────────────────────────────────────────────

/** 출퇴근 시각이 존재할 수 없는 상태 (표·엑셀·PDF에서 시간 대신 '-' 표시) */
const STATUSES_WITHOUT_CLOCK: AttendanceStatus[] = [
  'pending',
  'absent',
  'leave',
  'annual_leave',
];

export function hasNoClockTimes(status: AttendanceStatus) {
  return STATUSES_WITHOUT_CLOCK.includes(status);
}

/**
 * 연차를 취소했을 때 되돌릴 상태.
 * - 비근무일 → 휴무
 * - 근무일 중 오늘 → 출근 전 (아직 출근할 수 있다. 결근 크론이 필요하면 결근으로 바꾼다)
 * - 근무일 중 지난 날 → 결근
 */
export function resolveAnnualLeaveCancelStatus(
  dateOnly: string,
  workDays: number[],
): AttendanceStatus {
  const [y, m, d] = dateOnly.split('-').map(Number);
  const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const dayOfWeek = jsDay === 0 ? 7 : jsDay;

  if (!workDays.includes(dayOfWeek)) return 'leave';
  return dateOnly === formatDateAsKST(new Date()) ? 'pending' : 'absent';
}

export function getAttendanceRecordStatusLabel(status: AttendanceStatus) {
  switch (status) {
    case 'pending':
      return '출근 전';
    case 'checkin':
      return '출근';
    case 'checkout':
      return '퇴근';
    case 'absent':
      return '결근';
    case 'leave':
      return '휴무';
    case 'annual_leave':
      return '연차';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function getAttendanceRecordStatusColor(status: AttendanceStatus) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'checkin':
      return 'bg-green-100 text-green-700';
    case 'checkout':
      return 'bg-blue-100 text-blue-700';
    case 'absent':
      return 'bg-red-100 text-red-700';
    case 'leave':
      return 'bg-teal-100 text-teal-700';
    case 'annual_leave':
      return 'bg-purple-100 text-purple-700';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
