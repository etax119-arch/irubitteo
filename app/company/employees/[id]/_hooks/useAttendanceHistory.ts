import { useState, useMemo } from 'react';
import { useEmployeeAttendanceHistory } from '@/hooks/useAttendanceQuery';
import { useUpdateAttendance } from '@/hooks/useAttendanceMutations';
import { attendanceApi } from '@/lib/api/attendance';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import { formatUtcTimestampAsKST } from '@/lib/kst';
import { hasNoClockTimes, resolveAnnualLeaveCancelStatus } from '@/lib/status';
import { exportAttendancesToExcel } from '@/lib/attendanceExcel';
import { exportAttendancesToPdf } from '@/lib/attendancePdf';
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
  const isAbsentOrLeave = hasNoClockTimes(att.status);

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

export function useAttendanceHistory(employeeId: string, workDays: number[] = []) {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
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

  // --- 연차 처리 모달 ---
  const updateMutation = useUpdateAttendance(employeeId);
  const [selectedLeaveRecord, setSelectedLeaveRecord] = useState<AttendanceRecord | null>(null);
  const [leaveReason, setLeaveReason] = useState('');

  const openLeaveModal = (record: AttendanceRecord) => {
    setSelectedLeaveRecord(record);
    setLeaveReason('');
  };
  const closeLeaveModal = () => setSelectedLeaveRecord(null);

  // 선택된 기록의 현재 상태로 토글 대상을 결정한다.
  // - 연차가 아니면 → 연차 처리(사유를 업무 내용으로 저장)
  // - 이미 연차면 → 취소(복원, 사유 클리어)
  const processLeave = () => {
    const record = selectedLeaveRecord;
    if (!record) return;

    const isAnnualLeave = record.status === 'annual_leave';
    let targetStatus: AttendanceStatus;
    let workContent: string;
    if (isAnnualLeave) {
      targetStatus = resolveAnnualLeaveCancelStatus(record.date, workDays);
      workContent = '';
    } else {
      targetStatus = 'annual_leave';
      workContent = leaveReason.trim();
    }

    updateMutation.mutate(
      { attendanceId: record.id, input: { status: targetStatus, workContent } },
      {
        onSuccess: () => {
          toast.success(isAnnualLeave ? '연차가 취소되었습니다.' : '연차 처리되었습니다.');
          closeLeaveModal();
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
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

  const handleExportPdf = async (employeeName?: string) => {
    setIsExportingPdf(true);
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
      await exportAttendancesToPdf({
        records,
        employeeName,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
    } catch {
      toast.error('PDF 내보내기에 실패했습니다.');
    } finally {
      setIsExportingPdf(false);
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
    // 연차 처리
    selectedLeaveRecord,
    leaveReason,
    setLeaveReason,
    openLeaveModal,
    closeLeaveModal,
    processLeave,
    isProcessingLeave: updateMutation.isPending,
    // Pagination
    currentPage,
    pagination,
    goToNextPage,
    goToPrevPage,
    // Excel export
    isExporting,
    handleExportExcel,
    // PDF export
    isExportingPdf,
    handleExportPdf,
    // Date filter
    startDate,
    endDate,
    handleStartDateChange: (value: string) => { setStartDate(value); setCurrentPage(1); },
    handleEndDateChange: (value: string) => { setEndDate(value); setCurrentPage(1); },
    handleClearDates: () => { setStartDate(''); setEndDate(''); setCurrentPage(1); },
  };
}
