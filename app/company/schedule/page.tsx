'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarGrid } from '../_components/CalendarGrid';
import { ScheduleModal } from '../_components/ScheduleModal';
import { useSchedule } from '@/hooks/useSchedule';
import { useToast } from '@/components/ui/Toast';
import type { Schedule } from '@/types/schedule';

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { schedules, fetchMonthly, createSchedule, updateSchedule, deleteSchedule } = useSchedule();
  const toast = useToast();

  // Fetch monthly on mount and month change
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    fetchMonthly(year, month);
  }, [currentMonth, fetchMonthly]);

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const existing = schedules.find(s => s.date.toString().startsWith(dateStr));
    setSelectedDate(date);
    setSelectedSchedule(existing || null);
    setShowModal(true);
  }, [schedules]);

  const handleSave = useCallback(async (content: string) => {
    if (!selectedDate) return;
    setIsSaving(true);
    try {
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule.id, { content });
      } else {
        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        await createSchedule({ date: dateStr, content });
      }
      toast.success(selectedSchedule ? '일정이 수정되었습니다.' : '일정이 등록되었습니다.');
      setShowModal(false);
      fetchMonthly(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    } catch {
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedDate, selectedSchedule, updateSchedule, createSchedule, fetchMonthly, currentMonth, toast]);

  const handleDelete = useCallback(async () => {
    if (!selectedSchedule) return;
    setIsSaving(true);
    try {
      await deleteSchedule(selectedSchedule.id);
      toast.success('일정이 삭제되었습니다.');
      setShowModal(false);
      fetchMonthly(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    } catch {
      toast.error('삭제에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedSchedule, deleteSchedule, fetchMonthly, currentMonth, toast]);

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
