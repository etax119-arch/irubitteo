import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { AnnouncementItem, AnnouncementCreateInput, AnnouncementUpdateInput } from '@/types/announcement';

export async function getPublishedAnnouncements(
  params?: { page?: number; limit?: number; search?: string }
): Promise<PaginatedResponse<AnnouncementItem>> {
  const response = await apiClient.get<PaginatedResponse<AnnouncementItem>>('/announcements', { params });
  return response.data;
}

export async function getAnnouncement(id: string): Promise<{ success: boolean; data: AnnouncementItem }> {
  const response = await apiClient.get<{ success: boolean; data: AnnouncementItem }>(`/announcements/${id}`);
  return response.data;
}

export async function getAdminAnnouncements(
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<AnnouncementItem>> {
  const response = await apiClient.get<PaginatedResponse<AnnouncementItem>>('/admin/announcements', { params });
  return response.data;
}

export async function createAnnouncement(
  input: AnnouncementCreateInput,
  images: File[] = [],
  onUploadProgress?: (progress: number) => void
): Promise<{ success: boolean; data: AnnouncementItem }> {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('content', input.content);
  for (const image of images) {
    formData.append('images', image);
  }

  const response = await apiClient.post<{ success: boolean; data: AnnouncementItem }>(
    '/admin/announcements',
    formData,
    {
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }
  );
  return response.data;
}

export async function updateAnnouncement(
  id: string,
  input: AnnouncementUpdateInput,
  newImages: File[] = [],
  onUploadProgress?: (progress: number) => void
): Promise<{ success: boolean; data: AnnouncementItem }> {
  const formData = new FormData();
  for (const image of newImages) {
    formData.append('images', image);
  }
  if (input.title !== undefined) formData.append('title', input.title);
  if (input.content !== undefined) formData.append('content', input.content);
  if (input.isPublished !== undefined) formData.append('isPublished', String(input.isPublished));
  if (input.deleteImageIds) {
    for (const imageId of input.deleteImageIds) {
      formData.append('deleteImageIds', imageId);
    }
  }

  const response = await apiClient.patch<{ success: boolean; data: AnnouncementItem }>(
    `/admin/announcements/${id}`,
    formData,
    {
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }
  );
  return response.data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await apiClient.delete(`/admin/announcements/${id}`);
}
