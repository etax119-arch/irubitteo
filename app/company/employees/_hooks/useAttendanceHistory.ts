import { useState, useMemo } from 'react';
import { useEmployeeAttendanceHistory } from '@/hooks/useAttendanceQuery';
import { useUpdateAttendance } from '@/hooks/useAttendanceMutations';
import { useToast } from '@/components/ui/Toast';
import { formatUtcTimestampAsKST, buildKSTTimestamp } from '@/lib/kst';
import { getAttendanceDisplayStatus } from '@/lib/status';
import type { AttendanceWithEmployee, AttendanceUpdateInput, AttendanceStatus, DisplayStatus } from '@/types/attendance';
import type { Pagination } from '@/types/api';

export type { DisplayStatus };

export interface AttendanceRecord {
  id: string;
  date: string;
  checkin: string;
  checkout: string;
  status: DisplayStatus;
  rawStatus: AttendanceStatus;
  workDone: string;
  photoUrls: string[];
}

function toAttendanceRecord(att: AttendanceWithEmployee): AttendanceRecord {
  const date = att.date.split('T')[0];
  const displayStatus = getAttendanceDisplayStatus(att);
  const isAbsentOrLeave = att.status === 'absent' || att.status === 'leave';

  return {
    id: att.id,
    date,
    checkin: isAbsentOrLeave ? '-' : (att.clockIn ? formatUtcTimestampAsKST(att.clockIn) : '-'),
    checkout: isAbsentOrLeave ? '-' : (att.clockOut ? formatUtcTimestampAsKST(att.clockOut) : '-'),
    status: displayStatus,
    rawStatus: att.status,
    workDone: att.workContent || '-',
    photoUrls: att.photoUrls,
  };
}

export function useAttendanceHistory(employeeId: string) {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data, isLoading: isLoadingAttendance, error: queryError } = useEmployeeAttendanceHistory(employeeId, { page: currentPage, limit: 10, startDate: startDate || undefined, endDate: endDate || undefined });
  const updateAttendance = useUpdateAttendance(employeeId);

  const attendanceHistory = useMemo(() => (data?.records ?? []).map(toAttendanceRecord), [data?.records]);
  const pagination: Pagination | undefined = data?.pagination;
  const attendanceError = queryError ? '출퇴근 기록을 불러오는데 실패했습니다.' : null;

  const [showWorkDoneModal, setShowWorkDoneModal] = useState(false);
  const [selectedWorkDone, setSelectedWorkDone] = useState<{ date: string; workDone: string; photoUrls: string[] } | null>(null);

  const [isEditingWorkTime, setIsEditingWorkTime] = useState(false);
  const [editedWorkTime, setEditedWorkTime] = useState({
    date: '',
    checkin: '09:00',
    checkout: '18:00',
    workDone: '',
    status: 'checkin' as AttendanceStatus,
  });
  const [originalWorkTime, setOriginalWorkTime] = useState({
    checkin: '',
    checkout: '',
    workDone: '',
    status: 'checkin' as AttendanceStatus,
  });

  const openWorkDoneModal = (date: string, workDone: string, photoUrls: string[]) => {
    setSelectedWorkDone({ date, workDone, photoUrls });
    setShowWorkDoneModal(true);
  };

  const closeWorkDoneModal = () => {
    setShowWorkDoneModal(false);
    setSelectedWorkDone(null);
  };

  const handleEditWorkTime = (record: AttendanceRecord) => {
    const checkin = record.checkin === '-' ? '' : record.checkin;
    const checkout = record.checkout === '-' ? '' : record.checkout;
    const workDone = record.workDone === '-' ? '' : record.workDone;
    setEditedWorkTime({ date: record.date, checkin, checkout, workDone, status: record.rawStatus });
    setOriginalWorkTime({ checkin, checkout, workDone, status: record.rawStatus });
    setIsEditingWorkTime(true);
  };

  const handleSaveWorkTime = async () => {
    const record = attendanceHistory.find((r) => r.date === editedWorkTime.date);
    if (!record) {
      toast.error('해당 출퇴근 기록을 찾을 수 없습니다.');
      return;
    }

    const payload: AttendanceUpdateInput = {};
    if (editedWorkTime.checkin !== originalWorkTime.checkin && editedWorkTime.checkin) {
      payload.clockIn = buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkin);
    }
    if (editedWorkTime.checkout !== originalWorkTime.checkout && editedWorkTime.checkout) {
      payload.clockOut = buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkout);
    }
    if (editedWorkTime.workDone !== originalWorkTime.workDone) {
      payload.workContent = editedWorkTime.workDone;
    }
    if (editedWorkTime.status !== originalWorkTime.status) {
      payload.status = editedWorkTime.status;
    }

    if (Object.keys(payload).length === 0) {
      setIsEditingWorkTime(false);
      return;
    }

    try {
      await updateAttendance.mutateAsync({ attendanceId: record.id, input: payload });
      setIsEditingWorkTime(false);
      toast.success('출퇴근 기록이 수정되었습니다.');
    } catch {
      toast.error('출퇴근 기록 수정에 실패했습니다.');
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
    isSaving: updateAttendance.isPending,
    isEditingWorkTime,
    editedWorkTime,
    setEditedWorkTime,
    handleEditWorkTime,
    handleSaveWorkTime,
    setIsEditingWorkTime,
    showWorkDoneModal,
    selectedWorkDone,
    openWorkDoneModal,
    closeWorkDoneModal,
    // Pagination
    currentPage,
    pagination,
    goToNextPage,
    goToPrevPage,
    // Date filter
    startDate,
    endDate,
    handleStartDateChange: (value: string) => { setStartDate(value); setCurrentPage(1); },
    handleEndDateChange: (value: string) => { setEndDate(value); setCurrentPage(1); },
    handleClearDates: () => { setStartDate(''); setEndDate(''); setCurrentPage(1); },
  };
}
