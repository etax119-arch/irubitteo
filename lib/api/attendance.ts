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
    if (input.photos && input.photos.length > 0) {
      const formData = new FormData();
      formData.append('workContent', input.workContent);
      if (input.note) formData.append('note', input.note);
      input.photos.forEach((blob) => formData.append('photos', blob, 'photo.jpg'));
      const response = await apiClient.post<{ success: boolean; data: Attendance }>(
        '/attendances/clock-out',
        formData
      );
      return response.data.data;
    }
    const requestBody = { ...input };
    delete requestBody.photos;
    const response = await apiClient.post<{ success: boolean; data: Attendance }>(
      '/attendances/clock-out',
      requestBody
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
   * 선택 조건의 모든 출퇴근 기록을 페이지네이션으로 전부 조회 (엑셀 내보내기용).
   * 서버 limit 최대치(100)를 반복 호출로 우회한다.
   */
  async getAllAttendances(
    params?: Omit<AttendanceQueryParams, 'page' | 'limit'>
  ): Promise<AttendanceWithEmployee[]> {
    const limit = 100;
    const first = await attendanceApi.getAttendances({ ...params, page: 1, limit });
    const totalPages = first.pagination?.totalPages ?? 1;
    if (totalPages <= 1) return first.data;

    // 남은 페이지는 서로 독립적이므로 병렬로 조회한다.
    const restPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const rest = await Promise.all(
      restPages.map((page) => attendanceApi.getAttendances({ ...params, page, limit }))
    );
    return [first.data, ...rest.map((res) => res.data)].flat();
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
   * 출퇴근 기록 삭제
   * DELETE /v1/attendances/:id
   */
  async deleteAttendance(id: string): Promise<void> {
    await apiClient.delete(`/attendances/${id}`);
  },

  /**
   * 활동 사진 추가
   * POST /v1/attendances/:id/photos
   */
  async addPhotos(attendanceId: string, photos: Blob[]): Promise<AttendanceWithEmployee> {
    const formData = new FormData();
    photos.forEach((blob) => formData.append('photos', blob, 'photo.jpg'));
    const response = await apiClient.post<{ success: boolean; data: AttendanceWithEmployee }>(
      `/attendances/${attendanceId}/photos`,
      formData
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
