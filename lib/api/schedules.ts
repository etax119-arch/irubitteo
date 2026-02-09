import apiClient from './client';
import type { Schedule, ScheduleCreateInput, ScheduleUpdateInput, MonthlySchedule } from '@/types/schedule';

export const scheduleApi = {
  async getMonthly(year: number, month: number): Promise<MonthlySchedule> {
    const response = await apiClient.get<{ success: boolean; data: MonthlySchedule }>(
      '/schedules/monthly',
      { params: { year, month } }
    );
    return response.data.data;
  },

  async create(input: ScheduleCreateInput): Promise<Schedule> {
    const response = await apiClient.post<{ success: boolean; data: Schedule }>(
      '/schedules',
      input
    );
    return response.data.data;
  },

  async update(id: string, input: ScheduleUpdateInput): Promise<Schedule> {
    const response = await apiClient.patch<{ success: boolean; data: Schedule }>(
      `/schedules/${id}`,
      input
    );
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/schedules/${id}`);
  },

  async getToday(): Promise<Schedule | null> {
    const response = await apiClient.get<{ success: boolean; data: Schedule | null }>(
      '/schedules/today'
    );
    return response.data.data;
  },
};
