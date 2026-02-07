import apiClient from './client';
import type { CompanyEmployee } from '@/types/companyDashboard';

export interface EmployeeQueryParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedEmployeesResponse {
  success: boolean;
  data: CompanyEmployee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getEmployees(
  params?: EmployeeQueryParams
): Promise<PaginatedEmployeesResponse> {
  const response = await apiClient.get<PaginatedEmployeesResponse>(
    '/employees',
    { params }
  );
  return response.data;
}

export async function getEmployee(
  id: string
): Promise<{ success: boolean; data: CompanyEmployee }> {
  const response = await apiClient.get<{ success: boolean; data: CompanyEmployee }>(
    `/employees/${id}`
  );
  return response.data;
}

export interface UpdateEmployeeInput {
  workDays?: number[];
  workStartTime?: string;
  disabilitySeverity?: string | null;
  disabilityRecognitionDate?: string | null;
  companyNote?: string | null;
}

export async function updateEmployee(
  id: string,
  data: UpdateEmployeeInput
): Promise<{ success: boolean; data: CompanyEmployee }> {
  const response = await apiClient.patch<{ success: boolean; data: CompanyEmployee }>(
    `/employees/${id}`,
    data
  );
  return response.data;
}
