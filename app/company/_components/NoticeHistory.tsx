import { FileText, MessageSquare } from 'lucide-react';
import type { SentNotice } from '@/types/companyDashboard';

interface NoticeHistoryProps {
  notices: SentNotice[];
  expandedNotices: Set<number>;
  onToggleExpand: (noticeId: number) => void;
}

export function NoticeHistory({
  notices,
  expandedNotices,
  onToggleExpand,
}: NoticeHistoryProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-duru-orange-600" />
          발송 기록
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {notices.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">발송한 공지사항이 없습니다</p>
          </div>
        ) : (
          notices.map((notice) => {
            const isExpanded = expandedNotices.has(notice.id);
            const displayedWorkers = isExpanded
              ? notice.workers
              : notice.workers.slice(0, 3);

            return (
              <div
                key={notice.id}
                className="px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-duru-orange-600">
                        {notice.date}
                      </span>
                      <span className="text-sm text-gray-500">
                        발송자: {notice.sender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        발송 대상:
                      </span>
                      {displayedWorkers.map((worker, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                        >
                          {worker}
                        </span>
                      ))}
                      {notice.workers.length > 3 && (
                        <button
                          onClick={() => onToggleExpand(notice.id)}
                          className="inline-flex items-center px-2.5 py-1 bg-duru-orange-100 text-duru-orange-700 rounded-md text-sm font-semibold hover:bg-duru-orange-200 transition-colors"
                        >
                          {isExpanded ? '접기' : `+${notice.workers.length - 3}명 더보기`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-line leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
