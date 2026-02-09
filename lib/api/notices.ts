import apiClient from './client';
import type { NoticeCreateInput, NoticeResponse } from '@/types/notice';
import type { Pagination } from '@/types/api';

export const noticeApi = {
  async create(input: NoticeCreateInput): Promise<NoticeResponse> {
    const response = await apiClient.post<{ success: boolean; data: NoticeResponse }>(
      '/notices',
      input
    );
    return response.data.data;
  },

  async getList(page?: number, limit?: number): Promise<{ data: NoticeResponse[]; pagination: Pagination }> {
    const response = await apiClient.get<{ success: boolean; data: NoticeResponse[]; pagination: Pagination }>(
      '/notices',
      { params: { page, limit } }
    );
    return { data: response.data.data, pagination: response.data.pagination };
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notices/${id}`);
  },
};
