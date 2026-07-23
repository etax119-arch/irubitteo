export type AnnouncementImage = {
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

export type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  images: AnnouncementImage[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AnnouncementCreateInput = {
  title: string;
  content: string;
};

export type AnnouncementUpdateInput = {
  title?: string;
  content?: string;
  isPublished?: boolean;
  deleteImageIds?: string[];
};
