'use client';

import { useRef } from 'react';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import {
  isHeicFile,
  isHeicFileByContent,
  convertHeicToJpeg,
  compressImage,
  fileToBase64,
} from '@/lib/file';

interface ProfileImageUploadProps {
  src: string | null;
  name: string;
  isUploading: boolean;
  onUpload: (base64: string) => void;
  onDelete: () => void;
  editable?: boolean;
}

export function ProfileImageUpload({
  src,
  name,
  isUploading,
  onUpload,
  onDelete,
  editable = false,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let blob: File | Blob = file;

      // HEIC 변환
      const heic = isHeicFile(file) || (await isHeicFileByContent(file));
      if (heic) {
        blob = await convertHeicToJpeg(file);
      }

      // 압축 (512px, 0.8 quality)
      blob = await compressImage(blob, { maxDimension: 512, quality: 0.8 });

      const base64 = await fileToBase64(blob);
      onUpload(base64);
    } catch {
      // 에러는 상위에서 toast로 처리
    }

    // input 초기화 (같은 파일 재선택 허용)
    e.target.value = '';
  };

  return (
    <div className="relative w-24 h-24 mx-auto mb-4 group">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <div className="w-24 h-24 bg-duru-orange-100 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-duru-orange-600">
            {name?.[0] ?? '?'}
          </span>
        </div>
      )}

      {editable && !isUploading && (
        <>
          {/* 카메라 오버레이 */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer"
          >
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* 삭제 버튼 (이미지가 있을 때만) */}
          {src && (
            <button
              type="button"
              onClick={onDelete}
              className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      )}

      {isUploading && (
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
