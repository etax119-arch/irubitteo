import { useState, useEffect } from 'react';
import { attendanceApi } from '@/lib/api/attendance';
import { useToast } from '@/components/ui/Toast';
import { formatUtcTimestampAsKST, buildKSTTimestamp } from '@/lib/kst';
import type { AttendanceWithEmployee, AttendanceUpdateInput } from '@/types/attendance';

export type DisplayStatus = '정상' | '지각' | '결근' | '휴가';

export interface AttendanceRecord {
  id: string;
  date: string;
  checkin: string;
  checkout: string;
  status: DisplayStatus;
  workDone: string;
}

function toAttendanceRecord(att: AttendanceWithEmployee): AttendanceRecord {
  const date = att.date.split('T')[0];

  if (!att.clockIn) {
    return { id: att.id, date, checkin: '결근', checkout: '-', status: '결근' as const, workDone: '-' };
  }

  return {
    id: att.id,
    date,
    checkin: formatUtcTimestampAsKST(att.clockIn),
    checkout: att.clockOut ? formatUtcTimestampAsKST(att.clockOut) : '-',
    status: att.isLate ? '지각' as const : '정상' as const,
    workDone: att.workContent || '-',
  };
}

export function getStatusColor(status: DisplayStatus) {
  switch (status) {
    case '정상':
      return 'bg-green-100 text-green-700';
    case '지각':
      return 'bg-yellow-100 text-yellow-700';
    case '휴가':
      return 'bg-blue-100 text-blue-700';
    case '결근':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function useAttendanceHistory(employeeId: string) {
  const toast = useToast();
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
  });
  const [originalWorkTime, setOriginalWorkTime] = useState({
    checkin: '',
    checkout: '',
    workDone: '',
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
    const checkin = record.checkin === '결근' || record.checkin === '-' ? '09:00' : record.checkin;
    const checkout = record.checkout === '-' ? '' : record.checkout;
    const workDone = record.workDone === '-' ? '' : record.workDone;
    setEditedWorkTime({ date: record.date, checkin, checkout, workDone });
    setOriginalWorkTime({ checkin, checkout, workDone });
    setIsEditingWorkTime(true);
  };

  const handleSaveWorkTime = async () => {
    const record = attendanceHistory.find((r) => r.date === editedWorkTime.date);
    if (!record) {
      toast.error('해당 출퇴근 기록을 찾을 수 없습니다.');
      return;
    }

    const payload: AttendanceUpdateInput = {};
    if (editedWorkTime.checkin !== originalWorkTime.checkin) {
      payload.clockIn = buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkin);
    }
    if (editedWorkTime.checkout !== originalWorkTime.checkout) {
      payload.clockOut = buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkout);
    }
    if (editedWorkTime.workDone !== originalWorkTime.workDone) {
      payload.workContent = editedWorkTime.workDone;
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
