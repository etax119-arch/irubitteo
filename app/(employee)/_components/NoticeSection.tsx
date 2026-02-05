'use client';

import { AlertTriangle, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';

interface Notice {
  id: number;
  date: string;
  content: string;
  sender: string;
}

interface NoticeSectionProps {
  todayNotices: Notice[];
  pastNotices: Notice[];
  showPastNotices: boolean;
  onTogglePastNotices: () => void;
}

export function NoticeSection({
  todayNotices,
  pastNotices,
  showPastNotices,
  onTogglePastNotices,
}: NoticeSectionProps) {
  return (
    <>
      {/* 금일 긴급 공지 (강조 영역) */}
      <div className="bg-duru-orange-50 rounded-2xl shadow-lg p-8 border-2 border-duru-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-duru-orange-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-duru-orange-600">금일 긴급 공지</h3>
        </div>

        {todayNotices.length > 0 ? (
          <div className="space-y-6">
            {todayNotices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-xl p-6 border border-duru-orange-100">
                <p className="text-base font-bold text-duru-orange-600 mb-3">{notice.date}</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 leading-relaxed whitespace-pre-line mb-4">
                  {notice.content}
                </p>
                <p className="text-sm text-gray-400">전송자: {notice.sender}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-lg text-gray-400">금일 등록된 긴급 공지가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 지난 긴급 공지 (슬림 토글 카드) */}
      {pastNotices.length > 0 && (
        <div className="mt-6">
          {/* 트리거 카드 */}
          <button
            onClick={onTogglePastNotices}
            className="w-full bg-gradient-to-b from-[#F7F7F8] to-[#F1F1F3] rounded-2xl px-5 py-3.5 border border-[#E2E2E6] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between hover:from-[#F3F3F5] hover:to-[#EDEDEF] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                <Megaphone className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span className="text-sm text-gray-500 font-normal">지난 긴급 공지</span>
            </div>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              {showPastNotices ? '접기' : '모두 보기'}
              {showPastNotices
                ? <ChevronUp className="w-3.5 h-3.5" />
                : <ChevronDown className="w-3.5 h-3.5" />
              }
            </span>
          </button>

          {/* 펼쳐지는 공지 리스트 (아코디언) */}
          {showPastNotices && (
            <div className="mt-2 bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100 space-y-2.5">
              {pastNotices.map((notice) => (
                <div key={notice.id} className="bg-white/80 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">{notice.date}</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mb-1">
                    {notice.content}
                  </p>
                  <p className="text-xs text-gray-400">전송자: {notice.sender}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
