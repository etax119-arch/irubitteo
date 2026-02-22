'use client';

import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import type { EmployeeWithCompany } from '@/types/employee';

interface WorkerTableProps {
  workers: EmployeeWithCompany[];
  onViewDetail: (worker: EmployeeWithCompany) => void;
  onDelete?: (worker: EmployeeWithCompany) => void;
}

export function WorkerTable({ workers, onViewDetail, onDelete }: WorkerTableProps) {
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
                          <Avatar
                            src={worker.profileImage ?? undefined}
                            name={worker.name}
                            size="md"
                            className={cn(
                              'text-sm font-bold',
                              isResigned && 'opacity-50 grayscale'
                            )}
                          />
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewDetail(worker)}
                            className="text-duru-orange-600 hover:text-duru-orange-700 font-semibold text-sm"
                          >
                            상세보기
                          </button>
                          {isResigned && onDelete && (
                            <button
                              onClick={() => onDelete(worker)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="영구 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
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
