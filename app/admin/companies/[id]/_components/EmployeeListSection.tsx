'use client';

import { Users } from 'lucide-react';
import type { Employee } from '@/types/employee';

interface EmployeeListSectionProps {
  employees: Employee[];
  onViewEmployee: (id: string) => void;
}

export function EmployeeListSection({ employees, onViewEmployee }: EmployeeListSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-duru-orange-600" />
        소속 근로자 ({employees.length}명)
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">입사일</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">장애유형</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">고유번호</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.length > 0 ? (
              employees.map((worker) => (
                <tr
                  key={worker.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewEmployee(worker.id)}
                >
                  <td className="px-4 py-3 text-gray-900 font-medium">{worker.name}</td>
                  <td className="px-4 py-3 text-gray-600">{worker.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{worker.hireDate}</td>
                  <td className="px-4 py-3 text-gray-600">{worker.disability || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 font-mono">
                      {worker.uniqueCode}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  소속 근로자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
