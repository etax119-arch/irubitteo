import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { Inquiry, InquiryCreateInput, InquiryQueryParams } from '@/types/inquiry';

export async function getInquiries(
  params?: InquiryQueryParams
): Promise<PaginatedResponse<Inquiry>> {
  const response = await apiClient.get<PaginatedResponse<Inquiry>>(
    '/inquiries',
    { params }
  );
  return response.data;
}

export async function createInquiry(
  data: InquiryCreateInput
): Promise<{ success: boolean; data: Inquiry }> {
  const response = await apiClient.post<{ success: boolean; data: Inquiry }>(
    '/inquiries',
    data
  );
  return response.data;
}

export async function completeInquiry(
  id: string
): Promise<{ success: boolean; data: Inquiry }> {
  const response = await apiClient.patch<{ success: boolean; data: Inquiry }>(
    `/inquiries/${id}/complete`
  );
  return response.data;
}
