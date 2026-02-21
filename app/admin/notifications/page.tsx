'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton';
import { NoteUpdateAlertList } from '../_components/NoteUpdateAlertList';
import { AbsenceAlertList } from '../_components/AbsenceAlertList';
import { InquiryList } from '../_components/InquiryList';
import { ResumeList } from '../_components/ResumeList';
import { InquiryDetailModal } from '../_components/InquiryDetailModal';
import {
  useNoteUpdateAlerts,
  useNotifAbsenceAlerts,
  usePendingInquiries,
  usePendingResumes,
} from '../_hooks/useAdminNotificationQuery';
import {
  useDismissAbsenceAlert,
  useDismissNoteUpdate,
  useCompleteInquiry,
  useReviewResume,
} from '../_hooks/useAdminNotificationMutations';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { Inquiry } from '@/types/inquiry';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const toast = useToast();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const noteQuery = useNoteUpdateAlerts();
  const absenceQuery = useNotifAbsenceAlerts();
  const inquiryQuery = usePendingInquiries();
  const resumeQuery = usePendingResumes();

  const dismissAbsence = useDismissAbsenceAlert();
  const dismissNote = useDismissNoteUpdate();
  const completeInq = useCompleteInquiry();
  const reviewRes = useReviewResume();

  const handleDismissAlert = (alertId: string, employeeId: string) => {
    dismissAbsence.mutate(alertId, {
      onSuccess: () => {
        toast.success('알림을 확인했습니다.');
        router.push(`/admin/employees/${employeeId}`);
      },
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  const handleDismissNoteUpdate = (employeeId: string) => {
    dismissNote.mutate(employeeId, {
      onSuccess: () => {
        toast.success('알림을 확인했습니다.');
        router.push(`/admin/employees/${employeeId}`);
      },
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  const handleInquiryComplete = (inquiryId: string) => {
    completeInq.mutate(inquiryId, {
      onSuccess: () => toast.success('문의가 완료 처리되었습니다.'),
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  const handleResumeReview = (resumeId: string) => {
    reviewRes.mutate(resumeId, {
      onSuccess: () => toast.success('이력서 확인이 완료되었습니다.'),
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  if (noteQuery.isLoading || absenceQuery.isLoading || inquiryQuery.isLoading || resumeQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-32 h-8" />
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <Skeleton className="w-40 h-6 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="w-48 h-4 mb-2" />
                  <Skeleton className="w-32 h-3" />
                </div>
                <Skeleton className="w-16 h-8 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <Skeleton className="w-32 h-6 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-16 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">알림 센터</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AbsenceAlertList alerts={absenceQuery.data ?? []} onDismiss={handleDismissAlert} />
        <InquiryList inquiries={inquiryQuery.data ?? []} onViewDetail={setSelectedInquiry} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResumeList resumes={resumeQuery.data ?? []} onReview={handleResumeReview} />
        <NoteUpdateAlertList alerts={noteQuery.data ?? []} onDismiss={handleDismissNoteUpdate} />
      </div>

      <InquiryDetailModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onComplete={handleInquiryComplete}
      />
    </div>
  );
}
