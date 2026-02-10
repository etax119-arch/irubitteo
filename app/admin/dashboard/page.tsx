'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Users, UserCheck, AlertCircle, Bell, Loader2 } from 'lucide-react';
import { AdminStatCard } from '../_components/AdminStatCard';
import { CompanyAttendanceAccordion } from '../_components/CompanyAttendanceAccordion';
import { getAdminStats, getAdminDailyAttendance, getAbsenceAlerts, dismissAbsenceAlert } from '@/lib/api/admin';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { AdminStats, AdminDailyCompany, AbsenceAlert } from '@/types/adminDashboard';

export default function AdminDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dailyAttendance, setDailyAttendance] = useState<AdminDailyCompany[]>([]);
  const [urgentAlerts, setUrgentAlerts] = useState<AbsenceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, attendanceRes, alertsRes] = await Promise.all([
        getAdminStats(),
        getAdminDailyAttendance(),
        getAbsenceAlerts(3, 1, 5),
      ]);
      setStats(statsRes);
      setDailyAttendance(attendanceRes);
      setUrgentAlerts(alertsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDismissAlert = async (alertId: string, employeeId: string) => {
    try {
      await dismissAbsenceAlert(alertId);
      setUrgentAlerts((prev) => prev.filter((a) => a.id !== alertId));
      toast.success('알림을 확인했습니다.');
      router.push(`/admin/employees/${employeeId}`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
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
          value={stats.pendingIssues}
          unit="건"
          cardBorderColor="border-red-200"
          cardBgColor="bg-red-50"
          valueColor="text-red-600"
        />
      </div>

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
        onDateChange={(date) => {
          getAdminDailyAttendance(date).then(setDailyAttendance);
        }}
      />
    </div>
  );
}
