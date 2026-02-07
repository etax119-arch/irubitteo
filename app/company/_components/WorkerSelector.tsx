import { Search, Users } from 'lucide-react';
import type { CompanyEmployee } from '@/types/companyDashboard';

interface WorkerSelectorProps {
  employees: CompanyEmployee[];
  selectedWorkers: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleWorker: (workerId: string) => void;
  onToggleAll: () => void;
}

export function WorkerSelector({
  employees,
  selectedWorkers,
  searchQuery,
  onSearchChange,
  onToggleWorker,
  onToggleAll,
}: WorkerSelectorProps) {
  const filteredWorkers = employees.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.phone.includes(searchQuery) ||
      (worker.disability ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-duru-orange-600" />
          발송 대상 근로자
        </h4>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAll}
            className="px-4 py-2 bg-duru-orange-50 text-duru-orange-600 rounded-lg font-semibold hover:bg-duru-orange-100 transition-colors border border-duru-orange-200 text-sm"
          >
            {selectedWorkers.length === employees.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="이름, 전화번호로 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent placeholder:text-gray-400"
        />
      </div>

      {/* 근로자 목록 */}
      <div className="border-2 border-gray-200 rounded-lg max-h-72 overflow-y-auto">
        {filteredWorkers.map((worker, index, array) => (
          <label
            key={worker.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
              selectedWorkers.includes(worker.id) ? 'bg-duru-orange-50' : 'hover:bg-gray-50'
            } ${index !== array.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedWorkers.includes(worker.id)}
              onChange={() => onToggleWorker(worker.id)}
              className="w-5 h-5 text-duru-orange-600 rounded focus:ring-duru-orange-500"
            />
            <div className="w-10 h-10 bg-duru-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-duru-orange-600">
                {worker.name[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{worker.name}</p>
              <p className="text-sm text-gray-600 truncate">
                {worker.disability ?? '-'} · {worker.phone}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  worker.status === 'checkin'
                    ? 'bg-green-100 text-green-700'
                    : worker.status === 'checkout'
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {worker.status === 'checkin'
                  ? '근무중'
                  : worker.status === 'checkout'
                  ? '퇴근'
                  : '결근'}
              </span>
            </div>
          </label>
        ))}
        {filteredWorkers.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400">
            검색 결과가 없습니다
          </div>
        )}
      </div>

      {/* 선택 요약 */}
      {selectedWorkers.length > 0 && (
        <div className="mt-4 bg-duru-orange-50 rounded-lg p-4 border border-duru-orange-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">선택된 근로자</p>
            <p className="text-lg font-bold text-duru-orange-600">
              {selectedWorkers.length}명
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
