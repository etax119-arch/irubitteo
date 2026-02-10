import apiClient from './client';
import type { EmployeeFile } from '@/types/employee';

export async function getEmployeeFiles(
  employeeId: string
): Promise<EmployeeFile[]> {
  const response = await apiClient.get<{ success: boolean; data: EmployeeFile[] }>(
    `/employees/${employeeId}/files`
  );
  return response.data.data;
}

export async function uploadEmployeeFile(
  employeeId: string,
  file: File,
  documentType: string
): Promise<EmployeeFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  const response = await apiClient.post<{ success: boolean; data: EmployeeFile }>(
    `/employees/${employeeId}/files`,
    formData,
  );
  return response.data.data;
}

export async function deleteEmployeeFile(
  employeeId: string,
  fileId: string
): Promise<void> {
  await apiClient.delete(`/employees/${employeeId}/files/${fileId}`);
}
