import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { Employee, EmployeeQueryParams, EmployeeCreateInput, EmployeeUpdateInput } from '@/types/employee';

export async function getMyEmployeeProfile(): Promise<{ success: boolean; data: Employee }> {
  const response = await apiClient.get<{ success: boolean; data: Employee }>(
    '/employees/me'
  );
  return response.data;
}

export async function getEmployees(
  params?: EmployeeQueryParams
): Promise<PaginatedResponse<Employee>> {
  const response = await apiClient.get<PaginatedResponse<Employee>>(
    '/employees',
    { params }
  );
  return response.data;
}

export async function getEmployee(
  id: string
): Promise<{ success: boolean; data: Employee }> {
  const response = await apiClient.get<{ success: boolean; data: Employee }>(
    `/employees/${id}`
  );
  return response.data;
}

export async function createEmployee(
  data: EmployeeCreateInput
): Promise<{ success: boolean; data: Employee }> {
  const response = await apiClient.post<{ success: boolean; data: Employee }>(
    '/employees',
    data
  );
  return response.data;
}

export async function updateEmployee(
  id: string,
  data: EmployeeUpdateInput
): Promise<{ success: boolean; data: Employee }> {
  const response = await apiClient.patch<{ success: boolean; data: Employee }>(
    `/employees/${id}`,
    data
  );
  return response.data;
}

export async function uploadProfileImage(
  id: string,
  imageBlob: Blob
): Promise<{ success: boolean; data: Employee }> {
  const formData = new FormData();
  formData.append('image', imageBlob, 'profile.jpg');
  const response = await apiClient.patch<{ success: boolean; data: Employee }>(
    `/employees/${id}/profile-image`,
    formData
  );
  return response.data;
}

export async function deleteEmployee(
  id: string
): Promise<{ success: boolean }> {
  const response = await apiClient.delete<{ success: boolean }>(
    `/employees/${id}`
  );
  return response.data;
}

export async function deleteProfileImage(
  id: string
): Promise<{ success: boolean; data: Employee }> {
  const response = await apiClient.delete<{ success: boolean; data: Employee }>(
    `/employees/${id}/profile-image`
  );
  return response.data;
}
