'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ImagePlus, X } from 'lucide-react';
import { SuccessModal } from '../../_components/SuccessModal';

interface Photo {
  id: number;
  name: string;
  url: string;
}

export default function CheckOutPage() {
  const router = useRouter();
  const [workDone, setWorkDone] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (id: number) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const completeCheckOut = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
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

          {/* 오늘의 업무 내용 */}
          <div className="mx-6 sm:mx-8 mb-6">
            <label className="block text-xl font-bold text-gray-800 mb-3">오늘의 업무 내용</label>
            <textarea
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              placeholder="예) 제품 포장 작업, 부품 조립, 작업장 정리 등"
              rows={5}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent resize-none leading-relaxed"
            />
          </div>

          {/* 활동 사진 첨부 */}
          <div className="mx-6 sm:mx-8 mb-6">
            {/* 사진 미리보기 */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-duru-orange-100 bg-white">
                    <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
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
                accept="image/*"
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
              disabled={!workDone.trim()}
              className="w-full py-5 bg-duru-orange-500 text-white rounded-xl font-bold text-xl hover:bg-duru-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6" />
              퇴근 완료
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
