'use client';

import { cn } from '@/lib/cn';
import type { EmployeeWithCompany } from '@/types/employee';

interface WorkerTableProps {
  workers: EmployeeWithCompany[];
  onViewDetail: (worker: EmployeeWithCompany) => void;
}

export function WorkerTable({ workers, onViewDetail }: WorkerTableProps) {
  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
                <th className="px-8 py-3 text-left text-sm font-semibold text-gray-900">회사</th>
                <th className="px-8 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
                <th className="px-8 py-3 text-left text-sm font-semibold text-gray-900">장애유형</th>
                <th className="px-8 py-3 text-left text-sm font-semibold text-gray-900">고유번호</th>
                <th className="px-8 py-3 text-left text-sm font-semibold text-gray-900">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workers.length > 0 ? (
                workers.map((worker) => {
                  const isResigned = !worker.isActive;
                  return (
                    <tr
                      key={worker.id}
                      className={cn('hover:bg-gray-50', isResigned && 'bg-gray-50')}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center',
                              isResigned ? 'bg-gray-200' : 'bg-duru-orange-100'
                            )}
                          >
                            <span
                              className={cn(
                                'text-sm font-bold',
                                isResigned ? 'text-gray-500' : 'text-duru-orange-600'
                              )}
                            >
                              {worker.name[0]}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'font-semibold',
                              isResigned ? 'text-gray-500' : 'text-gray-900'
                            )}
                          >
                            {worker.name}
                          </span>
                        </div>
                      </td>
                      <td
                        className={cn('px-8 py-4', isResigned ? 'text-gray-500' : 'text-gray-900')}
                      >
                        {worker.companyName ?? '-'}
                      </td>
                      <td
                        className={cn('px-8 py-4', isResigned ? 'text-gray-500' : 'text-gray-900')}
                      >
                        {worker.phone}
                      </td>
                      <td
                        className={cn('px-8 py-4', isResigned ? 'text-gray-500' : 'text-gray-600')}
                      >
                        {worker.disability ?? '-'}
                      </td>
                      <td
                        className={cn(
                          'px-8 py-4 font-mono',
                          isResigned ? 'text-gray-500' : 'text-gray-900'
                        )}
                      >
                        {worker.uniqueCode}
                      </td>
                      <td className="px-8 py-4">
                        <button
                          onClick={() => onViewDetail(worker)}
                          className="text-duru-orange-600 hover:text-duru-orange-700 font-semibold text-sm"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-gray-400">
                    조건에 맞는 근로자가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
