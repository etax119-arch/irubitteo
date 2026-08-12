import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  PDF_COLORS as C,
  PDF_FONT as FONT,
  loadNanumFonts,
  registerNanumFonts,
  pdfBaseStyles as baseStyles,
  pdfThStyles as thStyles,
} from '@/lib/pdf';
import type { WorkStatEmployee } from '@/types/adminDashboard';

export interface WorkStatsPdfData {
  companyName: string;
  selectedMonth: string; // "2026-02"
  workers: WorkStatEmployee[];
  pmContactName: string | null;
  pmContactPhone: string | null;
  pmContactEmail: string | null;
}

/* ── 섹션 헤더 행 (colSpan 전체) ── */
function sectionHeaderRow(title: string, colSpan: number) {
  return [
    {
      content: title,
      colSpan,
      styles: {
        fillColor: C.sectionBg,
        textColor: C.white,
        fontStyle: 'bold' as const,
        fontSize: 10,
        halign: 'left' as const,
      },
    },
  ];
}

export async function generateWorkStatsPdf(
  data: WorkStatsPdfData,
): Promise<Blob> {
  const fonts = await loadNanumFonts();

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const tableWidth = 172;
  const sideMargin = (pageWidth - tableWidth) / 2;

  /* ── 폰트 등록 ── */
  registerNanumFonts(doc, fonts);

  /* ── 타이틀 ── */
  const titleY = 22;
  doc.setFont(FONT, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...C.text);
  doc.text(`${data.companyName} 월 근무 통계`, pageWidth / 2, titleY, { align: 'center' });

  // 오렌지 밑줄
  const titleText = `${data.companyName} 월 근무 통계`;
  const titleWidth = doc.getTextWidth(titleText);
  const lineX = (pageWidth - titleWidth) / 2;
  doc.setDrawColor(...C.sectionBg);
  doc.setLineWidth(1);
  doc.line(lineX, titleY + 2, lineX + titleWidth, titleY + 2);

  // 부제목 (연/월)
  const [year, month] = data.selectedMonth.split('-');
  doc.setFont(FONT, 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...C.gray400);
  doc.text(`${year}년 ${month}월`, pageWidth / 2, titleY + 10, { align: 'center' });

  /* ── 담당자 정보 ── */
  let tableStartY = titleY + 18;

  const pmParts: string[] = [];
  if (data.pmContactName) pmParts.push(data.pmContactName);
  if (data.pmContactPhone) pmParts.push(data.pmContactPhone);
  if (data.pmContactEmail) pmParts.push(data.pmContactEmail);

  if (pmParts.length > 0) {
    const pmY = titleY + 20;
    doc.setFont(FONT, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.thText);
    doc.text('담당자', sideMargin, pmY);

    doc.setFont(FONT, 'normal');
    doc.setTextColor(...C.text);
    doc.text(pmParts.join('  |  '), sideMargin + doc.getTextWidth('담당자') + 4, pmY);

    tableStartY = pmY + 6;
  }

  /* ── 근무 통계 테이블 ── */
  const avgWorkDays = data.workers.length > 0
    ? (data.workers.reduce((sum, w) => sum + w.workDays, 0) / data.workers.length).toFixed(1)
    : '0';
  const avgWorkHours = data.workers.length > 0
    ? (data.workers.reduce((sum, w) => sum + w.totalHours, 0) / data.workers.length).toFixed(1)
    : '0';

  const bodyRows = data.workers.map((w) => [
    w.name,
    w.scheduledWorkDays.join(', '),
    `${w.workDays}일`,
    { content: `${w.totalHours}h`, styles: { textColor: C.blue600, fontStyle: 'bold' as const } },
  ]);

  autoTable(doc, {
    startY: tableStartY,
    theme: 'grid',
    styles: baseStyles,
    margin: { left: sideMargin, right: sideMargin },
    columnStyles: {
      0: { cellWidth: 36, fontStyle: 'bold' as const },
      1: { cellWidth: 60 },
      2: { cellWidth: 38, halign: 'center' as const },
      3: { cellWidth: 38, halign: 'center' as const },
    },
    body: [
      sectionHeaderRow('근무 통계', 4),
      [
        { content: '이름', styles: thStyles },
        { content: '근무요일', styles: thStyles },
        { content: '출근 일수', styles: { ...thStyles, halign: 'center' as const } },
        { content: '총 근무시간', styles: { ...thStyles, halign: 'center' as const } },
      ],
      ...bodyRows,
      [
        {
          content: '평균',
          colSpan: 2,
          styles: {
            fillColor: C.thBg,
            fontStyle: 'bold' as const,
          },
        },
        {
          content: `${avgWorkDays}일`,
          styles: {
            fillColor: C.thBg,
            fontStyle: 'bold' as const,
            halign: 'center' as const,
          },
        },
        {
          content: `${avgWorkHours}h`,
          styles: {
            fillColor: C.thBg,
            textColor: C.blue600,
            fontStyle: 'bold' as const,
            halign: 'center' as const,
          },
        },
      ],
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentY = (doc as any).lastAutoTable.finalY + 12;

  /* ── 서명란 ── */
  const signBoxWidth = (tableWidth - 10) / 2; // 2열 + 간격 10mm
  const signBoxHeight = 24;
  const leftX = sideMargin;
  const rightX = sideMargin + signBoxWidth + 10;

  // 페이지 여유 확인 → 필요 시 새 페이지
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + 60 > pageHeight - 15) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont(FONT, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.text);
  doc.text('기업 (대표자)', leftX, currentY);
  doc.text('이루빛터 (담당자)', rightX, currentY);

  currentY += 4;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.5);

  // 왼쪽 서명 박스
  doc.roundedRect(leftX, currentY, signBoxWidth, signBoxHeight, 2, 2, 'S');
  doc.setFontSize(10);
  doc.setTextColor(...C.gray400);
  doc.text('(서명/인)', leftX + signBoxWidth / 2, currentY + signBoxHeight / 2 + 2, { align: 'center' });

  // 오른쪽 서명 박스
  doc.roundedRect(rightX, currentY, signBoxWidth, signBoxHeight, 2, 2, 'S');
  doc.text('(서명/인)', rightX + signBoxWidth / 2, currentY + signBoxHeight / 2 + 2, { align: 'center' });

  /* ── 하단 텍스트 ── */
  currentY += signBoxHeight + 8;
  doc.setFontSize(9);
  doc.setTextColor(...C.gray400);
  doc.text('이루빛터 중앙 통제 시스템', pageWidth - sideMargin, currentY, { align: 'right' });

  return doc.output('blob');
}
