import { useQuery } from '@tanstack/react-query';
import { getNoteUpdates, getAbsenceAlerts } from '@/lib/api/admin';
import { getInquiries } from '@/lib/api/inquiries';
import { getResumes } from '@/lib/api/resumes';
import { adminKeys, inquiryKeys, resumeKeys } from '@/lib/query/keys';

const NOTIFICATIONS_STALE_TIME = 30 * 1000;

export function useNoteUpdateAlerts() {
  return useQuery({
    queryKey: adminKeys.noteUpdates(),
    queryFn: () => getNoteUpdates(10),
    staleTime: NOTIFICATIONS_STALE_TIME,
  });
}

export function useNotifAbsenceAlerts() {
  return useQuery({
    queryKey: adminKeys.notifAbsenceAlerts(),
    queryFn: () => getAbsenceAlerts(3, 1, 20),
    select: (data) => data.data,
    staleTime: NOTIFICATIONS_STALE_TIME,
  });
}

export function usePendingInquiries() {
  return useQuery({
    queryKey: inquiryKeys.pending(),
    queryFn: () => getInquiries({ status: 'pending', limit: 20 }),
    select: (data) => data.data,
    staleTime: NOTIFICATIONS_STALE_TIME,
  });
}

export function usePendingResumes() {
  return useQuery({
    queryKey: resumeKeys.pending(),
    queryFn: () => getResumes({ status: 'pending', limit: 20 }),
    select: (data) => data.data,
    staleTime: NOTIFICATIONS_STALE_TIME,
  });
}
