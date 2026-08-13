import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  PDF_COLORS,
  PDF_FONT,
  loadNanumFonts,
  registerNanumFonts,
  pdfBaseStyles,
  pdfThStyles,
} from '@/lib/pdf';
import type { PublicHoliday, Schedule } from '@/types/schedule';

interface ExportScheduleOptions {
  rows: ScheduleExportRow[];
  year: number;
  month: number;
}

/** 내보내기용 행 (날짜 / 구분 / 내용). 엑셀과 PDF가 같은 표를 쓰도록 여기서 만든다 */
export type ScheduleExportRow = {
  date: string;
  type: string;
  content: string;
};

/**
 * 일정과 국가 공휴일을 하나의 날짜순 표로 합친다.
 *
 * 같은 날에 공휴일과 업무 지시서가 둘 다 있으면 두 행으로 나온다 —
 * 공휴일에도 별도 업무 지시서를 등록할 수 있기 때문이다.
 */
export function buildScheduleRows(
  schedules: Schedule[],
  holidays: PublicHoliday[],
): ScheduleExportRow[] {
  const scheduleRows = schedules.map((s) => ({
    date: s.date.slice(0, 10),
    type: s.isHoliday ? '휴일' : '업무 지시서',
    content: s.content ?? '',
  }));

  const holidayRows = holidays.map((h) => ({
    date: h.date.slice(0, 10),
    type: '공휴일',
    content: h.name,
  }));

  return [...holidayRows, ...scheduleRows].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/**
 * 월 근무일정을 PDF로 내보낸다.
 * 컬럼: 날짜 / 구분 / 내용
 */
export async function exportSchedulesToPdf({
  rows,
  year,
  month,
}: ExportScheduleOptions): Promise<void> {

  const fonts = await loadNanumFonts();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  registerNanumFonts(doc, fonts);

  const pageWidth = doc.internal.pageSize.getWidth();

  /* ── 타이틀 ── */
  const titleY = 22;
  const title = '근무 일정';
  doc.setFont(PDF_FONT, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.text);
  doc.text(title, pageWidth / 2, titleY, { align: 'center' });

  const titleWidth = doc.getTextWidth(title);
  const lineX = (pageWidth - titleWidth) / 2;
  doc.setDrawColor(...PDF_COLORS.sectionBg);
  doc.setLineWidth(1);
  doc.line(lineX, titleY + 2, lineX + titleWidth, titleY + 2);

  /* ── 부제목 (연/월) ── */
  doc.setFont(PDF_FONT, 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.gray400);
  doc.text(`${year}년 ${String(month).padStart(2, '0')}월`, pageWidth / 2, titleY + 10, {
    align: 'center',
  });

  /* ── 일정 테이블 ── */
  autoTable(doc, {
    startY: titleY + 18,
    theme: 'grid',
    styles: pdfBaseStyles,
    headStyles: pdfThStyles,
    head: [['날짜', '구분', '내용']],
    body: rows.map((r) => [r.date, r.type, r.content]),
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' as const },
      1: { cellWidth: 30, halign: 'center' as const },
      2: { cellWidth: 'auto' as const },
    },
  });

  doc.save(`근무일정_${year}-${String(month).padStart(2, '0')}.pdf`);
}
