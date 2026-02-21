import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { Resume, ResumeQueryParams } from '@/types/resume';

export async function createResume(
  formData: FormData
): Promise<{ success: boolean; data: Resume }> {
  const response = await apiClient.post<{ success: boolean; data: Resume }>(
    '/resumes',
    formData
  );
  return response.data;
}

export async function getResumes(
  params?: ResumeQueryParams
): Promise<PaginatedResponse<Resume>> {
  const response = await apiClient.get<PaginatedResponse<Resume>>(
    '/resumes',
    { params }
  );
  return response.data;
}

export async function reviewResume(
  id: string
): Promise<{ success: boolean; data: Resume }> {
  const response = await apiClient.patch<{ success: boolean; data: Resume }>(
    `/resumes/${id}/review`
  );
  return response.data;
}
