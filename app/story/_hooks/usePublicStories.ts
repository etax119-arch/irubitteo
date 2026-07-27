'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { storyKeys } from '@/lib/query/keys';
import { getPublishedStories } from '@/lib/api/stories';
import type { StoryItem } from '@/types/story';
import type { PaginatedResponse } from '@/types/api';

export function usePublicStories(
  page = 1,
  limit = 12,
  search = '',
  initialData?: PaginatedResponse<StoryItem>,
) {
  return useQuery({
    queryKey: storyKeys.publicList({ page, limit, search: search || undefined }),
    queryFn: () => getPublishedStories({ page, limit, search: search || undefined }),
    select: (data) => ({ stories: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...(page === 1 && !search && initialData ? { initialData } : {}),
  });
}
