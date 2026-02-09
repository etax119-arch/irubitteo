'use client';

import { cn } from '@/lib/cn';
import type { Worker, WorkerFilter } from '@/types/adminDashboard';

interface WorkerTableProps {
  workers: Worker[];
  filter: WorkerFilter;
  onFilterChange: (filter: WorkerFilter) => void;
  onViewDetail: (worker: Worker) => void;
}

export function WorkerTable({ workers, filter, onViewDetail }: WorkerTableProps) {
  const filteredWorkers = workers.filter((worker) => {
    if (filter === 'current') return !worker.isResigned;
    if (filter === 'resigned') return worker.isResigned;
    if (filter === 'waiting') return worker.isWaiting;
    return true;
  });

  return (
    <div>
      {/* 테이블 */}
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
              {filteredWorkers.map((worker) => (
                <tr
                  key={worker.id}
                  className={cn('hover:bg-gray-50', worker.isResigned && 'bg-gray-50')}
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          worker.isResigned ? 'bg-gray-200' : 'bg-duru-orange-100'
                        )}
                      >
                        <span
                          className={cn(
                            'text-sm font-bold',
                            worker.isResigned ? 'text-gray-500' : 'text-duru-orange-600'
                          )}
                        >
                          {worker.name[0]}
                        </span>
                      </div>
                      <span
                        className={cn(
                          'font-semibold',
                          worker.isResigned ? 'text-gray-500' : 'text-gray-900'
                        )}
                      >
                        {worker.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn('px-8 py-4', worker.isResigned ? 'text-gray-500' : 'text-gray-900')}
                  >
                    {worker.company}
                  </td>
                  <td
                    className={cn('px-8 py-4', worker.isResigned ? 'text-gray-500' : 'text-gray-900')}
                  >
                    {worker.phone}
                  </td>
                  <td
                    className={cn('px-8 py-4', worker.isResigned ? 'text-gray-500' : 'text-gray-600')}
                  >
                    {worker.disabilityType}
                  </td>
                  <td
                    className={cn(
                      'px-8 py-4 font-mono',
                      worker.isResigned ? 'text-gray-500' : 'text-gray-900'
                    )}
                  >
                    {worker.workerId}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
