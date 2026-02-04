/** 문의 상태 */
export type InquiryStatus = 'pending' | 'completed';

/** 기업 문의 */
export type Inquiry = {
  id: string;
  companyName: string;
  representativeName: string;
  phone: string;
  email: string | null;
  content: string;
  status: InquiryStatus;
  createdAt: Date;
  completedAt: Date | null;
};

/** 기업 문의 생성 입력 (비인증) */
export type InquiryCreateInput = {
  companyName: string;
  representativeName: string;
  phone: string;
  email?: string;
  content: string;
};
