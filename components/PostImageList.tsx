import Image from 'next/image';

/** 소식지/이야기/공고 본문 이미지의 공통 형태 */
export type PostImage = {
  id: string;
  imageUrl: string;
  imageCardUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  imageBlurData: string | null;
  imageAlt: string | null;
};

interface PostImageListProps {
  images: PostImage[];
  /** alt 폴백에 사용할 글 제목 */
  title: string;
}

/**
 * 게시글 본문 이미지 목록.
 * 컨테이너 비율을 원본 이미지 비율로 맞춰 세로로 긴 사진도 잘리지 않게 전체를 노출한다.
 */
export default function PostImageList({ images, title }: PostImageListProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-6 mb-8">
      {images.map((img, idx) => {
        const hasSize = !!(img.imageWidth && img.imageHeight);
        // 세로로 매우 긴 이미지(카드뉴스/포스터)는 card 파생본(긴 변 1200px)이
        // 가로 해상도를 크게 잃으므로 원본을 사용해 선명도를 확보한다.
        const isTall = hasSize && img.imageHeight! > img.imageWidth! * 2;
        const src = isTall ? img.imageUrl : img.imageCardUrl || img.imageUrl;

        return (
          <div
            key={img.id}
            className="relative w-full bg-gray-100 rounded-2xl overflow-hidden"
            style={{
              aspectRatio: hasSize
                ? `${img.imageWidth} / ${img.imageHeight}`
                : '16 / 9',
            }}
          >
            <Image
              src={src}
              alt={img.imageAlt || `${title} - ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
              priority={idx === 0}
              {...(img.imageBlurData
                ? {
                    placeholder: 'blur' as const,
                    blurDataURL: img.imageBlurData,
                  }
                : {})}
            />
          </div>
        );
      })}
    </div>
  );
}
