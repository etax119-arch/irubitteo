'use client';

import { useState, useCallback } from 'react';
import { MessageSquare, Bell, Edit } from 'lucide-react';
import { WorkerSelector } from '../_components/WorkerSelector';
import { NoticeHistory } from '../_components/NoticeHistory';
import { useNotices } from '../_hooks/useNoticeQuery';
import { useActiveEmployees } from '@/hooks/useEmployeeQuery';
import { useSendNotice, useDeleteNotice } from '../_hooks/useNoticeMutations';
import { useAuthStore } from '@/lib/auth/store';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
import { extractErrorMessage } from '@/lib/api/error';

export default function NoticesPage() {
  const user = useAuthStore((state) => state.user);
  const toast = useToast();
  const noticesQuery = useNotices();
  const employeesQuery = useActiveEmployees();
  const sendMutation = useSendNotice();
  const deleteMutation = useDeleteNotice();

  const [selectedWorkersForNotice, setSelectedWorkersForNotice] = useState<Set<string>>(new Set());
  const [noticeContent, setNoticeContent] = useState('');
  const [workerSearchQuery, setWorkerSearchQuery] = useState('');
  const [expandedNotices, setExpandedNotices] = useState<Set<string>>(new Set());

  const notices = noticesQuery.data ?? [];
  const employees = employeesQuery.data ?? [];

  const toggleWorkerForNotice = useCallback((workerId: string) => {
    setSelectedWorkersForNotice((prev) => {
      const next = new Set(prev);
      if (next.has(workerId)) next.delete(workerId);
      else next.add(workerId);
      return next;
    });
  }, []);

  const toggleAllWorkersForNotice = useCallback((filteredWorkerIds: string[]) => {
    setSelectedWorkersForNotice((prev) => {
      const allSelected = filteredWorkerIds.length > 0 && filteredWorkerIds.every((id) => prev.has(id));
      if (allSelected) {
        const next = new Set(prev);
        filteredWorkerIds.forEach((id) => next.delete(id));
        return next;
      } else {
        const next = new Set(prev);
        filteredWorkerIds.forEach((id) => next.add(id));
        return next;
      }
    });
  }, []);

  const toggleNoticeExpand = (noticeId: string) => {
    setExpandedNotices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noticeId)) {
        newSet.delete(noticeId);
      } else {
        newSet.add(noticeId);
      }
      return newSet;
    });
  };

  const handleDeleteNotice = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('공지사항이 삭제되었습니다.'),
      onError: (err) => toast.error(extractErrorMessage(err)),
    });
  };

  const handleSendNotice = () => {
    if (selectedWorkersForNotice.size === 0 || !noticeContent.trim()) return;

    sendMutation.mutate(
      {
        content: noticeContent,
        senderName: user?.name ?? '관리자',
        recipientIds: Array.from(selectedWorkersForNotice),
      },
      {
        onSuccess: () => {
          setSelectedWorkersForNotice(new Set());
          setNoticeContent('');
          setWorkerSearchQuery('');
          toast.success('공지사항이 성공적으로 발송되었습니다!');
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      }
    );
  };

  if (employeesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-48 h-8" />
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <Skeleton className="w-40 h-6 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
          <Skeleton className="w-full h-32 rounded-lg mb-6" />
          <div className="flex justify-end gap-3">
            <Skeleton className="w-20 h-10 rounded-lg" />
            <Skeleton className="w-28 h-10 rounded-lg" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <Skeleton className="w-24 h-6" />
          </div>
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-6 py-5">
                <Skeleton className="w-48 h-4 mb-3" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-duru-orange-600" />
          공지사항 관리
        </h2>
      </div>

      {/* 공지사항 발송 섹션 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-duru-orange-600" />
          새 공지사항 발송
        </h3>

        <WorkerSelector
          employees={employees}
          selectedWorkers={selectedWorkersForNotice}
          searchQuery={workerSearchQuery}
          onSearchChange={setWorkerSearchQuery}
          onToggleWorker={toggleWorkerForNotice}
          onToggleAll={toggleAllWorkersForNotice}
        />

        <div className="mb-6">
          <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Edit className="w-5 h-5 text-duru-orange-600" />
            공지사항 내용
          </h4>
          <Textarea
            value={noticeContent}
            onChange={(e) => setNoticeContent(e.target.value)}
            placeholder={`근로자들에게 전달할 공지사항을 작성해주세요.\n\n예)\n내일 오전 안전교육이 진행됩니다.\n필히 참석 부탁드립니다.`}
            rows={6}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedWorkersForNotice(new Set());
              setNoticeContent('');
              setWorkerSearchQuery('');
            }}
            className="px-6 py-3"
          >
            초기화
          </Button>
          <Button
            variant="primary"
            onClick={handleSendNotice}
            disabled={selectedWorkersForNotice.size === 0 || !noticeContent.trim() || sendMutation.isPending}
            leftIcon={<Bell className="w-5 h-5" />}
            className="px-8 py-3 text-lg"
          >
            {sendMutation.isPending ? '발송 중...' : '발송하기'}
          </Button>
        </div>
      </div>

      <NoticeHistory
        notices={notices}
        expandedNotices={expandedNotices}
        onToggleExpand={toggleNoticeExpand}
        isLoading={noticesQuery.isLoading}
        onDelete={handleDeleteNotice}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
