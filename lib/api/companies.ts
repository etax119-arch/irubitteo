import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { CompanyWithEmployeeCount, CompanyQueryParams, CompanyCreateInput, CompanyUpdateInput } from '@/types/company';

export async function getCompanies(
  params?: CompanyQueryParams
): Promise<PaginatedResponse<CompanyWithEmployeeCount>> {
  const response = await apiClient.get<PaginatedResponse<CompanyWithEmployeeCount>>(
    '/companies',
    { params }
  );
  return response.data;
}

export async function getCompany(
  id: string
): Promise<{ success: boolean; data: CompanyWithEmployeeCount }> {
  const response = await apiClient.get<{ success: boolean; data: CompanyWithEmployeeCount }>(
    `/companies/${id}`
  );
  return response.data;
}

export async function createCompany(
  data: CompanyCreateInput
): Promise<{ success: boolean; data: CompanyWithEmployeeCount }> {
  const response = await apiClient.post<{ success: boolean; data: CompanyWithEmployeeCount }>(
    '/companies',
    data
  );
  return response.data;
}

export async function updateCompany(
  id: string,
  data: CompanyUpdateInput & { isActive?: boolean; resignDate?: string | null; resignReason?: string | null }
): Promise<{ success: boolean; data: CompanyWithEmployeeCount }> {
  const response = await apiClient.patch<{ success: boolean; data: CompanyWithEmployeeCount }>(
    `/companies/${id}`,
    data
  );
  return response.data;
}

export async function deleteCompany(
  id: string
): Promise<{ success: boolean }> {
  const response = await apiClient.delete<{ success: boolean }>(
    `/companies/${id}`
  );
  return response.data;
}
