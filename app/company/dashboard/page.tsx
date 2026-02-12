'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '../_components/StatCard';
import { AttendanceTable } from '../_components/AttendanceTable';
import { useCompanyDaily } from '../_hooks/useDashboardQuery';
import { attendanceKeys } from '@/lib/query/keys';
import { formatDateAsKST, offsetDateString } from '@/lib/kst';


export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(() => formatDateAsKST(new Date()));
  const queryClient = useQueryClient();

  const dailyQuery = useCompanyDaily(selectedDate);

  const stats = dailyQuery.data?.stats ?? { total: 0, checkedIn: 0, checkedOut: 0, attendanceRate: 0 };
  const records = dailyQuery.data?.records ?? [];
  const isRefreshing = dailyQuery.isFetching && !dailyQuery.isLoading;

  const changeDate = (offset: number) => {
    setSelectedDate((prev) => offsetDateString(prev, offset));
  };

  const goToPrevDay = () => changeDate(-1);
  const goToNextDay = () => changeDate(1);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: attendanceKeys.companyDaily(selectedDate) });
  };

  if (dailyQuery.isLoading) {
    return (
      <div className="space-y-6">
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
          <Skeleton className="w-32 h-6 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (dailyQuery.error) {
    return (
      <div className="text-center py-20" role="alert">
        <p className="text-red-500 mb-4">출퇴근 현황을 불러오는데 실패했습니다.</p>
        <Button
          variant="ghost"
          onClick={() => dailyQuery.refetch()}
          disabled={dailyQuery.isFetching}
        >
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          label="전체 근로자"
          value={`${stats.total}명`}
        />
        <StatCard
          icon={UserCheck}
          iconBgColor="bg-duru-orange-100"
          iconColor="text-duru-orange-600"
          label="출근"
          value={`${stats.checkedIn}명`}
          valueColor="text-duru-orange-600"
          cardBorderColor="border-duru-orange-200"
          cardBgColor="bg-duru-orange-50"
        />
        <StatCard
          icon={Clock}
          iconBgColor="bg-gray-100"
          iconColor="text-gray-600"
          label="퇴근"
          value={`${stats.checkedOut}명`}
        />
        <StatCard
          icon={TrendingUp}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          label="출근율"
          value={`${stats.attendanceRate}%`}
          valueColor="text-green-600"
          cardBorderColor="border-green-200"
          cardBgColor="bg-green-50"
        />
      </div>

      {/* 출퇴근 기록 */}
      <AttendanceTable
        selectedDate={selectedDate}
        dailyAttendance={records}
        onPrevDay={goToPrevDay}
        onNextDay={goToNextDay}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}
