import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { employeeKeys } from '@/lib/query/keys';
import { attendanceApi } from '@/lib/api/attendance';
import { useToast } from '@/components/ui/Toast';
import { formatUtcTimestampAsKST, buildKSTTimestamp } from '@/lib/kst';
import { getAttendanceDisplayStatus } from '@/lib/status';
import type { AttendanceWithEmployee, AttendanceUpdateInput, AttendanceStatus, DisplayStatus } from '@/types/attendance';

export type { DisplayStatus };

export interface AttendanceRecord {
  id: string;
  date: string;
  checkin: string;
  checkout: string;
  status: DisplayStatus;
  rawStatus: AttendanceStatus;
  workDone: string;
}

function toAttendanceRecord(att: AttendanceWithEmployee): AttendanceRecord {
  const date = att.date.split('T')[0];

  const displayStatus = getAttendanceDisplayStatus(att);

  return {
    id: att.id,
    date,
    checkin: att.status === 'absent' && !att.clockIn
      ? '결근'
      : att.clockIn ? formatUtcTimestampAsKST(att.clockIn) : '-',
    checkout: att.clockOut ? formatUtcTimestampAsKST(att.clockOut) : '-',
    status: displayStatus,
    rawStatus: att.status,
    workDone: att.workContent || '-',
  };
}


export function useAttendanceHistory(employeeId: string, options?: { onSaved?: () => void }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showWorkDoneModal, setShowWorkDoneModal] = useState(false);
  const [selectedWorkDone, setSelectedWorkDone] = useState<{ date: string; workDone: string } | null>(null);

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

  useEffect(() => {
    let ignore = false;
    async function fetchAttendance() {
      try {
        setIsLoadingAttendance(true);
        setAttendanceHistory([]);
        setAttendanceError(null);
        const response = await attendanceApi.getAttendances({ employeeId, limit: 7 });
        if (!ignore) {
          setAttendanceHistory(response.data.map(toAttendanceRecord));
        }
      } catch {
        if (!ignore) {
          setAttendanceError('출퇴근 기록을 불러오는데 실패했습니다.');
        }
      } finally {
        if (!ignore) {
          setIsLoadingAttendance(false);
        }
      }
    }
    fetchAttendance();
    return () => { ignore = true; };
  }, [employeeId]);

  const openWorkDoneModal = (date: string, workDone: string) => {
    setSelectedWorkDone({ date, workDone });
    setShowWorkDoneModal(true);
  };

  const closeWorkDoneModal = () => {
    setShowWorkDoneModal(false);
    setSelectedWorkDone(null);
  };

  const handleEditWorkTime = (record: AttendanceRecord) => {
    const checkin = record.checkin === '결근' || record.checkin === '-' ? '' : record.checkin;
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

    setIsSaving(true);
    try {
      await attendanceApi.updateAttendance(record.id, payload);
      const response = await attendanceApi.getAttendances({ employeeId, limit: 7 });
      setAttendanceHistory(response.data.map(toAttendanceRecord));
      setIsEditingWorkTime(false);
      toast.success('출퇴근 기록이 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      options?.onSaved?.();
    } catch {
      toast.error('출퇴근 기록 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    attendanceHistory,
    isLoadingAttendance,
    attendanceError,
    isSaving,
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
  };
}
