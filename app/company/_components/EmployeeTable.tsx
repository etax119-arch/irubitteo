import { Search, RefreshCw } from 'lucide-react';
import type { Employee } from '@/types/employee';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { getEmployeeStatusLabel, getEmployeeStatusStyle } from '@/lib/status';
import { filterEmployees } from '../_utils/filterEmployees';

interface EmployeeTableProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddWorker: () => void;
  onEmployeeClick: (employee: Employee) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function EmployeeTable({
  employees,
  searchQuery,
  onSearchChange,
  onAddWorker,
  onEmployeeClick,
  onRefresh,
  isRefreshing,
}: EmployeeTableProps) {
  const filteredEmployees = filterEmployees(employees, searchQuery);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">근로자 관리</h2>
          {onRefresh && (
            <IconButton
              icon={<RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              variant="ghost"
              size="sm"
              label="새로고침"
              onClick={onRefresh}
            />
          )}
        </div>
        <Button variant="primary" onClick={onAddWorker} className="py-2">
          + 근로자 추가
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Input
            type="text"
            size="sm"
            placeholder="이름, 전화번호로 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="근로자 검색"
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">장애유형</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? '검색 결과가 없습니다.' : '등록된 근로자가 없습니다.'}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={emp.profileImage ?? undefined} name={emp.name} size="md" className="text-sm font-bold" />
                        <span className="font-semibold text-gray-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{emp.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.disabilityType ?? '-'}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`px-3 py-1 font-semibold ${getEmployeeStatusStyle(emp.status, emp.isActive)}`}
                      >
                        {getEmployeeStatusLabel(emp.status, emp.isActive)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onEmployeeClick(emp)}
                        className="text-duru-orange-600 hover:text-duru-orange-700 font-semibold text-sm"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
