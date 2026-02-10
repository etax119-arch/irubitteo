'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ImagePlus, X, Loader2 } from 'lucide-react';
import { SuccessModal } from '../_components/SuccessModal';
import { Textarea } from '@/components/ui/Textarea';
import { useAttendance } from '@/hooks/useAttendance';
import { useToast } from '@/components/ui/Toast';
import { filesToBase64, isHeicFile, isHeicFileByContent, convertHeicToJpeg } from '@/lib/file';
import type { UploadPhoto } from '@/types/attendance';

const MAX_PHOTO_COUNT = 10;
const MAX_FILE_SIZE_MB = 10;

export default function CheckOutPage() {
  const router = useRouter();
  const [workDone, setWorkDone] = useState('');
  const [photos, setPhotos] = useState<UploadPhoto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { clockOut, isLoading, error } = useAttendance();
  const toast = useToast();

  // 메모리 누수 방지: 페이지 언마운트 시 blob URL cleanup
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (photos.length + files.length > MAX_PHOTO_COUNT) {
      toast.error(`사진은 최대 ${MAX_PHOTO_COUNT}장까지 첨부 가능합니다.`);
      return;
    }

    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`파일 크기는 ${MAX_FILE_SIZE_MB}MB 이하만 가능합니다.`);
      return;
    }

    const newPhotos = await Promise.all(
      files.map(async (file) => {
        let previewUrl: string;
        // 확장자/MIME 또는 실제 파일 내용(매직 바이트)으로 HEIC 감지
        const isHeic = isHeicFile(file) || (await isHeicFileByContent(file));
        if (isHeic) {
          try {
            const jpegBlob = await convertHeicToJpeg(file);
            previewUrl = URL.createObjectURL(jpegBlob);
          } catch {
            // 변환 실패 시 원본 사용
            previewUrl = URL.createObjectURL(file);
          }
        } else {
          previewUrl = URL.createObjectURL(file);
        }
        return {
          id: crypto.randomUUID(),
          name: file.name,
          url: previewUrl,
          file, // 원본 파일 저장
        };
      })
    );
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) {
      URL.revokeObjectURL(photo.url); // 메모리 해제
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const completeCheckOut = async () => {
    // 사진을 base64로 변환
    const photoFiles = photos.map((p) => p.file);
    const base64Photos = photoFiles.length > 0 ? await filesToBase64(photoFiles) : undefined;

    const result = await clockOut({
      workContent: workDone,
      photos: base64Photos,
    });

    if (result) {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    // 메모리 해제
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setShowModal(false);
    setWorkDone('');
    setPhotos([]);
    router.push('/employee');
  };

  return (
    <div className="min-h-screen bg-duru-ivory">
      <div className="max-w-3xl mx-auto p-4 sm:p-8">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로가기
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-duru-orange-100 overflow-hidden">
          {/* 상단 */}
          <div className="text-center pt-8 pb-6 px-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-duru-orange-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-duru-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">퇴근하기</h1>
            <p className="text-lg text-gray-500">오늘 한 일을 간단히 기록해주세요</p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mx-6 sm:mx-8 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-center font-medium">{error}</p>
            </div>
          )}

          {/* 오늘의 업무 내용 */}
          <div className="mx-6 sm:mx-8 mb-6">
            <Textarea
              label="오늘의 업무 내용"
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              placeholder="예) 제품 포장 작업, 부품 조립, 작업장 정리 등"
              rows={5}
              className="px-5 py-4 border-2 text-lg"
            />
          </div>

          {/* 활동 사진 첨부 */}
          <div className="mx-6 sm:mx-8 mb-6">
            {/* 사진 미리보기 */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-duru-orange-100 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 미리보기는 next/image 미지원 */}
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      aria-label="사진 삭제"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 사진 추가 버튼 */}
            <label className="flex items-center justify-center gap-2 w-full py-3 bg-[#FFF4EC] border-2 border-dashed border-duru-orange-200 rounded-xl cursor-pointer hover:bg-duru-orange-50 transition-colors">
              <ImagePlus className="w-5 h-5 text-duru-orange-500" />
              <span className="text-base font-semibold text-duru-orange-600">사진 추가하기</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* 퇴근 완료 버튼 */}
          <div className="px-6 sm:px-8 pb-8">
            <button
              onClick={completeCheckOut}
              disabled={!workDone.trim() || isLoading}
              className="w-full py-5 bg-duru-orange-500 text-white rounded-xl font-bold text-xl hover:bg-duru-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  퇴근 완료
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 퇴근 완료 모달 */}
      {showModal && (
        <SuccessModal type="checkout" onClose={handleModalClose} />
      )}
    </div>
  );
}
