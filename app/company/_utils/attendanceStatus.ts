import type { DisplayStatus } from '@/types/attendance';

export function getStatusColor(status: DisplayStatus) {
  switch (status) {
    case '정상': return 'bg-green-100 text-green-700';
    case '지각': return 'bg-yellow-100 text-yellow-700';
    case '휴가': return 'bg-blue-100 text-blue-700';
    case '휴일': return 'bg-purple-100 text-purple-700';
    case '결근': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
