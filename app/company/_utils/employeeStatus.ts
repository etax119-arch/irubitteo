import type { Employee } from '@/types/employee';

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
    case 'holiday':
      return '휴일';
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
      return 'bg-blue-100 text-blue-700';
    case 'holiday':
      return 'bg-purple-100 text-purple-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'dayoff':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}
