'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { storyKeys } from '@/lib/query/keys';
import { getAdminStories } from '@/lib/api/stories';

export function useAdminStories(page = 1, limit = 12) {
  return useQuery({
    queryKey: storyKeys.adminList({ page, limit }),
    queryFn: () => getAdminStories({ page, limit }),
    select: (data) => ({ stories: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
