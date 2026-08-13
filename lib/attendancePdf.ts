import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatUtcTimestampAsKST, formatDateAsKST } from '@/lib/kst';
import { getAttendanceRecordStatusLabel, hasNoClockTimes } from '@/lib/status';
import {
  PDF_COLORS,
  PDF_FONT,
  loadNanumFonts,
  registerNanumFonts,
  pdfBaseStyles,
  pdfThStyles,
  pdfDateColumnStyle,
} from '@/lib/pdf';
import type { AttendanceWithEmployee } from '@/types/attendance';

interface ExportAttendancesOptions {
  records: AttendanceWithEmployee[];
  employeeName?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 출퇴근 기록 목록을 PDF로 내보낸다 (admin/company 상세 페이지 공통).
 * 컬럼: 날짜 / 출근 / 퇴근 / 상태 / 업무내용
 */
export async function exportAttendancesToPdf({
  records,
  employeeName,
  startDate,
  endDate,
}: ExportAttendancesOptions): Promise<void> {
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

  const fonts = await loadNanumFonts();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  registerNanumFonts(doc, fonts);

  const pageWidth = doc.internal.pageSize.getWidth();

  /* ── 타이틀 ── */
  const titleY = 22;
  const title = employeeName ? `${employeeName} 출퇴근 기록` : '출퇴근 기록';
  doc.setFont(PDF_FONT, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.text);
  doc.text(title, pageWidth / 2, titleY, { align: 'center' });

  const titleWidth = doc.getTextWidth(title);
  const lineX = (pageWidth - titleWidth) / 2;
  doc.setDrawColor(...PDF_COLORS.sectionBg);
  doc.setLineWidth(1);
  doc.line(lineX, titleY + 2, lineX + titleWidth, titleY + 2);

  /* ── 기간 부제목 ── */
  let tableStartY = titleY + 12;
  if (startDate || endDate) {
    doc.setFont(PDF_FONT, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...PDF_COLORS.gray400);
    doc.text(
      `${startDate || '처음'} ~ ${endDate || '끝'}`,
      pageWidth / 2,
      titleY + 10,
      { align: 'center' },
    );
    tableStartY = titleY + 18;
  }

  /* ── 출퇴근 테이블 ── */
  autoTable(doc, {
    startY: tableStartY,
    theme: 'grid',
    styles: pdfBaseStyles,
    headStyles: pdfThStyles,
    head: [['날짜', '출근', '퇴근', '상태', '업무내용']],
    body: rows.map((r) => [r.date, r.checkin, r.checkout, r.status, r.workContent]),
    columnStyles: {
      0: pdfDateColumnStyle,
      1: { cellWidth: 22, halign: 'center' as const },
      2: { cellWidth: 22, halign: 'center' as const },
      3: { cellWidth: 22, halign: 'center' as const },
      4: { cellWidth: 'auto' as const },
    },
  });

  const namePart = employeeName ? `_${employeeName}` : '';
  const rangePart = startDate || endDate ? `_${startDate || '처음'}~${endDate || '끝'}` : '';
  doc.save(`출퇴근기록${namePart}${rangePart}.pdf`);
}
