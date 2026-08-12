/** 출근 요일 (1=월, 2=화, ..., 7=일) */
export type WorkDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** 하루의 출퇴근 시간 ("HH:mm") */
export type WorkTimeEntry = { start: string; end: string };

/**
 * 요일별 출퇴근 시간.
 *
 * 설정하지 않은 요일은 키가 없으며, 그 경우 workStartTime/workEndTime을 사용한다.
 * 전체가 null이면 모든 근무요일에 단일 시간이 적용된다(기본 모드).
 */
export type WorkTimesMap = Partial<Record<`${WorkDay}`, WorkTimeEntry>>;

/** 장애 유형 목록 */
export const DISABILITY_TYPES = [
  '지체장애',
  '뇌병변장애',
  '시각장애',
  '청각장애',
  '언어장애',
  '안면장애',
  '신장장애',
  '심장장애',
  '간장애',
  '췌장장애',
  '호흡기장애',
  '장루·요루장애',
  '뇌전증장애',
  '지적장애',
  '정신장애',
  '자폐성장애',
] as const;

/** 장애 유형 */
export type DisabilityType = (typeof DISABILITY_TYPES)[number];

/** 직원 (서버 toResponse() 기준 API 응답) */
export type Employee = {
  id: string;
  name: string;
  phone: string;
  ssn: string | null;
  disability: string | null;
  hireDate: string;
  gender: string | null;
  addressCity: string | null;
  addressDistrict: string | null;
  addressDetail: string | null;
  emergencyContactName: string | null;
  emergencyContactRelation: string | null;
  emergencyContactPhone: string | null;
  status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'annual_leave' | 'resigned' | 'pending' | 'dayoff';
  clockIn: string | null;
  clockOut: string | null;
  uniqueCode: string;
  companyNote: string | null;
  adminNote: string | null;
  isActive: boolean;
  standby: boolean;
  resignDate: string | null;
  resignReason: string | null;
  workDays: WorkDay[];
  workStartTime: string | null;
  workEndTime: string | null;
  workTimes: WorkTimesMap | null;
  disabilityType: DisabilityType | null;
  disabilitySeverity: '중증' | '경증' | null;
  disabilityRecognitionDate: string | null;
  profileImage: string | null;
  annualLeaveTotal: number;
  annualLeaveUsed: number;
  annualLeaveRemaining: number;
};

/** 직원 생성 입력 (companyId는 JWT에서 추출) */
export type EmployeeCreateInput = {
  name: string;
  ssn: string;
  phone: string;
  gender: '남' | '여';
  uniqueCode: string;
  hireDate: string;
  workDays: WorkDay[];
  workStartTime: string;
  workEndTime?: string;
  workTimes?: WorkTimesMap;
  disabilityType: string;
  disabilitySeverity: '중증' | '경증';
  disabilityRecognitionDate: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  addressCity: string;
  addressDistrict: string;
  addressDetail?: string;
  annualLeaveTotal?: number;
};

/** 직원 수정 입력 (서버 UpdateEmployeeDto 기준) */
export type EmployeeUpdateInput = {
  workDays?: WorkDay[];
  workStartTime?: string;
  workEndTime?: string;
  /** null을 보내면 요일별 설정을 해제하고 단일 시간 모드로 돌아간다 */
  workTimes?: WorkTimesMap | null;
  name?: string;
  phone?: string;
  gender?: '남' | '여';
  ssn?: string;
  emergencyContactName?: string | null;
  emergencyContactRelation?: string | null;
  emergencyContactPhone?: string | null;
  disabilityType?: string | null;
  disabilitySeverity?: '중증' | '경증' | null;
  disabilityRecognitionDate?: string | null;
  hireDate?: string;
  companyNote?: string | null;
  adminNote?: string | null;
  isActive?: boolean;
  standby?: boolean;
  resignDate?: string | null;
  resignReason?: string | null;
  addressCity?: string | null;
  addressDistrict?: string | null;
  addressDetail?: string | null;
  uniqueCode?: string;
  annualLeaveTotal?: number;
};

/** 문서 종류 */
export type DocumentType = '근로계약서' | '동의서' | '건강검진' | '자격증' | '장애인등록증' | '이력서' | '기타';

/** 직원 첨부파일 */
export type EmployeeFile = {
  id: string;
  employeeId: string;
  documentType: DocumentType;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
};

/** 직원 목록 조회용 (간략 정보) */
export type EmployeeSummary = Pick<
  Employee,
  'id' | 'uniqueCode' | 'name' | 'phone' | 'isActive'
>;

/** 직원 목록 조회 파라미터 */
export type EmployeeQueryParams = {
  search?: string;
  isActive?: boolean;
  companyId?: string;
  standby?: boolean;
  page?: number;
  limit?: number;
};

/** 직원 (회사명 포함, 관리자 조회용) */
export type EmployeeWithCompany = Employee & {
  companyName: string;
};