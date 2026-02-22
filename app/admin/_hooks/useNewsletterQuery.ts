'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { newsletterKeys } from '@/lib/query/keys';
import { getAdminNewsletters } from '@/lib/api/newsletters';

export function useAdminNewsletters(page = 1, limit = 12) {
  return useQuery({
    queryKey: newsletterKeys.adminList({ page, limit }),
    queryFn: () => getAdminNewsletters({ page, limit }),
    select: (data) => ({ newsletters: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
