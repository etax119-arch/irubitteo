export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  artistName: string;
  disabilityType: string | null;
  imageUrl: string;
  imageThumbUrl: string | null;
  imageCardUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  imageBlurData: string | null;
  imageAlt: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GalleryCreateInput = {
  title: string;
  description?: string;
  artistName: string;
  disabilityType?: string;
  imageAlt?: string;
};

export type GalleryUpdateInput = {
  title?: string;
  description?: string;
  artistName?: string;
  disabilityType?: string;
  imageAlt?: string;
  removeImage?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
};
