'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryKeys } from '@/lib/query/keys';
import { createGallery, updateGallery, deleteGallery } from '@/lib/api/galleries';
import type { GalleryCreateInput, GalleryUpdateInput } from '@/types/gallery';
import { revalidateGallery } from '../content/actions';

export function useCreateGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, image, onUploadProgress }: {
      input: GalleryCreateInput;
      image: File;
      onUploadProgress?: (progress: number) => void;
    }) => createGallery(input, image, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      revalidateGallery();
    },
  });
}

export function useUpdateGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input, image, onUploadProgress }: {
      id: string;
      input: GalleryUpdateInput;
      image?: File;
      onUploadProgress?: (progress: number) => void;
    }) => updateGallery(id, input, image, onUploadProgress),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      revalidateGallery(variables.id);
    },
  });
}

export function useDeleteGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGallery(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      revalidateGallery(id);
    },
  });
}
