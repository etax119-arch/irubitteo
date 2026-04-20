export type NewsletterImage = {
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

export type NewsletterItem = {
  id: string;
  title: string;
  content: string;
  images: NewsletterImage[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewsletterCreateInput = {
  title: string;
  content: string;
};

export type NewsletterUpdateInput = {
  title?: string;
  content?: string;
  isPublished?: boolean;
  deleteImageIds?: string[];
};
