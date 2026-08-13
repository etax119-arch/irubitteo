'use client';

import { useState, useCallback, useMemo } from 'react';
import { CalendarGrid } from '../_components/CalendarGrid';
import { ScheduleModal } from '../_components/ScheduleModal';
import { useMonthlySchedules } from '../_hooks/useScheduleQuery';
import { useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '../_hooks/useScheduleMutations';
import { formatDateAsKST } from '@/lib/kst';
import { exportToExcel } from '@/lib/excel';
import { buildScheduleRows, exportSchedulesToPdf } from '../_utils/generateSchedulePdf';
import { useToast } from '@/components/ui/Toast';
import type { PublicHoliday, Schedule } from '@/types/schedule';

/** monthly가 아직 없을 때의 안정적인 폴백 (참조가 매 렌더 바뀌지 않아야 한다) */
const EMPTY_MONTH: { schedules: Schedule[]; holidays: PublicHoliday[] } = {
  schedules: [],
  holidays: [],
};

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;
  const { data: monthly } = useMonthlySchedules(year, month);
  // 모듈 상수로 폴백해 매 렌더마다 새 배열이 생기지 않게 한다 (아래 useCallback 의존성)
  const { schedules, holidays } = monthly ?? EMPTY_MONTH;
  // 엑셀·PDF가 같은 표를 쓴다
  const exportRows = useMemo(
    () => buildScheduleRows(schedules, holidays),
    [schedules, holidays],
  );

  const createMutation = useCreateSchedule(year, month);
  const updateMutation = useUpdateSchedule(year, month);
  const deleteMutation = useDeleteSchedule(year, month);
  const isSaving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    const dateStr = formatDateAsKST(date);
    const existing = schedules.find(s => s.date.slice(0, 10) === dateStr);
    setSelectedDate(date);
    setSelectedSchedule(existing || null);
    setShowModal(true);
  }, [schedules]);

  const handleSave = useCallback(async (content: string, isHoliday: boolean) => {
    if (!selectedDate) return;
    if (selectedSchedule) {
      updateMutation.mutate(
        { id: selectedSchedule.id, input: { content, isHoliday } },
        {
          onSuccess: () => {
            toast.success('일정이 수정되었습니다.');
            setShowModal(false);
          },
          onError: () => toast.error('저장에 실패했습니다.'),
        },
      );
    } else {
      const dateStr = formatDateAsKST(selectedDate);
      createMutation.mutate(
        { date: dateStr, content, isHoliday },
        {
          onSuccess: () => {
            toast.success('일정이 등록되었습니다.');
            setShowModal(false);
          },
          onError: () => toast.error('저장에 실패했습니다.'),
        },
      );
    }
  }, [selectedDate, selectedSchedule, updateMutation, createMutation, toast]);

  const handleExportExcel = useCallback(() => {
    if (exportRows.length === 0) {
      toast.error('내보낼 일정이 없습니다.');
      return;
    }
    exportToExcel({
      fileName: `근무일정_${year}-${String(month).padStart(2, '0')}.xlsx`,
      sheetName: '근무일정',
      columns: [
        { key: 'date', header: '날짜', width: 14 },
        { key: 'type', header: '구분', width: 12 },
        { key: 'content', header: '내용', width: 50 },
      ],
      rows: exportRows,
    });
  }, [exportRows, year, month, toast]);

  const handleExportPdf = useCallback(async () => {
    if (exportRows.length === 0) {
      toast.error('내보낼 일정이 없습니다.');
      return;
    }
    try {
      await exportSchedulesToPdf({ rows: exportRows, year, month });
    } catch {
      toast.error('PDF 내보내기에 실패했습니다.');
    }
  }, [exportRows, year, month, toast]);

  const handleDelete = useCallback(async () => {
    if (!selectedSchedule) return;
    deleteMutation.mutate(selectedSchedule.id, {
      onSuccess: () => {
        toast.success('일정이 삭제되었습니다.');
        setShowModal(false);
      },
      onError: () => toast.error('삭제에 실패했습니다.'),
    });
  }, [selectedSchedule, deleteMutation, toast]);

  return (
    <div className="space-y-6">
      <CalendarGrid
        currentMonth={currentMonth}
        schedules={schedules}
        holidays={holidays}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onDateClick={handleDateClick}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
      />

      <ScheduleModal
        isOpen={showModal}
        selectedDate={selectedDate}
        existingSchedule={selectedSchedule}
        isSaving={isSaving}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
