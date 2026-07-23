import { MetadataRoute } from 'next';
import { serverFetch } from '@/lib/api/server-fetch';
import type { PaginatedResponse } from '@/types/api';

// 서버 쿼리 DTO의 limit 상한(@Max(100))과 일치해야 함 — 초과 시 400으로 조용히 실패
const PAGE_LIMIT = 100;
const MAX_PAGES = 10;

type SitemapItem = { id: string; updatedAt: string };

/** 공개 목록 API를 페이지 순회하며 전체 항목의 상세 URL 엔트리를 수집. API 실패 시 빈 배열. */
async function fetchDetailPages(
  apiPath: string,
  urlPrefix: string,
): Promise<MetadataRoute.Sitemap> {
  const items: SitemapItem[] = [];
  try {
    let totalPages = 1;
    for (let page = 1; page <= totalPages && page <= MAX_PAGES; page++) {
      const res = await serverFetch<PaginatedResponse<SitemapItem>>(
        `${apiPath}?page=${page}&limit=${PAGE_LIMIT}`,
      );
      items.push(...res.data);
      totalPages = res.pagination.totalPages;
    }
  } catch {
    // API 실패 시 해당 상세 페이지 없이 계속 진행
  }
  return items.map((item) => ({
    url: `${urlPrefix}/${item.id}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}

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
    { url: `${baseUrl}/announcements`, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // 동적 상세 페이지 (갤러리 / 소식지 / 공고)
  const [galleryPages, newsletterPages, announcementPages] = await Promise.all([
    fetchDetailPages('/galleries', `${baseUrl}/gallery`),
    fetchDetailPages('/newsletters', `${baseUrl}/newsletter`),
    fetchDetailPages('/announcements', `${baseUrl}/announcements`),
  ]);

  return [...staticPages, ...listPages, ...galleryPages, ...newsletterPages, ...announcementPages];
}
