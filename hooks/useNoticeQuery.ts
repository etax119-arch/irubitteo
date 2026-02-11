import { useQuery } from '@tanstack/react-query';
import { noticeApi } from '@/lib/api/notices';
import { noticeKeys } from '@/lib/query/keys';

export function useNotices() {
  return useQuery({
    queryKey: noticeKeys.list(),
    queryFn: () => noticeApi.getList(),
    select: (data) => data.data,
  });
}
