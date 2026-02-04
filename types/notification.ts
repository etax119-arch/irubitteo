/** 알림 유형 */
export type NotificationType = 'absence' | 'contract_expiry' | 'long_absence';

/** 알림 */
export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  relatedId: string | null;
  isRead: boolean;
  createdAt: Date;
};

/** 알림 조회 필터 */
export type NotificationFilter = {
  type?: NotificationType;
  isRead?: boolean;
};
