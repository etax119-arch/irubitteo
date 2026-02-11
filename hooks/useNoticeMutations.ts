import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noticeApi } from '@/lib/api/notices';
import { noticeKeys } from '@/lib/query/keys';
import type { NoticeCreateInput } from '@/types/notice';

export function useSendNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NoticeCreateInput) => noticeApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noticeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
}
