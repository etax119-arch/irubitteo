import apiClient from './client';
import type {
  Holiday,
  HolidayCreateInput,
  HolidayUpdateInput,
  YearlyHolidays,
} from '@/types/holiday';

export const holidayApi = {
  async getByYear(year: number): Promise<YearlyHolidays> {
    const response = await apiClient.get<{ success: boolean; data: YearlyHolidays }>(
      '/holidays',
      { params: { year } }
    );
    return response.data.data;
  },

  async create(input: HolidayCreateInput): Promise<Holiday> {
    const response = await apiClient.post<{ success: boolean; data: Holiday }>(
      '/holidays',
      input
    );
    return response.data.data;
  },

  async update(id: string, input: HolidayUpdateInput): Promise<Holiday> {
    const response = await apiClient.patch<{ success: boolean; data: Holiday }>(
      `/holidays/${id}`,
      input
    );
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/holidays/${id}`);
  },
};
