'use client';

import { useState } from 'react';
import { Users, Clock, FileText } from 'lucide-react';
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
      const hireDate = new Date(emp.hireDate);
      const endDate = new Date(emp.contractEnd);
      return hireDate <= targetDate && targetDate <= endDate;
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

      {/* 일정 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">이번 달 작업</p>
              <p className="text-2xl font-bold text-gray-900">15개</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">평균 투입 인원</p>
              <p className="text-2xl font-bold text-gray-900">6명</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-duru-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-duru-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">평균 근무 시간</p>
              <p className="text-2xl font-bold text-gray-900">8시간</p>
            </div>
          </div>
        </div>
      </div>

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
