import { useState, useEffect } from 'react';
import { attendanceApi } from '@/lib/api/attendance';
import { useToast } from '@/components/ui/Toast';
import { formatUtcTimestampAsKST, buildKSTTimestamp } from '@/lib/kst';
import type { AttendanceWithEmployee, AttendanceUpdateInput, DisplayStatus } from '@/types/attendance';

export type { DisplayStatus };

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

  const displayStatus = ((): DisplayStatus => {
    switch (att.status) {
      case 'leave': return '휴가';
      case 'holiday': return '휴일';
      case 'absent': return '결근';
      case 'checkin':
      case 'checkout':
        return att.isLate ? '지각' : '정상';
      default: return '정상';
    }
  })();

  return {
    id: att.id,
    date,
    checkin: att.status === 'absent' && !att.clockIn
      ? '결근'
      : att.clockIn ? formatUtcTimestampAsKST(att.clockIn) : '-',
    checkout: att.clockOut ? formatUtcTimestampAsKST(att.clockOut) : '-',
    status: displayStatus,
    workDone: att.workContent || '-',
  };
}

export { getStatusColor } from '../../_utils/attendanceStatus';

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
    const checkin = record.checkin === '결근' || record.checkin === '-' ? '' : record.checkin;
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
    if (editedWorkTime.checkin !== originalWorkTime.checkin && editedWorkTime.checkin) {
      payload.clockIn = buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkin);
    }
    if (editedWorkTime.checkout !== originalWorkTime.checkout && editedWorkTime.checkout) {
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

  const handleVacation = async () => {
    const record = attendanceHistory.find((r) => r.date === editedWorkTime.date);
    if (!record) {
      toast.error('해당 출퇴근 기록을 찾을 수 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      await attendanceApi.updateAttendance(record.id, { status: 'leave' });
      const response = await attendanceApi.getAttendances({ employeeId, limit: 7 });
      setAttendanceHistory(response.data.map(toAttendanceRecord));
      setIsEditingWorkTime(false);
      toast.success('휴가 처리되었습니다.');
    } catch {
      toast.error('휴가 처리에 실패했습니다.');
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
    handleVacation,
    setIsEditingWorkTime,
    showWorkDoneModal,
    selectedWorkDone,
    openWorkDoneModal,
    closeWorkDoneModal,
  };
}
