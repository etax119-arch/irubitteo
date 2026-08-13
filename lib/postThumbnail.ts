import { extractYoutubeId, getYoutubeThumbnail } from './youtube';

type ThumbnailSource = {
  coverImageUrl?: string | null;
  coverImageCardUrl?: string | null;
  coverImageBlurData?: string | null;
  videoUrl?: string | null;
  images?: {
    imageUrl: string;
    imageCardUrl: string | null;
    imageBlurData: string | null;
  }[];
};

export type PostThumbnail = {
  src: string;
  blurDataURL?: string;
};

/**
 * 글 목록 카드에 쓸 썸네일을 고른다.
 * 우선순위: 대표사진 → 본문 첫 이미지 → 유튜브 썸네일 → 없음(텍스트 전용 카드)
 */
export function resolvePostThumbnail(
  item: ThumbnailSource,
): PostThumbnail | null {
  const cover = item.coverImageCardUrl || item.coverImageUrl;
  if (cover) {
    return { src: cover, blurDataURL: item.coverImageBlurData ?? undefined };
  }

  const first = item.images?.[0];
  if (first) {
    return {
      src: first.imageCardUrl || first.imageUrl,
      blurDataURL: first.imageBlurData ?? undefined,
    };
  }

  const videoId = extractYoutubeId(item.videoUrl);
  if (videoId) {
    return { src: getYoutubeThumbnail(videoId) };
  }

  return null;
}
