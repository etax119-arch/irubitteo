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
import type { Schedule } from '@/types/schedule';

interface ExportScheduleOptions {
  schedules: Schedule[];
  year: number;
  month: number;
}

/**
 * 월 근무일정을 PDF로 내보낸다.
 * 컬럼: 날짜 / 구분 / 내용
 */
export async function exportSchedulesToPdf({
  schedules,
  year,
  month,
}: ExportScheduleOptions): Promise<void> {
  const rows = schedules
    .map((s) => ({
      date: s.date.slice(0, 10),
      type: s.isHoliday ? '휴일' : '업무 지시서',
      content: s.content ?? '',
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

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
