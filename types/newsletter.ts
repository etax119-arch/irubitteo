export type NewsletterItem = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  imageThumbUrl: string | null;
  imageCardUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  imageBlurData: string | null;
  imageAlt: string | null;
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
  removeImage?: boolean;
  isPublished?: boolean;
};
