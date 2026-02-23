'use client';

import { useState } from 'react';
import { useEmployeeAttendanceHistory } from '@/hooks/useAttendanceQuery';
import { useUpdateAttendance, useDeleteAttendance } from '@/hooks/useAttendanceMutations';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import { formatUtcTimestampAsKST, formatDateAsKST, buildKSTTimestamp } from '@/lib/kst';
import type { AttendanceWithEmployee, AttendanceStatus } from '@/types/attendance';
import type { Pagination } from '@/types/api';

export function useAdminAttendanceHistory(employeeId: string) {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data } = useEmployeeAttendanceHistory(employeeId, { page: currentPage, limit: 10, startDate: startDate || undefined, endDate: endDate || undefined });
  const updateAttendance = useUpdateAttendance(employeeId);
  const deleteAttendance = useDeleteAttendance(employeeId);

  const attendanceHistory: AttendanceWithEmployee[] = data?.records ?? [];
  const pagination: Pagination | undefined = data?.pagination;

  // Work time edit modal
  const [isEditingWorkTime, setIsEditingWorkTime] = useState(false);
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null);
  const [editedWorkTime, setEditedWorkTime] = useState<{
    date: string;
    checkin: string;
    checkout: string;
    workDone: string;
    status: AttendanceStatus | '__reset__';
  }>({
    date: '',
    checkin: '09:00',
    checkout: '18:00',
    workDone: '',
    status: 'checkin',
  });

  // Work done modal
  const [showWorkDoneModal, setShowWorkDoneModal] = useState(false);
  const [selectedWorkDone, setSelectedWorkDone] = useState<{ date: string; workDone: string; photoUrls: string[] } | null>(null);

  const handleEditWorkTime = (record: AttendanceWithEmployee) => {
    const dateStr = formatDateAsKST(new Date(record.date));
    setEditingAttendanceId(record.id);
    setEditedWorkTime({
      date: dateStr,
      checkin: record.clockIn ? formatUtcTimestampAsKST(record.clockIn) : '',
      checkout: record.clockOut ? formatUtcTimestampAsKST(record.clockOut) : '',
      workDone: record.workContent || '',
      status: record.status,
    });
    setIsEditingWorkTime(true);
  };

  const handleSaveWorkTime = async () => {
    if (!editingAttendanceId) return;

    // 초기화(삭제) 처리
    if (editedWorkTime.status === '__reset__') {
      if (!window.confirm('이 출퇴근 기록을 삭제하시겠습니까?')) return;
      try {
        await deleteAttendance.mutateAsync(editingAttendanceId);
        setIsEditingWorkTime(false);
        toast.success('출퇴근 기록이 삭제되었습니다.');
      } catch (err) {
        toast.error(extractErrorMessage(err));
      }
      return;
    }

    const record = attendanceHistory.find((r) => r.id === editingAttendanceId);
    const finalStatus =
      record && editedWorkTime.status !== record.status
        ? editedWorkTime.status
        : (record?.status ?? editedWorkTime.status);
    const finalCheckout = editedWorkTime.checkout.trim();
    const hasOriginalCheckout = Boolean(record?.clockOut);
    const shouldForceCheckinSave =
      editedWorkTime.status === 'checkin' && hasOriginalCheckout && !finalCheckout;
    const statusForSave =
      record && (editedWorkTime.status !== record.status || shouldForceCheckinSave)
        ? editedWorkTime.status
        : undefined;

    if (finalStatus === 'checkout' && !finalCheckout) {
      toast.error('퇴근 상태로 저장하려면 퇴근 시간을 입력해주세요.');
      return;
    }

    try {
      await updateAttendance.mutateAsync({
        attendanceId: editingAttendanceId,
        input: {
          clockIn: editedWorkTime.checkin ? buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkin) : undefined,
          clockOut: editedWorkTime.checkout ? buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkout) : undefined,
          workContent: editedWorkTime.workDone || undefined,
          status: statusForSave,
        },
      });
      setIsEditingWorkTime(false);
      toast.success('근무시간이 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const openWorkDoneModal = (date: string, workDone: string, photoUrls: string[]) => {
    setSelectedWorkDone({ date, workDone, photoUrls });
    setShowWorkDoneModal(true);
  };

  const closeWorkDoneModal = () => {
    setShowWorkDoneModal(false);
    setSelectedWorkDone(null);
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
    // Work time edit
    isEditingWorkTime,
    setIsEditingWorkTime,
    editedWorkTime,
    setEditedWorkTime,
    savingWorkTime: updateAttendance.isPending || deleteAttendance.isPending,
    handleEditWorkTime,
    handleSaveWorkTime,
    // Work done modal
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
