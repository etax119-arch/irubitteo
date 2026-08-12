'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementKeys } from '@/lib/query/keys';
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/api/announcements';
import type { AnnouncementCreateInput, AnnouncementUpdateInput } from '@/types/announcement';
import { revalidateAnnouncement } from '../content/actions';

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, images, onUploadProgress }: {
      input: AnnouncementCreateInput;
      images?: File[];
      onUploadProgress?: (progress: number) => void;
    }) => createAnnouncement(input, images ?? [], onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      revalidateAnnouncement();
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input, newImages, onUploadProgress }: {
      id: string;
      input: AnnouncementUpdateInput;
      newImages?: File[];
      onUploadProgress?: (progress: number) => void;
    }) => updateAnnouncement(id, input, newImages ?? [], onUploadProgress),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      revalidateAnnouncement(variables.id);
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      revalidateAnnouncement(id);
    },
  });
}
