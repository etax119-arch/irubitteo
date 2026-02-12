import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dismissAbsenceAlert, dismissNoteUpdate } from '@/lib/api/admin';
import { completeInquiry } from '@/lib/api/inquiries';
import { adminKeys, inquiryKeys } from '@/lib/query/keys';
import type { NoteUpdateAlert, AbsenceAlert } from '@/types/adminDashboard';
import type { Inquiry } from '@/types/inquiry';
import type { PaginatedResponse } from '@/types/api';

export function useDismissAbsenceAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => dismissAbsenceAlert(alertId),
    onSuccess: (_data, alertId) => {
      queryClient.setQueryData<PaginatedResponse<AbsenceAlert>>(adminKeys.notifAbsenceAlerts(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data.filter((a) => a.id !== alertId) };
      });
      queryClient.invalidateQueries({ queryKey: adminKeys.absenceAlerts() });
    },
  });
}

export function useDismissNoteUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) => dismissNoteUpdate(employeeId),
    onSuccess: (_data, employeeId) => {
      queryClient.setQueryData<NoteUpdateAlert[]>(adminKeys.noteUpdates(), (old) =>
        old?.filter((a) => a.employeeId !== employeeId)
      );
    },
  });
}

export function useCompleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inquiryId: string) => completeInquiry(inquiryId),
    onSuccess: (_data, inquiryId) => {
      queryClient.setQueryData<PaginatedResponse<Inquiry>>(inquiryKeys.pending(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data.filter((inq) => inq.id !== inquiryId) };
      });
    },
  });
}
