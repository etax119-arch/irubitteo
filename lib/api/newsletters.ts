import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { NewsletterItem, NewsletterCreateInput, NewsletterUpdateInput } from '@/types/newsletter';

export async function getPublishedNewsletters(
  params?: { page?: number; limit?: number; search?: string }
): Promise<PaginatedResponse<NewsletterItem>> {
  const response = await apiClient.get<PaginatedResponse<NewsletterItem>>('/newsletters', { params });
  return response.data;
}

export async function getNewsletter(id: string): Promise<{ success: boolean; data: NewsletterItem }> {
  const response = await apiClient.get<{ success: boolean; data: NewsletterItem }>(`/newsletters/${id}`);
  return response.data;
}

export async function getAdminNewsletters(
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<NewsletterItem>> {
  const response = await apiClient.get<PaginatedResponse<NewsletterItem>>('/admin/newsletters', { params });
  return response.data;
}

export async function createNewsletter(
  input: NewsletterCreateInput,
  images: File[] = [],
  coverImage?: File | null,
  onUploadProgress?: (progress: number) => void
): Promise<{ success: boolean; data: NewsletterItem }> {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('content', input.content);
  if (input.videoUrl) formData.append('videoUrl', input.videoUrl);
  if (coverImage) formData.append('coverImage', coverImage);
  for (const image of images) {
    formData.append('images', image);
  }

  const response = await apiClient.post<{ success: boolean; data: NewsletterItem }>(
    '/admin/newsletters',
    formData,
    {
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }
  );
  return response.data;
}

export async function updateNewsletter(
  id: string,
  input: NewsletterUpdateInput,
  newImages: File[] = [],
  coverImage?: File | null,
  onUploadProgress?: (progress: number) => void
): Promise<{ success: boolean; data: NewsletterItem }> {
  const formData = new FormData();
  for (const image of newImages) {
    formData.append('images', image);
  }
  if (coverImage) formData.append('coverImage', coverImage);
  if (input.title !== undefined) formData.append('title', input.title);
  if (input.content !== undefined) formData.append('content', input.content);
  if (input.isPublished !== undefined) formData.append('isPublished', String(input.isPublished));
  if (input.videoUrl !== undefined) formData.append('videoUrl', input.videoUrl ?? '');
  if (input.deleteCoverImage) formData.append('deleteCoverImage', 'true');
  if (input.deleteImageIds) {
    for (const imageId of input.deleteImageIds) {
      formData.append('deleteImageIds', imageId);
    }
  }

  const response = await apiClient.patch<{ success: boolean; data: NewsletterItem }>(
    `/admin/newsletters/${id}`,
    formData,
    {
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }
  );
  return response.data;
}

export async function deleteNewsletter(id: string): Promise<void> {
  await apiClient.delete(`/admin/newsletters/${id}`);
}
