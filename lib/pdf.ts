import type { jsPDF } from 'jspdf';

/**
 * 공용 PDF 유틸 (jsPDF + jspdf-autotable + NanumGothic 한글 폰트).
 * 출퇴근/근무일정/근무통계 등 여러 라우트에서 공유하므로 lib에 위치.
 */

/* ── 색상 (tailwind.config.js 기준) ── */
export const PDF_COLORS = {
  sectionBg: [255, 149, 79] as [number, number, number], // duru-orange-500
  thBg: [255, 247, 237] as [number, number, number], // orange-50
  thText: [204, 96, 26] as [number, number, number], // duru-orange-700
  border: [229, 231, 235] as [number, number, number], // gray-200
  text: [17, 24, 39] as [number, number, number], // gray-900
  gray400: [156, 163, 175] as [number, number, number], // gray-400
  blue600: [37, 99, 235] as [number, number, number], // blue-600
  white: [255, 255, 255] as [number, number, number],
};

export const PDF_FONT = 'NanumGothic';

/* ── 폰트 캐시 (TTF → base64) ── */
let fontCache: { regular: string; bold: string } | null = null;

export async function loadNanumFonts(): Promise<{ regular: string; bold: string }> {
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
      chunks.push(String.fromCharCode(...bytes.subarray(i, i + CHUNK)));
    }
    return btoa(chunks.join(''));
  };

  fontCache = { regular: toBase64(regBuf), bold: toBase64(boldBuf) };
  return fontCache;
}

/** 문서에 NanumGothic 폰트를 등록하고 기본 폰트로 설정한다. */
export function registerNanumFonts(
  doc: jsPDF,
  fonts: { regular: string; bold: string },
): void {
  doc.addFileToVFS('NanumGothic-Regular.ttf', fonts.regular);
  doc.addFont('NanumGothic-Regular.ttf', PDF_FONT, 'normal');
  doc.addFileToVFS('NanumGothic-Bold.ttf', fonts.bold);
  doc.addFont('NanumGothic-Bold.ttf', PDF_FONT, 'bold');
  doc.setFont(PDF_FONT, 'normal');
}

/* ── 공통 autoTable 스타일 ── */
export const pdfBaseStyles = {
  font: PDF_FONT,
  fontSize: 10,
  textColor: PDF_COLORS.text,
  lineColor: PDF_COLORS.border,
  lineWidth: 0.3,
  cellPadding: { top: 4, right: 6, bottom: 4, left: 6 },
};

export const pdfThStyles = {
  fillColor: PDF_COLORS.thBg,
  textColor: PDF_COLORS.thText,
  fontStyle: 'bold' as const,
  fontSize: 10,
};
