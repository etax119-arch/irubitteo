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
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoryCreateInput = {
  title: string;
  content: string;
};

export type StoryUpdateInput = {
  title?: string;
  content?: string;
  isPublished?: boolean;
  deleteImageIds?: string[];
};
