import { formatUtcTimestampAsKST, formatDateAsKST } from '@/lib/kst';
import { getAttendanceRecordStatusLabel, hasNoClockTimes } from '@/lib/status';
import { exportToExcel } from '@/lib/excel';
import type { AttendanceWithEmployee } from '@/types/attendance';

interface ExportAttendancesOptions {
  records: AttendanceWithEmployee[];
  employeeName?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 출퇴근 기록 목록을 엑셀(.xlsx)로 내보낸다 (admin/company 상세 페이지 공통).
 * 컬럼: 날짜 / 출근 / 퇴근 / 상태 / 업무내용
 */
export function exportAttendancesToExcel({
  records,
  employeeName,
  startDate,
  endDate,
}: ExportAttendancesOptions): void {
  const rows = records
    .map((att) => {
      const isAbsentOrLeave = hasNoClockTimes(att.status);
      return {
        date: formatDateAsKST(new Date(att.date)),
        checkin: isAbsentOrLeave ? '' : att.clockIn ? formatUtcTimestampAsKST(att.clockIn) : '',
        checkout: isAbsentOrLeave ? '' : att.clockOut ? formatUtcTimestampAsKST(att.clockOut) : '',
        status: getAttendanceRecordStatusLabel(att.status),
        workContent: att.workContent ?? '',
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const namePart = employeeName ? `_${employeeName}` : '';
  const rangePart = startDate || endDate ? `_${startDate || '처음'}~${endDate || '끝'}` : '';
  exportToExcel({
    fileName: `출퇴근기록${namePart}${rangePart}.xlsx`,
    sheetName: '출퇴근기록',
    columns: [
      { key: 'date', header: '날짜', width: 14 },
      { key: 'checkin', header: '출근', width: 10 },
      { key: 'checkout', header: '퇴근', width: 10 },
      { key: 'status', header: '상태', width: 10 },
      { key: 'workContent', header: '업무내용', width: 40 },
    ],
    rows,
  });
}
