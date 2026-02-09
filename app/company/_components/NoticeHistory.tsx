import { FileText, MessageSquare, Trash2 } from 'lucide-react';
import type { NoticeResponse } from '@/types/notice';

interface NoticeHistoryProps {
  notices: NoticeResponse[];
  expandedNotices: Set<string>;
  onToggleExpand: (noticeId: string) => void;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

function formatCreatedAt(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  });
}

export function NoticeHistory({
  notices,
  expandedNotices,
  onToggleExpand,
  isLoading,
  onDelete,
  isDeleting,
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
        {isLoading ? (
          <div className="px-6 py-12 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-duru-orange-500" />
          </div>
        ) : notices.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">발송한 공지사항이 없습니다</p>
          </div>
        ) : (
          notices.map((notice) => {
            const isExpanded = expandedNotices.has(notice.id);
            const recipientNames = notice.recipients.map((r) => r.name);
            const displayedWorkers = isExpanded
              ? recipientNames
              : recipientNames.slice(0, 3);

            return (
              <div
                key={notice.id}
                className="px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-duru-orange-600">
                        {formatCreatedAt(notice.createdAt)}
                      </span>
                      <span className="text-sm text-gray-500">
                        발송자: {notice.senderName ?? '관리자'}
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
                      {recipientNames.length > 3 && (
                        <button
                          onClick={() => onToggleExpand(notice.id)}
                          className="inline-flex items-center px-2.5 py-1 bg-duru-orange-100 text-duru-orange-700 rounded-md text-sm font-semibold hover:bg-duru-orange-200 transition-colors"
                        >
                          {isExpanded ? '접기' : `+${recipientNames.length - 3}명 더보기`}
                        </button>
                      )}
                    </div>
                  </div>
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (window.confirm('공지사항을 삭제하시겠습니까?')) {
                          onDelete(notice.id);
                        }
                      }}
                      disabled={isDeleting}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
