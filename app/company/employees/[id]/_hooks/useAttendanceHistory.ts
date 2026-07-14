import { useState, useMemo } from 'react';
import { useEmployeeAttendanceHistory } from '@/hooks/useAttendanceQuery';
import { attendanceApi } from '@/lib/api/attendance';
import { useToast } from '@/components/ui/Toast';
import { formatUtcTimestampAsKST } from '@/lib/kst';
import { exportAttendancesToExcel } from '@/lib/attendanceExcel';
import type { AttendanceStatus, AttendanceWithEmployee } from '@/types/attendance';
import type { Pagination } from '@/types/api';

export interface AttendanceRecord {
  id: string;
  date: string;
  checkin: string;
  checkout: string;
  status: AttendanceStatus;
  workDone: string;
  photoUrls: string[];
}

function toAttendanceRecord(att: AttendanceWithEmployee): AttendanceRecord {
  const date = att.date.split('T')[0];
  const isAbsentOrLeave = att.status === 'absent' || att.status === 'leave';

  return {
    id: att.id,
    date,
    checkin: isAbsentOrLeave ? '-' : (att.clockIn ? formatUtcTimestampAsKST(att.clockIn) : '-'),
    checkout: isAbsentOrLeave ? '-' : (att.clockOut ? formatUtcTimestampAsKST(att.clockOut) : '-'),
    status: att.status,
    workDone: att.workContent || '-',
    photoUrls: att.photoUrls,
  };
}

export function useAttendanceHistory(employeeId: string) {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { data, isLoading: isLoadingAttendance, error: queryError } = useEmployeeAttendanceHistory(employeeId, { page: currentPage, limit: 10, startDate: startDate || undefined, endDate: endDate || undefined });

  const attendanceHistory = useMemo(() => (data?.records ?? []).map(toAttendanceRecord), [data?.records]);
  const pagination: Pagination | undefined = data?.pagination;
  const attendanceError = queryError ? '출퇴근 기록을 불러오는데 실패했습니다.' : null;

  const [showWorkDoneModal, setShowWorkDoneModal] = useState(false);
  const [selectedWorkDone, setSelectedWorkDone] = useState<{ date: string; workDone: string; photoUrls: string[] } | null>(null);

  const openWorkDoneModal = (date: string, workDone: string, photoUrls: string[]) => {
    setSelectedWorkDone({ date, workDone, photoUrls });
    setShowWorkDoneModal(true);
  };

  const closeWorkDoneModal = () => {
    setShowWorkDoneModal(false);
    setSelectedWorkDone(null);
  };

  const handleExportExcel = async (employeeName?: string) => {
    setIsExporting(true);
    try {
      const records = await attendanceApi.getAllAttendances({
        employeeId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      if (records.length === 0) {
        toast.error('내보낼 출퇴근 기록이 없습니다.');
        return;
      }
      exportAttendancesToExcel({
        records,
        employeeName,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
    } catch {
      toast.error('엑셀 내보내기에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const goToNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  return {
    attendanceHistory,
    isLoadingAttendance,
    attendanceError,
    showWorkDoneModal,
    selectedWorkDone,
    openWorkDoneModal,
    closeWorkDoneModal,
    // Pagination
    currentPage,
    pagination,
    goToNextPage,
    goToPrevPage,
    // Excel export
    isExporting,
    handleExportExcel,
    // Date filter
    startDate,
    endDate,
    handleStartDateChange: (value: string) => { setStartDate(value); setCurrentPage(1); },
    handleEndDateChange: (value: string) => { setEndDate(value); setCurrentPage(1); },
    handleClearDates: () => { setStartDate(''); setEndDate(''); setCurrentPage(1); },
  };
}
