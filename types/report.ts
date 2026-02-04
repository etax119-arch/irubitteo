/** 보고서 종류 */
export type ReportType = 'daily' | 'weekly' | 'monthly';

/** 보고서 파일 형식 */
export type ReportFileType = 'pdf' | 'xlsx';

/** 보고서 */
export type Report = {
  id: string;
  companyId: string;
  type: ReportType;
  periodStart: Date;
  periodEnd: Date;
  data: ReportData | null;
  createdAt: Date;
};

/** 보고서 데이터 (JSONB) */
export type ReportData = {
  summary: {
    totalEmployees: number;
    totalWorkDays: number;
    averageAttendanceRate: number;
    totalAbsences: number;
    totalLates: number;
  };
  details: ReportEmployeeDetail[];
};

/** 보고서 직원별 상세 */
export type ReportEmployeeDetail = {
  employeeId: string;
  employeeName: string;
  workDays: number;
  absences: number;
  lates: number;
  earlyLeaves: number;
  totalWorkHours: number;
};

/** 보고서 생성 입력 */
export type ReportCreateInput = {
  companyId: string;
  type: ReportType;
  periodStart: Date;
  periodEnd: Date;
};

/** 보고서 파일 */
export type ReportFile = {
  id: string;
  reportId: string;
  fileType: ReportFileType;
  filePath: string;
  createdAt: Date;
};