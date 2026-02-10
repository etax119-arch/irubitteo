'use client';

import { FileText } from 'lucide-react';

export interface NoteUpdateAlert {
  id: number;
  workerName: string;
  companyName: string;
  noteContent: string;
  updatedAt: string;
}

interface NoteUpdateAlertListProps {
  alerts: NoteUpdateAlert[];
  onViewDetail: (workerId: number) => void;
}

export function NoteUpdateAlertList({ alerts, onViewDetail }: NoteUpdateAlertListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 상단 오렌지 포인트 라인 */}
      <div className="h-1 bg-gradient-to-r from-duru-orange-400 to-duru-orange-500" />

      <div className="px-6 py-5 border-b border-gray-100 bg-duru-orange-50/30">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-duru-orange-500" />
          기업 비고 업데이트
        </h3>
        <p className="text-sm text-gray-500 mt-1">기업/병원에서 근로자에 대해 남긴 메모입니다</p>
      </div>

      <div className="divide-y divide-gray-100">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* 근로자 이름 + 소속 기업 */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-gray-900">{alert.workerName}</span>
                    <span className="text-sm text-gray-500">· {alert.companyName}</span>
                  </div>

                  {/* 비고 내용 (2~3줄 말줄임) */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {alert.noteContent}
                  </p>

                  {/* 업데이트 일자 */}
                  <p className="text-xs text-gray-400">{alert.updatedAt}</p>
                </div>

                {/* 확인하기 버튼 */}
                <button
                  onClick={() => onViewDetail(alert.id)}
                  className="px-4 py-2 rounded-lg border border-duru-orange-300 bg-duru-orange-50 text-duru-orange-600 hover:bg-duru-orange-100 text-sm font-semibold whitespace-nowrap transition-colors shrink-0"
                >
                  확인하기
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-400 text-sm">
            현재 확인할 비고 업데이트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
