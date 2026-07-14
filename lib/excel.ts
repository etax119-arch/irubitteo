import * as XLSX from 'xlsx';

/**
 * 엑셀 내보내기 컬럼 정의
 * - key: rows 객체의 필드명
 * - header: 시트 헤더에 표시될 텍스트
 * - width: 열 너비(문자 수 기준, 기본 16)
 */
export interface ExcelColumn<T> {
  key: keyof T & string;
  header: string;
  width?: number;
}

export interface ExportToExcelOptions<T> {
  /** 다운로드 파일명 (확장자 .xlsx 포함) */
  fileName: string;
  /** 시트 이름 (기본 'Sheet1') */
  sheetName?: string;
  columns: ExcelColumn<T>[];
  rows: T[];
}

/**
 * 범용 엑셀(.xlsx) 내보내기 헬퍼.
 * columns 순서대로 헤더/셀을 구성하고 브라우저 다운로드까지 처리한다.
 * (admin/company 여러 라우트에서 공유하므로 lib에 위치)
 */
export function exportToExcel<T extends Record<string, string | number | null | undefined>>({
  fileName,
  sheetName = 'Sheet1',
  columns,
  rows,
}: ExportToExcelOptions<T>): void {
  const header = columns.map((c) => c.header);
  const body = rows.map((row) => columns.map((c) => row[c.key] ?? ''));

  const worksheet = XLSX.utils.aoa_to_sheet([header, ...body]);
  worksheet['!cols'] = columns.map((c) => ({ wch: c.width ?? 16 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}
