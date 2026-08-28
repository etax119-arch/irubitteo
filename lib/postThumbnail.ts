import { extractYoutubeId, getYoutubeThumbnail } from './youtube';

type ThumbnailSource = {
  coverImageUrl?: string | null;
  coverImageThumbUrl?: string | null;
  coverImageCardUrl?: string | null;
  coverImageBlurData?: string | null;
  videoUrl?: string | null;
  images?: {
    imageUrl: string;
    imageThumbUrl?: string | null;
    imageCardUrl: string | null;
    imageBlurData: string | null;
  }[];
};

export type PostThumbnail = {
  src: string;
  blurDataURL?: string;
};

/** 파생본 크기: card(긴 변 1200px) / thumb(긴 변 480px) */
export type ThumbnailSize = 'card' | 'thumb';

/**
 * 글 목록 카드에 쓸 썸네일을 고른다.
 * 우선순위: 대표사진 → 본문 첫 이미지 → 유튜브 썸네일 → 없음(텍스트 전용 카드)
 *
 * @param size 작은 목록(관리자 카드 등)에서는 'thumb'을 사용해 전송량을 줄인다.
 */
export function resolvePostThumbnail(
  item: ThumbnailSource,
  size: ThumbnailSize = 'card',
): PostThumbnail | null {
  const cover =
    (size === 'thumb' ? item.coverImageThumbUrl : null) ||
    item.coverImageCardUrl ||
    item.coverImageUrl;
  if (cover) {
    return { src: cover, blurDataURL: item.coverImageBlurData ?? undefined };
  }

  const first = item.images?.[0];
  if (first) {
    return {
      src:
        (size === 'thumb' ? first.imageThumbUrl : null) ||
        first.imageCardUrl ||
        first.imageUrl,
      blurDataURL: first.imageBlurData ?? undefined,
    };
  }

  const videoId = extractYoutubeId(item.videoUrl);
  if (videoId) {
    return { src: getYoutubeThumbnail(videoId) };
  }

  return null;
}
