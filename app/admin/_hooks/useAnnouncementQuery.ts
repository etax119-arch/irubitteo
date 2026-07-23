'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { announcementKeys } from '@/lib/query/keys';
import { getAdminAnnouncements } from '@/lib/api/announcements';

export function useAdminAnnouncements(page = 1, limit = 12) {
  return useQuery({
    queryKey: announcementKeys.adminList({ page, limit }),
    queryFn: () => getAdminAnnouncements({ page, limit }),
    select: (data) => ({ announcements: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
