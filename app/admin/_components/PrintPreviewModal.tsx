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

export function PrintPreviewModal({
  isOpen,
  onClose,
  companyName,
  workers,
  pm,
  selectedMonth,
}: PrintPreviewModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const avgWorkDays = (workers.reduce((sum, w) => sum + w.workDays, 0) / workers.length).toFixed(1);
  const avgWorkHours = (workers.reduce((sum, w) => sum + w.totalHours, 0) / workers.length).toFixed(1);

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
                    전화번호
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
                {workers.map((worker, index) => (
                  <tr key={worker.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-gray-900 border border-gray-300">
                      {worker.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 border border-gray-300">{worker.phone}</td>
                    <td className="px-4 py-3 text-center text-gray-900 border border-gray-300">
                      {worker.workDays}일
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600 border border-gray-300">
                      {worker.totalHours}h
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
                <p className="text-sm text-gray-600 mb-2">두루빛터 (담당자)</p>
                <div className="border-2 border-gray-300 rounded-lg p-6 h-24 flex items-center justify-center">
                  <p className="text-gray-400">(서명/인)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-4">
              <div>발급일: {new Date().toLocaleDateString('ko-KR')}</div>
              <div>두루빛터 중앙 통제 시스템</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
