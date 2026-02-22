import { MetadataRoute } from 'next';
import { serverFetch } from '@/lib/api/server-fetch';
import type { GalleryItem } from '@/types/gallery';
import type { NewsletterItem } from '@/types/newsletter';
import type { PaginatedResponse } from '@/types/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.irubitteo.com';

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/inquiry`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/policies/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/policies/terms`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/policies/accessibility`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // 목록 페이지
  const listPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/gallery`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/newsletter`, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // 갤러리 동적 페이지
  let galleryPages: MetadataRoute.Sitemap = [];
  try {
    const { data: galleries } = await serverFetch<PaginatedResponse<GalleryItem>>(
      '/galleries?page=1&limit=1000',
    );
    galleryPages = galleries.map((item) => ({
      url: `${baseUrl}/gallery/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // Continue without gallery pages if API fails
  }

  // 소식지 동적 페이지
  let newsletterPages: MetadataRoute.Sitemap = [];
  try {
    const { data: newsletters } = await serverFetch<PaginatedResponse<NewsletterItem>>(
      '/newsletters?page=1&limit=1000',
    );
    newsletterPages = newsletters.map((item) => ({
      url: `${baseUrl}/newsletter/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // Continue without newsletter pages if API fails
  }

  return [...staticPages, ...listPages, ...galleryPages, ...newsletterPages];
}
