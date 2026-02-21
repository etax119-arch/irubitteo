import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dismissAbsenceAlert, dismissNoteUpdate } from '@/lib/api/admin';
import { completeInquiry } from '@/lib/api/inquiries';
import { reviewResume } from '@/lib/api/resumes';
import { adminKeys, inquiryKeys, resumeKeys } from '@/lib/query/keys';
import type { NoteUpdateAlert, AbsenceAlert } from '@/types/adminDashboard';
import type { Inquiry } from '@/types/inquiry';
import type { Resume } from '@/types/resume';
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
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
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
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
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
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

export function useReviewResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resumeId: string) => reviewResume(resumeId),
    onSuccess: (_data, resumeId) => {
      queryClient.setQueryData<PaginatedResponse<Resume>>(resumeKeys.pending(), (old) => {
        if (!old) return old;
        return { ...old, data: old.data.filter((r) => r.id !== resumeId) };
      });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}
