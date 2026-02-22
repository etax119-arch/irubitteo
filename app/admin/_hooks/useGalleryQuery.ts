'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { galleryKeys } from '@/lib/query/keys';
import { getAdminGalleries } from '@/lib/api/galleries';

export function useAdminGalleries(page = 1, limit = 12) {
  return useQuery({
    queryKey: galleryKeys.adminList({ page, limit }),
    queryFn: () => getAdminGalleries({ page, limit }),
    select: (data) => ({ galleries: data.data, pagination: data.pagination }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
