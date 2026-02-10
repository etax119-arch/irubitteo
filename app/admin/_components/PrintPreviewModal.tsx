'use client';

import { useState } from 'react';
import { X, Printer, FileDown, User, Phone, Mail, Copy, Check } from 'lucide-react';
import type { WorkStatWorker, PMInfo } from '@/types/adminDashboard';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  workers: WorkStatWorker[];
  pm: PMInfo | null;
  selectedMonth: string;
}

const ALL_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function copyWorkers(workers: WorkStatWorker[]): WorkStatWorker[] {
  return workers.map(w => ({ ...w, scheduledWorkDays: [...w.scheduledWorkDays] }));
}

interface PrintPreviewContentProps {
  onClose: () => void;
  companyName: string;
  workers: WorkStatWorker[];
  pm: PMInfo | null;
  selectedMonth: string;
}

function PrintPreviewContent({
  onClose,
  companyName,
  workers,
  pm,
  selectedMonth,
}: PrintPreviewContentProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  // workers를 초기값으로 복사하여 로컬 상태로 관리
  const [localWorkers, setLocalWorkers] = useState<WorkStatWorker[]>(() => copyWorkers(workers));
  const [editingCell, setEditingCell] = useState<{ workerId: number; field: 'workDays' | 'totalHours' } | null>(null);

  const avgWorkDays = localWorkers.length > 0
    ? (localWorkers.reduce((sum, w) => sum + w.workDays, 0) / localWorkers.length).toFixed(1)
    : '0';
  const avgWorkHours = localWorkers.length > 0
    ? (localWorkers.reduce((sum, w) => sum + w.totalHours, 0) / localWorkers.length).toFixed(1)
    : '0';

  const toggleWorkDay = (workerId: number, day: string) => {
    setLocalWorkers(prev => prev.map(w => {
      if (w.id !== workerId) return w;
      const days = w.scheduledWorkDays.includes(day)
        ? w.scheduledWorkDays.filter(d => d !== day)
        : [...w.scheduledWorkDays, day].sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b));
      return { ...w, scheduledWorkDays: days };
    }));
  };

  const updateNumericField = (workerId: number, field: 'workDays' | 'totalHours', value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalWorkers(prev => prev.map(w =>
      w.id === workerId ? { ...w, [field]: numValue } : w
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">인쇄 프리뷰</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                PDF로 저장
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                인쇄
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          {pm && (
            <div className="flex items-center gap-4 text-sm bg-duru-orange-50 rounded-lg px-4 py-2">
              <span className="font-semibold text-duru-orange-600">담당자</span>
              <div className="flex items-center gap-1 text-gray-700">
                <User className="w-4 h-4 text-gray-500" />
                {pm.name}
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Phone className="w-4 h-4 text-gray-500" />
                {pm.phone}
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{pm.email}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pm.email);
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 2000);
                  }}
                  className="ml-1 p-1 hover:bg-duru-orange-100 rounded transition-colors"
                  title="이메일 복사"
                >
                  {copiedEmail ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-8" id="print-content">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center mb-2">{companyName} 월 근무 통계</h2>
            <p className="text-center text-gray-600">
              {selectedMonth.split('-')[0]}년 {selectedMonth.split('-')[1]}월
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-duru-orange-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-300">
                    이름
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-300">
                    근무요일
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 border border-gray-300">
                    출근 일수
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 border border-gray-300">
                    총 근무시간
                  </th>
                </tr>
              </thead>
              <tbody>
                {localWorkers.map((worker, index) => (
                  <tr key={worker.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-gray-900 border border-gray-300">
                      {worker.name}
                    </td>
                    <td className="px-4 py-2 text-gray-700 border border-gray-300 print:py-3">
                      <div className="flex flex-wrap gap-1 print:hidden">
                        {ALL_DAYS.map(day => (
                          <button
                            key={day}
                            onClick={() => toggleWorkDay(worker.id, day)}
                            className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                              worker.scheduledWorkDays.includes(day)
                                ? 'bg-duru-orange-500 text-white'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <span className="hidden print:inline">
                        {worker.scheduledWorkDays.join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-900 border border-gray-300">
                      {editingCell?.workerId === worker.id && editingCell?.field === 'workDays' ? (
                        <input
                          type="number"
                          min="0"
                          className="w-16 px-2 py-1 text-center border border-duru-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                          value={worker.workDays}
                          onChange={e => updateNumericField(worker.id, 'workDays', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => setEditingCell({ workerId: worker.id, field: 'workDays' })}
                          className="cursor-pointer hover:bg-duru-orange-50 px-2 py-1 rounded print:cursor-default print:hover:bg-transparent"
                        >
                          {worker.workDays}일
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600 border border-gray-300">
                      {editingCell?.workerId === worker.id && editingCell?.field === 'totalHours' ? (
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          className="w-16 px-2 py-1 text-center border border-duru-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                          value={worker.totalHours}
                          onChange={e => updateNumericField(worker.id, 'totalHours', e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={e => e.key === 'Enter' && setEditingCell(null)}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => setEditingCell({ workerId: worker.id, field: 'totalHours' })}
                          className="cursor-pointer hover:bg-duru-orange-50 px-2 py-1 rounded print:cursor-default print:hover:bg-transparent"
                        >
                          {worker.totalHours}h
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-duru-orange-100 border-t-2 border-duru-orange-500">
                <tr>
                  <td colSpan={2} className="px-4 py-3 font-bold text-gray-900 border border-gray-300">
                    평균
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900 border border-gray-300">
                    {avgWorkDays}일
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600 border border-gray-300">
                    {avgWorkHours}h
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">기업 (대표자)</p>
                <div className="border-2 border-gray-300 rounded-lg p-6 h-24 flex items-center justify-center">
                  <p className="text-gray-400">(서명/인)</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">이루빛터 (담당자)</p>
                <div className="border-2 border-gray-300 rounded-lg p-6 h-24 flex items-center justify-center">
                  <p className="text-gray-400">(서명/인)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end text-sm text-gray-600 mt-4">
              <div>이루빛터 중앙 통제 시스템</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrintPreviewModal({
  isOpen,
  onClose,
  companyName,
  workers,
  pm,
  selectedMonth,
}: PrintPreviewModalProps) {
  // isOpen이 true일 때만 내부 컴포넌트를 렌더링하여 상태를 매번 초기화
  if (!isOpen) return null;

  return (
    <PrintPreviewContent
      onClose={onClose}
      companyName={companyName}
      workers={workers}
      pm={pm}
      selectedMonth={selectedMonth}
    />
  );
}
