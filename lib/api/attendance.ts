import apiClient from './client';
import type {
  Attendance,
  AttendanceWithEmployee,
  ClockInInput,
  ClockOutInput,
} from '@/types/attendance';

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AttendanceQueryParams {
  employeeId?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'present' | 'absent';
  page?: number;
  limit?: number;
}

export const attendanceApi = {
  /**
   * 출근 처리
   * POST /v1/attendances/clock-in
   */
  async clockIn(input?: ClockInInput): Promise<Attendance> {
    const response = await apiClient.post<{ success: boolean; data: Attendance }>(
      '/attendances/clock-in',
      input ?? {}
    );
    return response.data.data;
  },

  /**
   * 퇴근 처리
   * POST /v1/attendances/clock-out
   */
  async clockOut(input: ClockOutInput): Promise<Attendance> {
    const response = await apiClient.post<{ success: boolean; data: Attendance }>(
      '/attendances/clock-out',
      input
    );
    return response.data.data;
  },

  /**
   * 출퇴근 기록 조회
   * GET /v1/attendances
   */
  async getAttendances(
    params?: AttendanceQueryParams
  ): Promise<PaginatedResponse<AttendanceWithEmployee>> {
    const response = await apiClient.get<PaginatedResponse<AttendanceWithEmployee>>(
      '/attendances',
      { params }
    );
    return response.data;
  },

  /**
   * 오늘의 출퇴근 기록 조회
   * GET /v1/attendances/today
   */
  async getTodayAttendance(): Promise<AttendanceWithEmployee | null> {
    const response = await apiClient.get<{
      success: boolean;
      data: AttendanceWithEmployee | null;
    }>('/attendances/today');
    return response.data.data;
  },
};

export default attendanceApi;
