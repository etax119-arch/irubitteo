import apiClient from './client';
import type { CompanyFile } from '@/types/company';

export async function getCompanyFiles(
  companyId: string
): Promise<CompanyFile[]> {
  const response = await apiClient.get<{ success: boolean; data: CompanyFile[] }>(
    `/companies/${companyId}/files`,
    { _skipAuthRetry: true },
  );
  return response.data.data;
}

export async function uploadCompanyFile(
  companyId: string,
  file: File
): Promise<CompanyFile> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<{ success: boolean; data: CompanyFile }>(
    `/companies/${companyId}/files`,
    formData,
  );
  return response.data.data;
}

export async function deleteCompanyFile(
  companyId: string,
  fileId: string
): Promise<void> {
  await apiClient.delete(`/companies/${companyId}/files/${fileId}`);
}
