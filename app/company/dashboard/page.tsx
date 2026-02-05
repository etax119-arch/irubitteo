'use client';

import { useState } from 'react';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '../_components/StatCard';
import { AttendanceTable } from '../_components/AttendanceTable';
import { getDailyAttendance } from '../_data/dummyData';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 28));

  const todayStats = {
    total: 15,
    checkin: 12,
    checkout: 3,
    attendanceRate: 100,
  };

  const dailyAttendance = getDailyAttendance(selectedDate);

  const goToPrevDay = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          label="전체 근로자"
          value={`${todayStats.total}명`}
        />
        <StatCard
          icon={UserCheck}
          iconBgColor="bg-duru-orange-100"
          iconColor="text-duru-orange-600"
          label="출근"
          value={`${todayStats.checkin}명`}
          valueColor="text-duru-orange-600"
          cardBorderColor="border-duru-orange-200"
          cardBgColor="bg-duru-orange-50"
        />
        <StatCard
          icon={Clock}
          iconBgColor="bg-gray-100"
          iconColor="text-gray-600"
          label="퇴근"
          value={`${todayStats.checkout}명`}
        />
        <StatCard
          icon={TrendingUp}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          label="출근율"
          value={`${todayStats.attendanceRate}%`}
          valueColor="text-green-600"
          cardBorderColor="border-green-200"
          cardBgColor="bg-green-50"
        />
      </div>

      {/* 출퇴근 기록 */}
      <AttendanceTable
        selectedDate={selectedDate}
        dailyAttendance={dailyAttendance}
        onPrevDay={goToPrevDay}
        onNextDay={goToNextDay}
      />
    </div>
  );
}
