import apiClient from './client';
import type { EmployeeNoticesResponse } from '@/types/notice';

export const employeeNoticeApi = {
  async getMyNotices(): Promise<EmployeeNoticesResponse> {
    const response = await apiClient.get<{ success: boolean; data: EmployeeNoticesResponse }>(
      '/notices/my'
    );
    return response.data.data;
  },

  async markAsRead(noticeId: string): Promise<void> {
    await apiClient.patch(`/notices/${noticeId}/read`);
  },
};
