import { Search } from 'lucide-react';
import type { CompanyEmployee } from '@/types/companyDashboard';

interface EmployeeTableProps {
  employees: CompanyEmployee[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddWorker: () => void;
  onEmployeeClick: (employee: CompanyEmployee) => void;
}

export function EmployeeTable({
  employees,
  searchQuery,
  onSearchChange,
  onAddWorker,
  onEmployeeClick,
}: EmployeeTableProps) {
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">근로자 관리</h2>
        <button
          onClick={onAddWorker}
          className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors"
        >
          + 근로자 추가
        </button>
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">계약만료</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-duru-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-duru-orange-600">
                          {emp.name[0]}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{emp.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.disability}</td>
                  <td className="px-6 py-4 text-gray-900">{emp.contractEnd}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.status === 'absent' || emp.status === 'resigned'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {emp.status === 'absent' ? '결근' : emp.status === 'resigned' ? '퇴사' : '근무중'}
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
