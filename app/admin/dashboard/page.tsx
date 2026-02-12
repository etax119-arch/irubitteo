'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Building2, Users, UserCheck, AlertCircle, Bell, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdminStatCard } from '../_components/AdminStatCard';
import { CompanyAttendanceAccordion } from '../_components/CompanyAttendanceAccordion';
import { extractErrorMessage } from '@/lib/api/error';
import { formatDateAsKST } from '@/lib/kst';
import { adminKeys } from '@/lib/query/keys';
import { useAdminStats, useAdminDailyAttendance, useAbsenceAlerts } from '../_hooks/useAdminDashboardQuery';
import { useDismissAbsenceAlert } from '../_hooks/useAdminNotificationMutations';
import { useToast } from '@/components/ui/Toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(() => formatDateAsKST(new Date()));

  const statsQuery = useAdminStats();
  const attendanceQuery = useAdminDailyAttendance(selectedDate);
  const alertsQuery = useAbsenceAlerts();
  const dismissMutation = useDismissAbsenceAlert();

  const handleDismissAlert = (alertId: string, employeeId: string) => {
    dismissMutation.mutate(alertId, {
      onSuccess: () => {
        toast.success('알림을 확인했습니다.');
        router.push(`/admin/employees/${employeeId}`);
      },
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: adminKeys.all });
  };

  if (statsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Skeleton className="w-24 h-9 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl p-6 border border-gray-200 bg-white">
              <Skeleton className="w-12 h-12 rounded-lg mb-4" />
              <Skeleton className="w-20 h-4 mb-2" />
              <Skeleton className="w-16 h-8" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <Skeleton className="w-48 h-6 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (statsQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600">대시보드 데이터를 불러오지 못했습니다.</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg hover:bg-duru-orange-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const stats = statsQuery.data;
  const dailyAttendance = attendanceQuery.data ?? [];
  const urgentAlerts = alertsQuery.data ?? [];

  return (
    <div className="space-y-6">
      {/* 리프레시 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-duru-orange-600 hover:bg-duru-orange-50 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${statsQuery.isFetching ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard
            icon={Building2}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            label="전체 회원사"
            value={stats.totalCompanies}
            unit="개"
          />
          <AdminStatCard
            icon={Users}
            iconBgColor="bg-duru-orange-100"
            iconColor="text-duru-orange-600"
            label="전체 근로자"
            value={stats.totalWorkers}
            unit="명"
            cardBorderColor="border-duru-orange-200"
            cardBgColor="bg-duru-orange-50"
            valueColor="text-duru-orange-600"
          />
          <AdminStatCard
            icon={UserCheck}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            label="근무 중"
            value={stats.activeWorkers}
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
            value={urgentAlerts.length}
            unit="건"
            cardBorderColor="border-red-200"
            cardBgColor="bg-red-50"
            valueColor="text-red-600"
          />
        </div>
      )}

      {/* 긴급 알림 (결근) */}
      {urgentAlerts.length > 0 && (
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
            {urgentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{alert.name} - {alert.status}</span>
                    <span className="text-xs text-gray-500">{alert.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.companyName}</p>
                </div>
                <button
                  onClick={() => handleDismissAlert(alert.id, alert.employeeId)}
                  className="text-duru-orange-600 hover:text-duru-orange-700 font-semibold text-sm whitespace-nowrap"
                >
                  확인하기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 회사별 출퇴근 현황 */}
      <CompanyAttendanceAccordion
        dailyAttendance={dailyAttendance}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isFetching={attendanceQuery.isFetching}
      />
    </div>
  );
}
