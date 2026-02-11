'use client';

import { useState, useCallback } from 'react';
import { CalendarGrid } from '../_components/CalendarGrid';
import { ScheduleModal } from '../_components/ScheduleModal';
import { useMonthlySchedules } from '@/hooks/useScheduleQuery';
import { useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from '@/hooks/useScheduleMutations';
import { formatDateAsKST } from '@/lib/kst';
import { useToast } from '@/components/ui/Toast';
import type { Schedule } from '@/types/schedule';

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;
  const { data: schedules = [] } = useMonthlySchedules(year, month);

  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();
  const deleteMutation = useDeleteSchedule();
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

  const handleSave = useCallback(async (content: string) => {
    if (!selectedDate) return;
    if (selectedSchedule) {
      updateMutation.mutate(
        { id: selectedSchedule.id, input: { content } },
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
        { date: dateStr, content },
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
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onDateClick={handleDateClick}
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
