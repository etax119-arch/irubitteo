/** 문의 */
export type Inquiry = {
  id: string;
  companyName: string;
  representativeName: string;
  phone: string;
  email: string | null;
  content: string;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt: string | null;
};

/** 문의 생성 입력 (랜딩 페이지 폼) */
export type InquiryCreateInput = {
  companyName: string;
  representativeName: string;
  phone: string;
  email?: string;
  content: string;
};

/** 문의 조회 파라미터 */
export type InquiryQueryParams = {
  status?: 'pending' | 'completed';
  page?: number;
  limit?: number;
};
