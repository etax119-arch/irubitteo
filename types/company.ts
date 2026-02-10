/** 기업 */
export type Company = {
  id: string;
  code: string;
  name: string;
  address: string | null;
  businessNumber: string | null;
  contractStartDate: string | null;
  hrContactName: string | null;
  hrContactPhone: string | null;
  hrContactEmail: string | null;
  pmContactName: string | null;
  pmContactPhone: string | null;
  pmContactEmail: string | null;
  isActive: boolean;
  resignDate: string | null;
  resignReason: string | null;
  createdAt: string;
  updatedAt: string;
};

/** 기업 목록 조회 응답 (직원 수 포함) */
export type CompanyWithEmployeeCount = Company & {
  employeeCount: number;
};

/** 기업 생성 입력 */
export type CompanyCreateInput = {
  code: string;
  name: string;
  address?: string;
  businessNumber?: string;
  contractStartDate?: string;
  hrContactName?: string;
  hrContactPhone?: string;
  hrContactEmail?: string;
  pmContactName?: string;
  pmContactPhone?: string;
  pmContactEmail?: string;
};

/** 기업 수정 입력 */
export type CompanyUpdateInput = {
  [K in keyof CompanyCreateInput]?: CompanyCreateInput[K] | null;
};

/** 기업 조회 파라미터 */
export type CompanyQueryParams = {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

/** 기업 첨부파일 */
export type CompanyFile = {
  id: string;
  companyId: string;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
};
