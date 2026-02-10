'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { NoteUpdateAlertList } from '../_components/NoteUpdateAlertList';
import { AbsenceAlertList } from '../_components/AbsenceAlertList';
import { InquiryList } from '../_components/InquiryList';
import { InquiryDetailModal } from '../_components/InquiryDetailModal';
import { getAbsenceAlerts, getNoteUpdates, dismissAbsenceAlert, dismissNoteUpdate } from '@/lib/api/admin';
import { getInquiries, completeInquiry } from '@/lib/api/inquiries';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { AbsenceAlert, NoteUpdateAlert } from '@/types/adminDashboard';
import type { Inquiry } from '@/types/inquiry';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const toast = useToast();
  const [noteAlerts, setNoteAlerts] = useState<NoteUpdateAlert[]>([]);
  const [absenceAlertList, setAbsenceAlertList] = useState<AbsenceAlert[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [noteRes, absenceRes, inquiryRes] = await Promise.all([
        getNoteUpdates(10),
        getAbsenceAlerts(3, 1, 20),
        getInquiries({ status: 'pending', limit: 20 }),
      ]);
      setNoteAlerts(noteRes);
      setAbsenceAlertList(absenceRes.data);
      setInquiries(inquiryRes.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDismissAlert = async (alertId: string, employeeId: string) => {
    try {
      await dismissAbsenceAlert(alertId);
      setAbsenceAlertList((prev) => prev.filter((a) => a.id !== alertId));
      toast.success('알림을 확인했습니다.');
      router.push(`/admin/employees/${employeeId}`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDismissNoteUpdate = async (employeeId: string) => {
    try {
      await dismissNoteUpdate(employeeId);
      setNoteAlerts((prev) => prev.filter((a) => a.employeeId !== employeeId));
      toast.success('알림을 확인했습니다.');
      router.push(`/admin/employees/${employeeId}`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleInquiryComplete = async (inquiryId: string) => {
    try {
      await completeInquiry(inquiryId);
      setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
      toast.success('문의가 완료 처리되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">알림 센터</h2>

      <NoteUpdateAlertList alerts={noteAlerts} onDismiss={handleDismissNoteUpdate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AbsenceAlertList alerts={absenceAlertList} onDismiss={handleDismissAlert} />
        <InquiryList inquiries={inquiries} onViewDetail={setSelectedInquiry} />
      </div>

      <InquiryDetailModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onComplete={handleInquiryComplete}
      />
    </div>
  );
}
