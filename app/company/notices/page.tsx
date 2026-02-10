'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Bell, Edit } from 'lucide-react';
import { WorkerSelector } from '../_components/WorkerSelector';
import { NoticeHistory } from '../_components/NoticeHistory';
import { useNotice } from '@/hooks/useNotice';
import { useAuthStore } from '@/lib/auth/store';
import { useToast } from '@/components/ui/Toast';
import { getEmployees } from '@/lib/api/employees';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import type { Employee } from '@/types/employee';

export default function NoticesPage() {
  const user = useAuthStore((state) => state.user);
  const toast = useToast();
  const { notices, isLoading, isSending, isDeleting, fetchNotices, sendNotice, deleteNotice } = useNotice();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [selectedWorkersForNotice, setSelectedWorkersForNotice] = useState<string[]>([]);
  const [noticeContent, setNoticeContent] = useState('');
  const [workerSearchQuery, setWorkerSearchQuery] = useState('');
  const [expandedNotices, setExpandedNotices] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  useEffect(() => {
    let ignore = false;
    const loadEmployees = async () => {
      try {
        // 공지 대상 직원 목록 전체 조회 (합리적 상한)
        const result = await getEmployees({ isActive: true, limit: 500 });
        if (!ignore) setEmployees(result.data);
      } catch {
        if (!ignore) toast.error('직원 목록을 불러오는데 실패했습니다.');
      } finally {
        if (!ignore) setEmployeesLoading(false);
      }
    };
    loadEmployees();
    return () => { ignore = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- toast is a Zustand selector; stable in practice but creates new object ref each render
  }, []);

  const toggleWorkerForNotice = (workerId: string) => {
    setSelectedWorkersForNotice((prev) =>
      prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]
    );
  };

  const toggleAllWorkersForNotice = () => {
    if (selectedWorkersForNotice.length === employees.length) {
      setSelectedWorkersForNotice([]);
    } else {
      setSelectedWorkersForNotice(employees.map((e) => e.id));
    }
  };

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

  const handleDeleteNotice = async (id: string) => {
    const success = await deleteNotice(id);
    if (success) {
      toast.success('공지사항이 삭제되었습니다.');
    } else {
      toast.error('공지사항 삭제에 실패했습니다.');
    }
  };

  const handleSendNotice = async () => {
    if (selectedWorkersForNotice.length === 0 || !noticeContent.trim()) return;

    const result = await sendNotice({
      content: noticeContent,
      senderName: user?.name ?? '관리자',
      recipientIds: selectedWorkersForNotice,
    });

    if (result) {
      setSelectedWorkersForNotice([]);
      setNoticeContent('');
      setWorkerSearchQuery('');
      toast.success('공지사항이 성공적으로 발송되었습니다!');
    } else {
      toast.error('공지사항 발송에 실패했습니다.');
    }
  };

  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center py-20" role="status">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duru-orange-500" />
        <span className="sr-only">로딩 중</span>
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
              setSelectedWorkersForNotice([]);
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
            disabled={selectedWorkersForNotice.length === 0 || !noticeContent.trim() || isSending}
            leftIcon={<Bell className="w-5 h-5" />}
            className="px-8 py-3 text-lg"
          >
            {isSending ? '발송 중...' : '발송하기'}
          </Button>
        </div>
      </div>

      <NoticeHistory
        notices={notices}
        expandedNotices={expandedNotices}
        onToggleExpand={toggleNoticeExpand}
        isLoading={isLoading}
        onDelete={handleDeleteNotice}
        isDeleting={isDeleting}
      />
    </div>
  );
}
