import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { GalleryItem, GalleryCreateInput, GalleryUpdateInput } from '@/types/gallery';

// === Public endpoints ===

export async function getPublishedGalleries(
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<GalleryItem>> {
  const response = await apiClient.get<PaginatedResponse<GalleryItem>>('/galleries', { params });
  return response.data;
}

export async function getGalleryItem(id: string): Promise<{ success: boolean; data: GalleryItem }> {
  const response = await apiClient.get<{ success: boolean; data: GalleryItem }>(`/galleries/${id}`);
  return response.data;
}

// === Admin endpoints ===

export async function getAdminGalleries(
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<GalleryItem>> {
  const response = await apiClient.get<PaginatedResponse<GalleryItem>>('/admin/galleries', { params });
  return response.data;
}

export async function createGallery(
  input: GalleryCreateInput,
  image: File,
  onUploadProgress?: (progress: number) => void
): Promise<{ success: boolean; data: GalleryItem }> {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('title', input.title);
  formData.append('artistName', input.artistName);
  if (input.description) formData.append('description', input.description);
  if (input.disabilityType) formData.append('disabilityType', input.disabilityType);

  const response = await apiClient.post<{ success: boolean; data: GalleryItem }>(
    '/admin/galleries',
    formData,
    {
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }
  );
  return response.data;
}

export async function updateGallery(
  id: string,
  input: GalleryUpdateInput,
  image?: File,
  onUploadProgress?: (progress: number) => void
): Promise<{ success: boolean; data: GalleryItem }> {
  const formData = new FormData();
  if (image) formData.append('image', image);
  if (input.title !== undefined) formData.append('title', input.title);
  if (input.artistName !== undefined) formData.append('artistName', input.artistName);
  if (input.description !== undefined) formData.append('description', input.description);
  if (input.disabilityType !== undefined) formData.append('disabilityType', input.disabilityType);
  if (input.removeImage !== undefined) formData.append('removeImage', String(input.removeImage));
  if (input.isPublished !== undefined) formData.append('isPublished', String(input.isPublished));
  if (input.sortOrder !== undefined) formData.append('sortOrder', String(input.sortOrder));

  const response = await apiClient.patch<{ success: boolean; data: GalleryItem }>(
    `/admin/galleries/${id}`,
    formData,
    {
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }
  );
  return response.data;
}

export async function deleteGallery(id: string): Promise<void> {
  await apiClient.delete(`/admin/galleries/${id}`);
}
