export type AdminFileCategory = 'TEMPLATE' | 'REPORT';

export type AdminFile = {
  id: string;
  category: AdminFileCategory;
  name: string;
  description: string | null;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
};
