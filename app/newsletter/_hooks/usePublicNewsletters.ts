'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { newsletterKeys } from '@/lib/query/keys';
import { getPublishedNewsletters } from '@/lib/api/newsletters';
import type { NewsletterItem } from '@/types/newsletter';
import type { PaginatedResponse } from '@/types/api';

export function usePublicNewsletters(
  page = 1,
  limit = 12,
  search = '',
  initialData?: PaginatedResponse<NewsletterItem>,
) {
  return useQuery({
    queryKey: newsletterKeys.publicList({ page, limit, search: search || undefined }),
    queryFn: () => getPublishedNewsletters({ page, limit, search: search || undefined }),
    select: (data) => ({ newsletters: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...(page === 1 && !search && initialData ? { initialData } : {}),
  });
}
