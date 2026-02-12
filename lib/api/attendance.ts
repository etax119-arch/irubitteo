import apiClient from './client';
import type {
  Attendance,
  AttendanceWithEmployee,
  AttendanceQueryParams,
  ClockInInput,
  ClockOutInput,
  AttendanceUpdateInput,
  CompanyDailyResponse,
} from '@/types/attendance';
import type { PaginatedResponse } from '@/types/api';

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
   * 출퇴근 기록 수정
   * PATCH /v1/attendances/:id
   */
  async updateAttendance(id: string, input: AttendanceUpdateInput): Promise<AttendanceWithEmployee> {
    const response = await apiClient.patch<{ success: boolean; data: AttendanceWithEmployee }>(
      `/attendances/${id}`,
      input
    );
    return response.data.data;
  },

  /**
   * 활동 사진 추가
   * POST /v1/attendances/:id/photos
   */
  async addPhotos(attendanceId: string, photos: string[]): Promise<AttendanceWithEmployee> {
    const response = await apiClient.post<{ success: boolean; data: AttendanceWithEmployee }>(
      `/attendances/${attendanceId}/photos`,
      { photos }
    );
    return response.data.data;
  },

  /**
   * 활동 사진 삭제
   * DELETE /v1/attendances/:id/photos
   */
  async deletePhoto(attendanceId: string, photoUrl: string): Promise<AttendanceWithEmployee> {
    const response = await apiClient.delete<{ success: boolean; data: AttendanceWithEmployee }>(
      `/attendances/${attendanceId}/photos`,
      { data: { photoUrl } }
    );
    return response.data.data;
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

  /**
   * 기업 대시보드용 일별 출퇴근 현황
   * GET /v1/attendances/company-daily
   */
  async getCompanyDaily(date?: string): Promise<CompanyDailyResponse> {
    const response = await apiClient.get<{ success: boolean; data: CompanyDailyResponse }>(
      '/attendances/company-daily',
      { params: date ? { date } : undefined }
    );
    return response.data.data;
  },
};

export default attendanceApi;
