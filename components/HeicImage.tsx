'use client';

import { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';

interface HeicImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

/**
 * HEIC 이미지를 자동으로 변환하여 표시하는 컴포넌트
 * 일반 이미지 로드 실패 시 HEIC로 간주하고 변환 시도
 */
export function HeicImage({ src, alt, className, onClick }: HeicImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const currentSrcRef = useRef(src);

  useEffect(() => {
    // src가 변경되면 상태 리셋
    currentSrcRef.current = src;
    setImageSrc(src);
    setHasError(false);
    setIsConverted(false);
  }, [src]);

  // 메모리 누수 방지: 변환된 blob URL cleanup
  useEffect(() => {
    return () => {
      // 변환된 URL만 cleanup (원본 src는 건드리지 않음)
      if (imageSrc !== src && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc, src]);

  const handleError = async () => {
    // 이미 변환 시도했으면 더 이상 시도하지 않음
    if (isConverted) {
      setHasError(true);
      return;
    }

    setIsLoading(true);
    try {
      // URL에서 이미지 fetch
      const response = await fetch(src);
      if (!response.ok) throw new Error('Failed to fetch');

      const blob = await response.blob();

      // HEIC 변환 시도
      const { heicTo } = await import('heic-to');
      const jpegBlob = await heicTo({
        blob,
        type: 'image/jpeg',
        quality: 0.8,
      });

      const convertedUrl = URL.createObjectURL(jpegBlob);
      // stale 변환 결과 무시
      if (currentSrcRef.current !== src) {
        URL.revokeObjectURL(convertedUrl);
        return;
      }
      setImageSrc(convertedUrl);
      setIsConverted(true);
    } catch {
      // 변환 실패
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="w-6 h-6 border-2 border-gray-300 border-t-duru-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- blob URL(HEIC 변환)은 next/image 미지원
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={handleError}
    />
  );
}
