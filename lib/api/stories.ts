import apiClient from './client';
import type { PaginatedResponse } from '@/types/api';
import type { StoryItem, StoryCreateInput, StoryUpdateInput } from '@/types/story';

export async function getPublishedStories(
  params?: { page?: number; limit?: number; search?: string }
): Promise<PaginatedResponse<StoryItem>> {
  const response = await apiClient.get<PaginatedResponse<StoryItem>>('/stories', { params });
  return response.data;
}

export async function getStory(id: string): Promise<{ success: boolean; data: StoryItem }> {
  const response = await apiClient.get<{ success: boolean; data: StoryItem }>(`/stories/${id}`);
  return response.data;
}

export async function getAdminStories(
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<StoryItem>> {
  const response = await apiClient.get<PaginatedResponse<StoryItem>>('/admin/stories', { params });
  return response.data;
}

export async function createStory(
  input: StoryCreateInput,
  images: File[] = [],
  onUploadProgress?: (progress: number) => void
): Promise<{ success: boolean; data: StoryItem }> {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('content', input.content);
  for (const image of images) {
    formData.append('images', image);
  }

  const response = await apiClient.post<{ success: boolean; data: StoryItem }>(
    '/admin/stories',
    formData,
    {
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }
  );
  return response.data;
}

export async function updateStory(
  id: string,
  input: StoryUpdateInput,
  newImages: File[] = [],
  onUploadProgress?: (progress: number) => void
): Promise<{ success: boolean; data: StoryItem }> {
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

  const response = await apiClient.patch<{ success: boolean; data: StoryItem }>(
    `/admin/stories/${id}`,
    formData,
    {
      onUploadProgress: onUploadProgress
        ? (e) => onUploadProgress(Math.round((e.loaded * 100) / (e.total ?? 1)))
        : undefined,
    }
  );
  return response.data;
}

export async function deleteStory(id: string): Promise<void> {
  await apiClient.delete(`/admin/stories/${id}`);
}
