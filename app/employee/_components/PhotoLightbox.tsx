'use client';

import { X } from 'lucide-react';
import { HeicImage } from './HeicImage';
import type { DisplayPhoto } from '@/types/attendance';

interface PhotoLightboxProps {
  photo: DisplayPhoto;
  onClose: () => void;
}

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <HeicImage
          src={photo.url}
          alt={photo.name}
          className="w-full h-auto rounded-xl shadow-2xl"
        />
        <p className="text-white text-center mt-4 text-sm">{photo.name}</p>
      </div>
    </div>
  );
}
