import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DISABILITY_TYPES } from '@/types/employee';

interface ResumeFormData {
  name: string;
  birthDate: string;
  zipCode: string;
  address: string;
  phone: string;
  mobile: string;
  guardianPhone: string;
  smsConsent: boolean;
  email: string;
  emailConsent: boolean;
  schoolName: string;
  major: string;
  enrollmentPeriod: string;
  educationStatus: string;
  privacyConsent: boolean;
  careers: Array<{ companyName: string; period: string; duties: string }>;
  disabilityTypes: string[];
  disabilityDetail: string;
  disabilitySeverity: string;
  workType: string;
}

/* ── 색상 (tailwind.config.js 기준) ── */
const C = {
  sectionBg: [255, 149, 79] as [number, number, number],   // duru-orange-500
  thBg: [255, 247, 237] as [number, number, number],        // orange-50
  thText: [204, 96, 26] as [number, number, number],        // duru-orange-700
  border: [229, 231, 235] as [number, number, number],      // gray-200
  text: [17, 24, 39] as [number, number, number],           // gray-900
  gray400: [156, 163, 175] as [number, number, number],     // gray-400
  white: [255, 255, 255] as [number, number, number],
};

/* ── 폰트 캐시 (TTF → base64) ── */
let fontCache: { regular: string; bold: string } | null = null;

async function loadFonts(): Promise<{ regular: string; bold: string }> {
  if (fontCache) return fontCache;

  const [regBuf, boldBuf] = await Promise.all([
    fetch('/fonts/NanumGothic-Regular.ttf').then((r) => r.arrayBuffer()),
    fetch('/fonts/NanumGothic-Bold.ttf').then((r) => r.arrayBuffer()),
  ]);

  const toBase64 = (buf: ArrayBuffer) => {
    const bytes = new Uint8Array(buf);
    const chunks: string[] = [];
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      chunks.push(
        String.fromCharCode(...bytes.subarray(i, i + CHUNK)),
      );
    }
    return btoa(chunks.join(''));
  };

  fontCache = { regular: toBase64(regBuf), bold: toBase64(boldBuf) };
  return fontCache;
}

const FONT = 'NanumGothic';

/* ── 공통 autoTable 스타일 ── */
const baseStyles = {
  font: FONT,
  fontSize: 10,
  textColor: C.text,
  lineColor: C.border,
  lineWidth: 0.3,
  cellPadding: { top: 4, right: 6, bottom: 4, left: 6 },
};

const thStyles = {
  fillColor: C.thBg,
  textColor: C.thText,
  fontStyle: 'bold' as const,
  fontSize: 10,
};

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

export async function generateResumePdf(
  formData: ResumeFormData,
): Promise<Blob> {
  const fonts = await loadFonts();

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerMargin = (contentWidth: number) => {
    const sideMargin = (pageWidth - contentWidth) / 2;
    return { left: sideMargin, right: sideMargin };
  };

  const personalTableWidth = 172;
  const standardTableWidth = 172;
  const careerTableWidth = 172;

  /* ── 폰트 등록 (TTF — jsPDF 네이티브 지원) ── */
  doc.addFileToVFS('NanumGothic-Regular.ttf', fonts.regular);
  doc.addFont('NanumGothic-Regular.ttf', FONT, 'normal');
  doc.addFileToVFS('NanumGothic-Bold.ttf', fonts.bold);
  doc.addFont('NanumGothic-Bold.ttf', FONT, 'bold');
  doc.setFont(FONT, 'normal');

  /* ── 타이틀 "이 력 서" ── */
  const titleY = 22;
  doc.setFont(FONT, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C.text);
  doc.text('이 력 서', pageWidth / 2, titleY, { align: 'center' });

  // 오렌지 밑줄
  const titleWidth = doc.getTextWidth('이 력 서');
  const lineX = (pageWidth - titleWidth) / 2;
  doc.setDrawColor(...C.sectionBg);
  doc.setLineWidth(1);
  doc.line(lineX, titleY + 2, lineX + titleWidth, titleY + 2);

  doc.setFont(FONT, 'normal');

  let startY = titleY + 10;

  /* ══════════════════════════════════════════
     1) 개인정보
     ══════════════════════════════════════════ */
  autoTable(doc, {
    startY,
    theme: 'grid',
    styles: baseStyles,
    margin: centerMargin(personalTableWidth),
    columnStyles: {
      0: { ...thStyles, cellWidth: 31 },
      1: { cellWidth: 55 },
      2: { ...thStyles, cellWidth: 31 },
      3: { cellWidth: 55 },
    },
    body: [
      sectionHeaderRow('개인정보', 4),
      [
        { content: '성명', styles: thStyles },
        formData.name,
        { content: '생년월일', styles: thStyles },
        formData.birthDate,
      ],
      [
        { content: '우편번호', styles: thStyles },
        formData.zipCode,
        { content: '주소', styles: thStyles },
        formData.address,
      ],
      [
        { content: '전화번호', styles: thStyles },
        formData.phone,
        { content: '휴대전화', styles: thStyles },
        formData.mobile,
      ],
      [
        { content: '보호자전화', styles: thStyles },
        formData.guardianPhone,
        { content: '문자서비스', styles: thStyles },
        formData.smsConsent ? '동의' : '비동의',
      ],
      [
        { content: '전자우편', styles: thStyles },
        formData.email,
        { content: '수신동의', styles: thStyles },
        formData.emailConsent ? '동의' : '비동의',
      ],
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startY = (doc as any).lastAutoTable.finalY + 4;

  /* ══════════════════════════════════════════
     2) 최종 학력사항
     ══════════════════════════════════════════ */
  autoTable(doc, {
    startY,
    theme: 'grid',
    styles: baseStyles,
    margin: centerMargin(standardTableWidth),
    columnStyles: {
      0: { ...thStyles, cellWidth: 28 },
      1: { cellWidth: 58 },
      2: { ...thStyles, cellWidth: 28 },
      3: { cellWidth: 58 },
    },
    body: [
      sectionHeaderRow('최종 학력사항', 4),
      [
        { content: '학교명', styles: thStyles },
        formData.schoolName,
        { content: '전공', styles: thStyles },
        formData.major,
      ],
      [
        { content: '재학기간', styles: thStyles },
        formData.enrollmentPeriod,
        { content: '상태', styles: thStyles },
        formData.educationStatus,
      ],
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startY = (doc as any).lastAutoTable.finalY + 4;

  /* ══════════════════════════════════════════
     3) 경력사항
     ══════════════════════════════════════════ */
  const filledCareers = formData.careers.filter(
    (c) => c.companyName || c.period || c.duties,
  );

  const careerBody =
    filledCareers.length > 0
      ? filledCareers.map((c) => [c.companyName, c.period, c.duties])
      : [
          [
            {
              content: '없음',
              colSpan: 3,
              styles: { halign: 'center' as const, textColor: C.gray400 },
            },
          ],
        ];

  autoTable(doc, {
    startY,
    theme: 'grid',
    styles: baseStyles,
    margin: centerMargin(careerTableWidth),
    columnStyles: {
      0: { cellWidth: 52 },
      1: { cellWidth: 42 },
      2: { cellWidth: 78 },
    },
    body: [
      sectionHeaderRow('경력사항', 3),
      [
        { content: '회사명', styles: thStyles },
        { content: '재직기간', styles: thStyles },
        { content: '담당업무', styles: thStyles },
      ],
      ...careerBody,
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startY = (doc as any).lastAutoTable.finalY + 4;

  /* ══════════════════════════════════════════
     4) 추가정보 - 장애사항
     ══════════════════════════════════════════ */
  // 장애유형: ■/□ 텍스트 (5개씩 한 줄)
  const typeLines: string[] = [];
  for (let i = 0; i < DISABILITY_TYPES.length; i += 5) {
    const chunk = DISABILITY_TYPES.slice(i, i + 5);
    typeLines.push(
      chunk
        .map((t) => `${formData.disabilityTypes.includes(t) ? '■' : '□'} ${t}`)
        .join('    '),
    );
  }
  const disabilityTypesText = typeLines.join('\n');

  autoTable(doc, {
    startY,
    theme: 'grid',
    styles: baseStyles,
    margin: centerMargin(standardTableWidth),
    columnStyles: {
      0: { ...thStyles, cellWidth: 28 },
      1: { cellWidth: 58 },
      2: { ...thStyles, cellWidth: 28 },
      3: { cellWidth: 58 },
    },
    body: [
      sectionHeaderRow('추가정보 - 장애사항', 4),
      [
        { content: '장애유형', styles: { ...thStyles, valign: 'top' as const } },
        {
          content: disabilityTypesText,
          colSpan: 3,
          styles: { fontSize: 8 },
        },
      ],
      [
        { content: '구체적 장애내용', styles: thStyles },
        { content: formData.disabilityDetail, colSpan: 3 },
      ],
      [
        { content: '장애정도', styles: thStyles },
        formData.disabilitySeverity,
        { content: '근무형태', styles: thStyles },
        formData.workType,
      ],
    ],
  });

  return doc.output('blob');
}
