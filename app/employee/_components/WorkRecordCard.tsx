'use client';

import { CheckCircle2, Camera, ImagePlus } from 'lucide-react';
import type { AttendanceWithEmployee, DisplayPhoto } from '@/types/attendance';
import { formatUtcTimestampAsKSTDate, formatUtcTimestampAsKST } from '@/lib/kst';
import { HeicImage } from './HeicImage';

interface WorkRecordCardProps {
  record: AttendanceWithEmployee;
  onPhotoClick: (photo: DisplayPhoto) => void;
  onAddPhoto: (recordId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function WorkRecordCard({
  record,
  onPhotoClick,
  onAddPhoto,
}: WorkRecordCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-duru-orange-100 hover:border-duru-orange-300 hover:shadow-md transition-all">
      {/* 날짜 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-duru-orange-50 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-duru-orange-600" />
          <span className="text-sm font-bold text-duru-orange-700">퇴근</span>
        </div>
        {record.clockOut && (
          <>
            <span className="text-sm font-semibold text-gray-700">
              {formatUtcTimestampAsKSTDate(record.clockOut)}
            </span>
            <span className="text-xs text-gray-400">
              {formatUtcTimestampAsKST(record.clockOut)}
            </span>
          </>
        )}
      </div>

      {/* 업무 내용 */}
      <div className="bg-[#FFF4EC] rounded-xl p-4 mb-3">
        <p className="text-xs text-duru-orange-600 font-bold mb-2">오늘 한 일</p>
        <p className="text-base text-gray-800 font-medium leading-relaxed">
          {record.workContent || '(기록 없음)'}
        </p>
      </div>

      {/* 사진 (모든 사진 표시) */}
      {record.photoUrls.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-2.5 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            활동 사진 ({record.photoUrls.length}장)
          </p>
          <div className="flex flex-wrap gap-3">
            {record.photoUrls.map((url, index) => {
              const photo: DisplayPhoto = {
                url,
                name: `photo_${record.id}_${index + 1}.jpg`,
              };
              return (
                <button
                  key={index}
                  onClick={() => onPhotoClick(photo)}
                  className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg group"
                >
                  <HeicImage
                    src={url}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 사진이 없을 때 추가 버튼 */}
      {record.photoUrls.length === 0 && (
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
  );
}
