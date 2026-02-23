'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { newsletterKeys } from '@/lib/query/keys';
import { createNewsletter, updateNewsletter, deleteNewsletter } from '@/lib/api/newsletters';
import type { NewsletterCreateInput, NewsletterUpdateInput } from '@/types/newsletter';
import { revalidateNewsletter } from '../content/actions';

export function useCreateNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, image, onUploadProgress }: {
      input: NewsletterCreateInput;
      image?: File;
      onUploadProgress?: (progress: number) => void;
    }) => createNewsletter(input, image, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      revalidateNewsletter();
    },
  });
}

export function useUpdateNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input, image, onUploadProgress }: {
      id: string;
      input: NewsletterUpdateInput;
      image?: File;
      onUploadProgress?: (progress: number) => void;
    }) => updateNewsletter(id, input, image, onUploadProgress),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      revalidateNewsletter(variables.id);
    },
  });
}

export function useDeleteNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNewsletter(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      revalidateNewsletter(id);
    },
  });
}
