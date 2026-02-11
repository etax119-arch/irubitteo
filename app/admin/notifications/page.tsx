'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { NoteUpdateAlertList } from '../_components/NoteUpdateAlertList';
import { AbsenceAlertList } from '../_components/AbsenceAlertList';
import { InquiryList } from '../_components/InquiryList';
import { InquiryDetailModal } from '../_components/InquiryDetailModal';
import {
  useNoteUpdateAlerts,
  useNotifAbsenceAlerts,
  usePendingInquiries,
  useDismissAbsenceAlert,
  useDismissNoteUpdate,
  useCompleteInquiry,
} from '@/hooks/useAdminNotificationsQuery';
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

  const dismissAbsence = useDismissAbsenceAlert();
  const dismissNote = useDismissNoteUpdate();
  const completeInq = useCompleteInquiry();

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

  if (noteQuery.isLoading || absenceQuery.isLoading || inquiryQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">알림 센터</h2>

      <NoteUpdateAlertList alerts={noteQuery.data ?? []} onDismiss={handleDismissNoteUpdate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AbsenceAlertList alerts={absenceQuery.data ?? []} onDismiss={handleDismissAlert} />
        <InquiryList inquiries={inquiryQuery.data ?? []} onViewDetail={setSelectedInquiry} />
      </div>

      <InquiryDetailModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onComplete={handleInquiryComplete}
      />
    </div>
  );
}
