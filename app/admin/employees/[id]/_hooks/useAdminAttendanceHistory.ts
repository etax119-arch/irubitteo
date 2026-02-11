'use client';

import { useState, useCallback } from 'react';
import { attendanceApi } from '@/lib/api/attendance';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import { formatUtcTimestampAsKST, formatDateAsKST, buildKSTTimestamp } from '@/lib/kst';
import type { AttendanceWithEmployee, AttendanceStatus } from '@/types/attendance';

export function useAdminAttendanceHistory(
  employeeId: string,
  onSaved?: () => void,
) {
  const toast = useToast();

  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceWithEmployee[]>([]);

  // Work time edit modal
  const [isEditingWorkTime, setIsEditingWorkTime] = useState(false);
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null);
  const [editedWorkTime, setEditedWorkTime] = useState({
    date: '',
    checkin: '09:00',
    checkout: '18:00',
    workDone: '',
    status: 'checkin' as AttendanceStatus,
  });
  const [savingWorkTime, setSavingWorkTime] = useState(false);

  // Work done modal
  const [showWorkDoneModal, setShowWorkDoneModal] = useState(false);
  const [selectedWorkDone, setSelectedWorkDone] = useState<{ date: string; workDone: string } | null>(null);

  const fetchAttendance = useCallback(async () => {
    try {
      const result = await attendanceApi.getAttendances({
        employeeId,
        limit: 10,
      });
      setAttendanceHistory(result.data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  }, [employeeId]);

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
    const record = attendanceHistory.find((r) => r.id === editingAttendanceId);
    try {
      setSavingWorkTime(true);
      await attendanceApi.updateAttendance(editingAttendanceId, {
        clockIn: editedWorkTime.checkin ? buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkin) : undefined,
        clockOut: editedWorkTime.checkout ? buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkout) : undefined,
        workContent: editedWorkTime.workDone || undefined,
        status: record && editedWorkTime.status !== record.status ? editedWorkTime.status : undefined,
      });
      setIsEditingWorkTime(false);
      toast.success('근무시간이 수정되었습니다.');
      fetchAttendance();
      onSaved?.();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingWorkTime(false);
    }
  };

  const openWorkDoneModal = (date: string, workDone: string) => {
    setSelectedWorkDone({ date, workDone });
    setShowWorkDoneModal(true);
  };

  const closeWorkDoneModal = () => {
    setShowWorkDoneModal(false);
    setSelectedWorkDone(null);
  };

  return {
    attendanceHistory,
    fetchAttendance,
    // Work time edit
    isEditingWorkTime,
    setIsEditingWorkTime,
    editedWorkTime,
    setEditedWorkTime,
    savingWorkTime,
    handleEditWorkTime,
    handleSaveWorkTime,
    // Work done modal
    showWorkDoneModal,
    selectedWorkDone,
    openWorkDoneModal,
    closeWorkDoneModal,
  };
}
