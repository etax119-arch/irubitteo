'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { HeicImage } from '@/components/HeicImage';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import type { DisplayPhoto } from '@/types/attendance';

interface WorkDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWorkDone: { date: string; workDone: string; photoUrls: string[] } | null;
}

export function WorkDoneModal({ isOpen, onClose, selectedWorkDone }: WorkDoneModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<DisplayPhoto | null>(null);

  if (!selectedWorkDone) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="업무 내용" size="md">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">{selectedWorkDone.date}</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{selectedWorkDone.workDone}</p>
          </div>
        </div>
        {selectedWorkDone.photoUrls.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-semibold mb-2.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              활동 사진 ({selectedWorkDone.photoUrls.length}장)
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedWorkDone.photoUrls.map((url, index) => {
                const photo: DisplayPhoto = {
                  url,
                  name: `photo_${index + 1}.jpg`,
                };
                return (
                  <button
                    key={url}
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-duru-orange-300 transition-all hover:shadow-md group"
                  >
                    <HeicImage
                      src={url}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <Button variant="outline" onClick={onClose} fullWidth>
          닫기
        </Button>
      </Modal>
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
