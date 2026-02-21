/** 이력서 (서버 toResponse() 기준 API 응답) */
export type Resume = {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  disabilityTypes: string[];
  disabilitySeverity: string | null;
  workType: string | null;
  pdfPath: string | null;
  status: 'pending' | 'reviewed';
  createdAt: string;
  reviewedAt: string | null;
};

/** 이력서 조회 파라미터 */
export type ResumeQueryParams = {
  status?: 'pending' | 'reviewed';
  page?: number;
  limit?: number;
};
