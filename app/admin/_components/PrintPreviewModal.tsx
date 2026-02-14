'use client';

import { useState } from 'react';
import { X, Printer, FileDown, User, Phone, Mail, Copy, Check, Loader2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import type { WorkStatEmployee } from '@/types/adminDashboard';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  workers: WorkStatEmployee[];
  pmContactName: string | null;
  pmContactPhone: string | null;
  pmContactEmail: string | null;
  selectedMonth: string;
}

const ALL_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function copyWorkers(workers: WorkStatEmployee[]): WorkStatEmployee[] {
  return workers.map(w => ({ ...w, scheduledWorkDays: [...w.scheduledWorkDays] }));
}

interface PrintPreviewContentProps {
  onClose: () => void;
  companyName: string;
  workers: WorkStatEmployee[];
  pmContactName: string | null;
  pmContactPhone: string | null;
  pmContactEmail: string | null;
  selectedMonth: string;
}

function PrintPreviewContent({
  onClose,
  companyName,
  workers,
  pmContactName,
  pmContactPhone,
  pmContactEmail,
  selectedMonth,
}: PrintPreviewContentProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [localWorkers, setLocalWorkers] = useState<WorkStatEmployee[]>(() => copyWorkers(workers));
  const [editingCell, setEditingCell] = useState<{ workerId: string; field: 'workDays' | 'totalHours' } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const toast = useToast();

  const avgWorkDays = localWorkers.length > 0
    ? (localWorkers.reduce((sum, w) => sum + w.workDays, 0) / localWorkers.length).toFixed(1)
    : '0';
  const avgWorkHours = localWorkers.length > 0
    ? (localWorkers.reduce((sum, w) => sum + w.totalHours, 0) / localWorkers.length).toFixed(1)
    : '0';

  const toggleWorkDay = (workerId: string, day: string) => {
    setLocalWorkers(prev => prev.map(w => {
      if (w.id !== workerId) return w;
      const days = w.scheduledWorkDays.includes(day)
        ? w.scheduledWorkDays.filter(d => d !== day)
        : [...w.scheduledWorkDays, day].sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b));
      return { ...w, scheduledWorkDays: days };
    }));
  };

  const updateNumericField = (workerId: string, field: 'workDays' | 'totalHours', value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalWorkers(prev => prev.map(w =>
      w.id === workerId ? { ...w, [field]: numValue } : w
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSavePdf = async () => {
    setIsGeneratingPdf(true);

    // 편집 중이면 종료하고 re-render 대기
    if (editingCell) {
      setEditingCell(null);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const element = document.getElementById('print-content');
    if (!element) {
      toast.error('PDF 생성에 실패했습니다.');
      setIsGeneratingPdf(false);
      return;
    }

    // print: 클래스 처리 - html2canvas는 screen 뷰를 캡처하므로 인라인 스타일로 토글
    const printHiddenEls = element.querySelectorAll<HTMLElement>('.print\\:hidden');
    const hiddenPrintInlineEls = element.querySelectorAll<HTMLElement>('.hidden.print\\:inline');

    const savedStyles: { el: HTMLElement; display: string }[] = [];

    printHiddenEls.forEach(el => {
      savedStyles.push({ el, display: el.style.display });
      el.style.display = 'none';
    });
    hiddenPrintInlineEls.forEach(el => {
      savedStyles.push({ el, display: el.style.display });
      el.style.display = 'inline';
    });

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const filename = `${companyName}_근무통계_${selectedMonth}.pdf`;

      await html2pdf()
        .set({
          margin: 10,
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();
    } catch {
      toast.error('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      // 원래 스타일 복원
      savedStyles.forEach(({ el, display }) => {
        el.style.display = display;
      });
      setIsGeneratingPdf(false);
    }
  };

  const hasPmInfo = pmContactName || pmContactPhone || pmContactEmail;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 print:hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">인쇄 프리뷰</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSavePdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    PDF 생성 중...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    PDF로 저장
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                인쇄
              </button>
              <IconButton onClick={onClose} variant="ghost" size="sm" icon={<X className="w-full h-full" />} label="닫기" />
            </div>
          </div>
          {hasPmInfo && (
            <div className="flex items-center gap-4 text-sm bg-duru-orange-50 rounded-lg px-4 py-2">
              <span className="font-semibold text-duru-orange-600">담당자</span>
              {pmContactName && (
                <div className="flex items-center gap-1 text-gray-700">
                  <User className="w-4 h-4 text-gray-500" />
                  {pmContactName}
                </div>
              )}
              {pmContactPhone && (
                <div className="flex items-center gap-1 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {pmContactPhone}
                </div>
              )}
              {pmContactEmail && (
                <div className="flex items-center gap-1 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{pmContactEmail}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pmContactEmail);
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
              )}
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
                        <Input
                          type="number"
                          min="0"
                          size="sm"
                          className="w-16 text-center"
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
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          size="sm"
                          className="w-16 text-center"
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
  pmContactName,
  pmContactPhone,
  pmContactEmail,
  selectedMonth,
}: PrintPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <PrintPreviewContent
      onClose={onClose}
      companyName={companyName}
      workers={workers}
      pmContactName={pmContactName}
      pmContactPhone={pmContactPhone}
      pmContactEmail={pmContactEmail}
      selectedMonth={selectedMonth}
    />
  );
}
