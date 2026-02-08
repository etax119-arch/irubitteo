'use client';

import { useState } from 'react';
import type { ScheduleForm } from '@/types/companyDashboard';
import { CalendarGrid } from '../_components/CalendarGrid';
import { ScheduleModal } from '../_components/ScheduleModal';
import { schedules, initialEmployees } from '../_data/dummyData';

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({ workType: '' });

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getActiveWorkersCount = (year: number, month: number, day: number) => {
    const targetDate = new Date(year, month, day);
    return initialEmployees.filter((emp) => {
      if (!emp.isActive) return false;
      const hireDate = new Date(emp.hireDate);
      return hireDate <= targetDate;
    }).length;
  };

  const handleScheduleSave = () => {
    console.log('일정 저장:', { date: selectedCalendarDate, ...scheduleForm });
    setShowScheduleModal(false);
    setScheduleForm({ workType: '' });
  };

  return (
    <div className="space-y-6">
      <CalendarGrid
        currentMonth={currentMonth}
        schedules={schedules}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onDateClick={(date) => {
          setSelectedCalendarDate(date);
          setShowScheduleModal(true);
        }}
        getActiveWorkersCount={getActiveWorkersCount}
      />

      <ScheduleModal
        isOpen={showScheduleModal}
        selectedDate={selectedCalendarDate}
        form={scheduleForm}
        onClose={() => {
          setShowScheduleModal(false);
          setScheduleForm({ workType: '' });
        }}
        onFormChange={setScheduleForm}
        onSave={handleScheduleSave}
      />
    </div>
  );
}
