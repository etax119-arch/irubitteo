/** 공지사항 */
export type Notice = {
  id: string;
  companyId: string;
  content: string;
  senderName: string | null;
  createdAt: Date;
};

/** 공지 수신자 */
export type NoticeRecipient = {
  id: string;
  noticeId: string;
  employeeId: string;
  readAt: Date | null;
};

/** 공지사항 생성 입력 */
export type NoticeCreateInput = {
  content: string;
  senderName?: string;
  recipientIds: string[]; // 수신할 직원 ID 목록
};

/** 공지사항 목록 조회용 (수신자 정보 포함) */
export type NoticeWithRecipients = Notice & {
  recipients: {
    id: string;
    name: string;
    readAt: Date | null;
  }[];
};
