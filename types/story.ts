export type StoryImage = {
  id: string;
  imageUrl: string;
  imageThumbUrl: string | null;
  imageCardUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  imageBlurData: string | null;
  imageAlt: string | null;
  sortOrder: number;
};

export type StoryItem = {
  id: string;
  title: string;
  content: string;
  images: StoryImage[];
  /** 목록 카드 전용 대표사진 (상세에서는 노출하지 않음) */
  coverImageUrl: string | null;
  coverImageThumbUrl: string | null;
  coverImageCardUrl: string | null;
  coverImageWidth: number | null;
  coverImageHeight: number | null;
  coverImageBlurData: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoryCreateInput = {
  title: string;
  content: string;
  /** 빈 값(null/undefined)이면 영상 없음 */
  videoUrl?: string | null;
};

export type StoryUpdateInput = {
  title?: string;
  content?: string;
  isPublished?: boolean;
  /** null이면 영상 제거 */
  videoUrl?: string | null;
  deleteImageIds?: string[];
  deleteCoverImage?: boolean;
};
