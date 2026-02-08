import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { CompanyWithEmployeeCount, CompanyQueryParams, CompanyCreateInput } from '@/types/company';

export async function getCompanies(
  params?: CompanyQueryParams
): Promise<PaginatedResponse<CompanyWithEmployeeCount>> {
  const response = await apiClient.get<PaginatedResponse<CompanyWithEmployeeCount>>(
    '/companies',
    { params }
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
