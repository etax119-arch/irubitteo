'use client';

import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText,
  CheckCircle2,
  Camera,
  Save,
  Trash2,
  ImagePlus,
} from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  name: string;
}

interface WorkRecord {
  id: number;
  date: string;
  type: 'checkin' | 'checkout';
  workDone?: string;
  photos?: Photo[];
  confirmedTask?: string;
  timestamp: string;
}

interface WorkRecordsSectionProps {
  workRecords: WorkRecord[];
  showWorkRecords: boolean;
  onToggleWorkRecords: () => void;
  selectedYear: number;
  selectedMonth: number;
  onPrevYear: () => void;
  onNextYear: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPhotoClick: (photo: Photo) => void;
  onSavePhoto: (photo: Photo) => void;
  onDeletePhoto: (recordId: number) => void;
  onAddPhoto: (recordId: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function WorkRecordsSection({
  workRecords,
  showWorkRecords,
  onToggleWorkRecords,
  selectedYear,
  selectedMonth,
  onPrevYear,
  onNextYear,
  onPrevMonth,
  onNextMonth,
  onPhotoClick,
  onSavePhoto,
  onDeletePhoto,
  onAddPhoto,
}: WorkRecordsSectionProps) {
  // 선택된 연도/월에 해당하는 업무 기록 필터링 (퇴근 기록만)
  const filteredRecords = workRecords
    .filter((record) => record.type === 'checkout')
    .filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === selectedYear && recordDate.getMonth() + 1 === selectedMonth;
    });

  return (
    <div className="mt-6">
      {/* 트리거 카드 */}
      <button
        onClick={onToggleWorkRecords}
        className="w-full bg-gradient-to-b from-[#F7F7F8] to-[#F1F1F3] rounded-2xl px-5 py-3.5 border border-[#E2E2E6] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between hover:from-[#F3F3F5] hover:to-[#EDEDEF] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-duru-orange-100 rounded-full flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-duru-orange-600" />
          </div>
          <span className="text-sm text-gray-500 font-normal">나의 활동 기록</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          {showWorkRecords ? '접기' : '모두 보기'}
          {showWorkRecords
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />
          }
        </span>
      </button>

      {/* 펼쳐지는 활동 기록 리스트 */}
      {showWorkRecords && (
        <div className="mt-2 bg-gradient-to-b from-gray-50 to-white rounded-2xl px-5 py-5 border border-gray-100">
          {/* 연도/월 선택 네비게이션 */}
          <div className="mb-4 space-y-3">
            {/* 연도 선택 */}
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
              <button
                onClick={onPrevYear}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-base font-bold text-gray-900">{selectedYear}년</span>
              </div>
              <button
                onClick={onNextYear}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* 월 선택 */}
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
              <button
                onClick={onPrevMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-base font-bold text-gray-900">{selectedMonth}월</span>
              <button
                onClick={onNextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* 기록 카드들 */}
          {filteredRecords.length > 0 ? (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="bg-white rounded-xl p-5 border border-duru-orange-100 hover:border-duru-orange-300 hover:shadow-md transition-all">
                  {/* 날짜 헤더 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-duru-orange-50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-duru-orange-600" />
                      <span className="text-sm font-bold text-duru-orange-700">퇴근</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {new Date(record.timestamp).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(record.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* 업무 내용 */}
                  <div className="bg-[#FFF4EC] rounded-xl p-4 mb-3">
                    <p className="text-xs text-duru-orange-600 font-bold mb-2">오늘 한 일</p>
                    <p className="text-base text-gray-800 font-medium leading-relaxed">
                      {record.workDone}
                    </p>
                  </div>

                  {/* 사진 (한 장만 표시) */}
                  {record.photos && record.photos.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-2.5 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        활동 사진
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onPhotoClick(record.photos![0])}
                          className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg group"
                        >
                          <img
                            src={record.photos[0].url}
                            alt={record.photos[0].name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSavePhoto(record.photos![0])}
                            className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
                            title="저장"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePhoto(record.id)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 사진이 없을 때 추가 버튼 */}
                  {(!record.photos || record.photos.length === 0) && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-2.5 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        활동 사진
                      </p>
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                        <ImagePlus className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600">사진 추가하기</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onAddPhoto(record.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-400">
                {selectedYear}년 {selectedMonth}월에<br/>등록된 활동 기록이 없습니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
