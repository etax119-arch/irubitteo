'use client';

import { useState } from 'react';
import { MessageSquare, Bell, Edit } from 'lucide-react';
import type { SentNotice } from '@/types/companyDashboard';
import { WorkerSelector } from '../_components/WorkerSelector';
import { NoticeHistory } from '../_components/NoticeHistory';
import { initialEmployees, initialNotices } from '../_data/dummyData';

export default function NoticesPage() {
  const [employees] = useState(initialEmployees);
  const [selectedWorkersForNotice, setSelectedWorkersForNotice] = useState<string[]>([]);
  const [noticeContent, setNoticeContent] = useState('');
  const [workerSearchQuery, setWorkerSearchQuery] = useState('');
  const [sentNotices, setSentNotices] = useState<SentNotice[]>(initialNotices);
  const [expandedNotices, setExpandedNotices] = useState<Set<number>>(new Set());

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

  const toggleNoticeExpand = (noticeId: number) => {
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

  const handleSendNotice = () => {
    if (selectedWorkersForNotice.length === 0 || !noticeContent.trim()) return;

    const selectedWorkerNames = employees
      .filter((e) => selectedWorkersForNotice.includes(e.id))
      .map((e) => e.name);

    const newNotice: SentNotice = {
      id: Date.now(),
      date: new Date()
        .toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(/\. /g, '-')
        .replace('.', ''),
      workers: selectedWorkerNames,
      content: noticeContent,
      sender: '관리자',
    };

    setSentNotices((prev) => [newNotice, ...prev]);
    setSelectedWorkersForNotice([]);
    setNoticeContent('');
    setWorkerSearchQuery('');
    alert('공지사항이 성공적으로 발송되었습니다!');
  };

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

        {/* 근로자 선택 */}
        <WorkerSelector
          employees={employees}
          selectedWorkers={selectedWorkersForNotice}
          searchQuery={workerSearchQuery}
          onSearchChange={setWorkerSearchQuery}
          onToggleWorker={toggleWorkerForNotice}
          onToggleAll={toggleAllWorkersForNotice}
        />

        {/* 공지사항 작성 */}
        <div className="mb-6">
          <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Edit className="w-5 h-5 text-duru-orange-600" />
            공지사항 내용
          </h4>
          <textarea
            value={noticeContent}
            onChange={(e) => setNoticeContent(e.target.value)}
            placeholder={`근로자들에게 전달할 공지사항을 작성해주세요.\n\n예)\n내일 오전 안전교육이 진행됩니다.\n필히 참석 부탁드립니다.`}
            rows={6}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent resize-none placeholder:text-gray-400 leading-relaxed"
          />
        </div>

        {/* 발송 버튼 */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              setSelectedWorkersForNotice([]);
              setNoticeContent('');
              setWorkerSearchQuery('');
            }}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
          <button
            onClick={handleSendNotice}
            disabled={selectedWorkersForNotice.length === 0 || !noticeContent.trim()}
            className="px-8 py-3 bg-duru-orange-500 text-white rounded-lg font-bold text-lg hover:bg-duru-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Bell className="w-5 h-5" />
            발송하기
          </button>
        </div>
      </div>

      {/* 발송 기록 */}
      <NoticeHistory
        notices={sentNotices}
        expandedNotices={expandedNotices}
        onToggleExpand={toggleNoticeExpand}
      />
    </div>
  );
}
