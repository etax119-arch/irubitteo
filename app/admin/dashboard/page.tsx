'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Users, UserCheck, AlertCircle, Bell } from 'lucide-react';
import { AdminStatCard } from '../_components/AdminStatCard';
import { CompanyAttendanceAccordion } from '../_components/CompanyAttendanceAccordion';
import { adminStats, notifications, dailyAttendance as initialDailyAttendance } from '../_data/dummyData';
import type { DailyAttendanceData, DailyAttendanceWorker } from '@/types/adminDashboard';

export default function AdminDashboardPage() {
  const [dailyAttendance, setDailyAttendance] = useState<DailyAttendanceData>(initialDailyAttendance);

  const handleAttendanceUpdate = (
    companyName: string,
    workerId: number,
    field: keyof DailyAttendanceWorker,
    value: string,
    timeSlot: 'morning' | 'afternoon'
  ) => {
    setDailyAttendance((prev) => ({
      ...prev,
      [companyName]: {
        ...prev[companyName],
        [timeSlot]: prev[companyName][timeSlot].map((worker) =>
          worker.id === workerId ? { ...worker, [field]: value, needsAttention: false } : worker
        ),
      },
    }));
  };

  const highPriorityNotifications = notifications.filter((n) => n.priority === 'high');

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          icon={Building2}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          label="전체 회원사"
          value={adminStats.totalCompanies}
          unit="개"
          badge="+3 이번달"
          badgeColor="text-green-600"
        />
        <AdminStatCard
          icon={Users}
          iconBgColor="bg-duru-orange-100"
          iconColor="text-duru-orange-600"
          label="전체 근로자"
          value={adminStats.totalWorkers}
          unit="명"
          badge="+12 이번달"
          badgeColor="text-green-600"
          cardBorderColor="border-duru-orange-200"
          cardBgColor="bg-duru-orange-50"
          valueColor="text-duru-orange-600"
        />
        <AdminStatCard
          icon={UserCheck}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          label="근무 중"
          value={adminStats.activeWorkers}
          unit="명"
          cardBorderColor="border-green-200"
          cardBgColor="bg-green-50"
          valueColor="text-green-600"
        />
        <AdminStatCard
          icon={AlertCircle}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          label="긴급 알림"
          value={adminStats.pendingIssues}
          unit="건"
          cardBorderColor="border-red-200"
          cardBgColor="bg-red-50"
          valueColor="text-red-600"
        />
      </div>

      {/* 최근 알림 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-duru-orange-600" />
            긴급 알림
          </h2>
          <Link
            href="/admin/notifications"
            className="text-sm text-duru-orange-600 hover:text-duru-orange-700 font-semibold"
          >
            전체보기 →
          </Link>
        </div>
        <div className="space-y-3">
          {highPriorityNotifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{notif.title}</span>
                  <span className="text-xs text-gray-500">{notif.date}</span>
                </div>
                <p className="text-sm text-gray-600">{notif.message}</p>
              </div>
              <button className="text-duru-orange-600 hover:text-duru-orange-700 font-semibold text-sm whitespace-nowrap">
                처리하기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 회사별 출퇴근 현황 */}
      <CompanyAttendanceAccordion
        dailyAttendance={dailyAttendance}
        onAttendanceUpdate={handleAttendanceUpdate}
      />
    </div>
  );
}
