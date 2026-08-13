'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storyKeys } from '@/lib/query/keys';
import { createStory, updateStory, deleteStory } from '@/lib/api/stories';
import type { StoryCreateInput, StoryUpdateInput } from '@/types/story';
import { revalidateStory } from '../content/actions';

export function useCreateStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, images, coverImage, onUploadProgress }: {
      input: StoryCreateInput;
      images?: File[];
      coverImage?: File | null;
      onUploadProgress?: (progress: number) => void;
    }) => createStory(input, images ?? [], coverImage, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
      revalidateStory();
    },
  });
}

export function useUpdateStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input, newImages, coverImage, onUploadProgress }: {
      id: string;
      input: StoryUpdateInput;
      newImages?: File[];
      coverImage?: File | null;
      onUploadProgress?: (progress: number) => void;
    }) => updateStory(id, input, newImages ?? [], coverImage, onUploadProgress),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
      revalidateStory(variables.id);
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStory(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
      revalidateStory(id);
    },
  });
}
