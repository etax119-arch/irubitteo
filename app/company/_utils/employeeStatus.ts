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
    default:
      return 'bg-gray-200 text-gray-700';
  }
}
