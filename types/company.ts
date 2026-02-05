/** 기업 */
export type Company = {
  id: string;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  businessNumber: string | null;
  contractStartDate: Date | null;
  contractEndDate: Date | null;
  hrContactName: string | null;
  hrContactPhone: string | null;
  hrContactEmail: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/** 기업 목록 조회 응답 (직원 수 포함) */
export type CompanyWithEmployeeCount = Company & {
  employeeCount: number;
};

/** 기업 생성 입력 */
export type CompanyCreateInput = {
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  businessNumber?: string;
  contractStartDate?: Date;
  contractEndDate?: Date;
  hrContactName?: string;
  hrContactPhone?: string;
  hrContactEmail?: string;
};

/** 기업 수정 입력 */
export type CompanyUpdateInput = Partial<Omit<CompanyCreateInput, 'code'>>;

/** 기업 첨부파일 */
export type CompanyFile = {
  id: string;
  companyId: string;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: Date;
};