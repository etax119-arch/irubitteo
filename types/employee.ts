/** 출근 요일 (1=월, 2=화, ..., 7=일) */
export type WorkDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** 성별 */
export type Gender = 'male' | 'female';

/** 장애 중증도 */
export type DisabilitySeverity = 'severe' | 'mild';

/** 장애 유형 */
export type DisabilityType =
  | '지체장애'
  | '뇌병변장애'
  | '시각장애'
  | '청각장애'
  | '언어장애'
  | '지적장애'
  | '정신장애'
  | '자폐성장애'
  | '신장장애'
  | '심장장애'
  | '호흡기장애'
  | '간장애'
  | '안면장애'
  | '장루·요루장애'
  | '간질장애';

/** 직원 */
export type Employee = {
  id: string;
  companyId: string;
  uniqueCode: string;
  name: string;
  phone: string;
  gender: Gender;
  ssnEncrypted: string;
  hireDate: Date;
  resignDate: Date | null;
  contractEndDate: Date | null;
  workDays: WorkDay[];
  workStartTime: string; // HH:mm 형식
  workEndTime: string; // HH:mm 형식
  profileImage: string | null;
  disabilityType: DisabilityType | null;
  disabilitySeverity: DisabilitySeverity | null;
  disabilityRecognitionDate: Date | null;
  emergencyContactName: string | null;
  emergencyContactRelation: string | null;
  emergencyContactPhone: string | null;
  companyNote: string | null;
  adminNote: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/** 직원 생성 입력 (companyId는 JWT에서 추출, uniqueCode는 서버에서 자동 생성) */
export type EmployeeCreateInput = {
  name: string;
  phone: string;
  gender: Gender;
  ssn: string; // 평문 주민번호 (서버에서 암호화)
  hireDate: Date;
  contractEndDate?: Date;
  workDays?: WorkDay[];
  workStartTime?: string;
  workEndTime?: string;
  profileImage?: string;
  disabilityType?: DisabilityType;
  disabilitySeverity?: DisabilitySeverity;
  disabilityRecognitionDate?: Date;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
};

/** 직원 수정 입력 (ssn, hireDate는 수정 불가) */
export type EmployeeUpdateInput = Partial<Omit<EmployeeCreateInput, 'ssn' | 'hireDate'>> & {
  resignDate?: Date;
  companyNote?: string;
  adminNote?: string;
};

/** 직원 첨부파일 */
export type EmployeeFile = {
  id: string;
  employeeId: string;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: Date;
};

/** 직원 목록 조회용 (간략 정보) */
export type EmployeeSummary = Pick<
  Employee,
  'id' | 'uniqueCode' | 'name' | 'phone' | 'isActive'
>;