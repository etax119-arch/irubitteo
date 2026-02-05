'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AbsenceAlertList } from '../_components/AbsenceAlertList';
import { InquiryList } from '../_components/InquiryList';
import { InquiryDetailModal } from '../_components/InquiryDetailModal';
import { absenceAlerts, inquiryList as initialInquiries, workersData } from '../_data/dummyData';
import type { Inquiry } from '@/types/adminDashboard';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const handleViewWorkerDetail = (name: string) => {
    const worker = workersData.find((w) => w.name === name);
    if (worker) {
      router.push(`/admin/employees/${worker.id}`);
    }
  };

  const handleInquiryComplete = (inquiryId: number) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900">알림 센터</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 장애인 근로자 결근 알림 */}
        <AbsenceAlertList alerts={absenceAlerts} onViewDetail={handleViewWorkerDetail} />

        {/* 우측: 신규 기업 문의 알림 */}
        <InquiryList inquiries={inquiries} onViewDetail={setSelectedInquiry} />
      </div>

      {/* 문의 상세 모달 */}
      <InquiryDetailModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onComplete={handleInquiryComplete}
      />
    </div>
  );
}
