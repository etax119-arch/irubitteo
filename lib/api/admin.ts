import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type {
  AdminStats,
  AdminDailyCompany,
  AbsenceAlert,
  NoteUpdateAlert,
  MonthlyWorkStatsCompany,
} from '@/types/adminDashboard';
import type { AdminFile, AdminFileCategory } from '@/types/adminFile';
import type { AdminAccountSummary, CreateAdminAccountParams } from '@/types/auth';

export async function getAdminStats(): Promise<AdminStats> {
  const response = await apiClient.get<{ success: boolean; data: AdminStats }>(
    '/admin/stats'
  );
  return response.data.data;
}

export async function getAdminDailyAttendance(
  date?: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<PaginatedResponse<AdminDailyCompany>> {
  const response = await apiClient.get<PaginatedResponse<AdminDailyCompany>>(
    '/admin/daily-attendance',
    { params: { date, page, limit, search } }
  );
  return response.data;
}

export async function getAdminMonthlyStats(
  year: number,
  month: number,
  page?: number,
  limit?: number,
  search?: string
): Promise<PaginatedResponse<MonthlyWorkStatsCompany>> {
  const response = await apiClient.get<PaginatedResponse<MonthlyWorkStatsCompany>>(
    '/admin/monthly-stats',
    { params: { year, month, page, limit, search } }
  );
  return response.data;
}

export async function getAbsenceAlerts(
  days?: number,
  page?: number,
  limit?: number
): Promise<PaginatedResponse<AbsenceAlert>> {
  const response = await apiClient.get<PaginatedResponse<AbsenceAlert>>(
    '/admin/absence-alerts',
    { params: { days, page, limit } }
  );
  return response.data;
}

export async function getNoteUpdates(
  limit?: number
): Promise<NoteUpdateAlert[]> {
  const response = await apiClient.get<{ success: boolean; data: NoteUpdateAlert[] }>(
    '/admin/note-updates',
    { params: limit ? { limit } : undefined }
  );
  return response.data.data;
}

export async function dismissAbsenceAlert(attendanceId: string): Promise<void> {
  await apiClient.patch('/admin/absence-alerts/dismiss', { attendanceId });
}

export async function dismissNoteUpdate(employeeId: string): Promise<void> {
  await apiClient.patch('/admin/note-updates/dismiss', { employeeId });
}

export async function calculateAdminMonthlyStats(
  year: number,
  month: number,
  companyId?: string
): Promise<{ updatedCount: number }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { updatedCount: number };
  }>('/admin/monthly-stats/calculate', {
    year,
    month,
    ...(companyId ? { companyId } : {}),
  });
  return response.data.data;
}

export async function updateAdminMonthlyStats(params: {
  employeeId: string;
  year: number;
  month: number;
  workDays?: number;
  totalWorkHours?: number;
}): Promise<void> {
  await apiClient.patch('/admin/monthly-stats', params);
}

export async function getAdminFiles(
  category?: AdminFileCategory
): Promise<AdminFile[]> {
  const response = await apiClient.get<{ success: boolean; data: AdminFile[] }>(
    '/admin/files',
    { params: category ? { category } : undefined }
  );
  return response.data.data;
}

export async function uploadAdminFile(
  file: File,
  category: AdminFileCategory,
  name: string,
  description?: string
): Promise<AdminFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  formData.append('name', name);
  if (description) {
    formData.append('description', description);
  }

  const response = await apiClient.post<{ success: boolean; data: AdminFile }>(
    '/admin/files',
    formData,
  );
  return response.data.data;
}

export async function deleteAdminFile(fileId: string): Promise<void> {
  await apiClient.delete(`/admin/files/${fileId}`);
}

export async function createAdminAccount(
  params: CreateAdminAccountParams
): Promise<AdminAccountSummary> {
  const response = await apiClient.post<{ success: boolean; data: AdminAccountSummary }>(
    '/admin/accounts',
    params
  );
  return response.data.data;
}

export async function getAdminAccounts(): Promise<AdminAccountSummary[]> {
  const response = await apiClient.get<{ success: boolean; data: AdminAccountSummary[] }>(
    '/admin/accounts'
  );
  return response.data.data;
}
