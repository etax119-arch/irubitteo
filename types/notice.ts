/** 공지사항 생성 입력 */
export type NoticeCreateInput = {
  content: string;
  senderName?: string;
  recipientIds: string[]; // 수신할 직원 ID 목록
};

/** API 응답용 공지 */
export type NoticeResponse = {
  id: string;
  companyId: string;
  content: string;
  senderName: string | null;
  createdAt: string; // ISO string
  recipients: {
    id: string;
    name: string;
    readAt: string | null;
  }[];
};

/** 직원용 공지 */
export type EmployeeNotice = {
  id: string;
  content: string;
  senderName: string | null;
  createdAt: string;
  readAt: string | null;
};

/** 직원 공지 응답 */
export type EmployeeNoticesResponse = {
  today: EmployeeNotice[];
  past: EmployeeNotice[];
};
