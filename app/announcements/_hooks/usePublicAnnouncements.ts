'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { announcementKeys } from '@/lib/query/keys';
import { getPublishedAnnouncements } from '@/lib/api/announcements';
import type { AnnouncementItem } from '@/types/announcement';
import type { PaginatedResponse } from '@/types/api';

export function usePublicAnnouncements(
  page = 1,
  limit = 12,
  search = '',
  initialData?: PaginatedResponse<AnnouncementItem>,
) {
  return useQuery({
    queryKey: announcementKeys.publicList({ page, limit, search: search || undefined }),
    queryFn: () => getPublishedAnnouncements({ page, limit, search: search || undefined }),
    select: (data) => ({ announcements: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...(page === 1 && !search && initialData ? { initialData } : {}),
  });
}
