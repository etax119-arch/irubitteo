import { Search } from 'lucide-react';
import type { Employee } from '@/types/employee';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getEmployeeStatusLabel, getEmployeeStatusStyle } from '../_utils/employeeStatus';
import { filterEmployees } from '../_utils/filterEmployees';

interface EmployeeTableProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddWorker: () => void;
  onEmployeeClick: (employee: Employee) => void;
}

export function EmployeeTable({
  employees,
  searchQuery,
  onSearchChange,
  onAddWorker,
  onEmployeeClick,
}: EmployeeTableProps) {
  const filteredEmployees = filterEmployees(employees, searchQuery);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">근로자 관리</h2>
        <Button variant="primary" onClick={onAddWorker} className="py-2">
          + 근로자 추가
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 전화번호로 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="근로자 검색"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
            />
          </div>
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
                        <Avatar name={emp.name} size="md" className="text-sm font-bold" />
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
