import { serverFetch } from '@/lib/api/server-fetch';
import type { PaginatedResponse } from '@/types/api';
import type { GalleryItem } from '@/types/gallery';
import type { NewsletterItem } from '@/types/newsletter';

const BASE_URL = 'https://www.irubitteo.com';

type RssItem = {
  title: string;
  path: string;
  description: string;
  pubDate?: string;
};

const RSS_ITEMS: RssItem[] = [
  {
    title: '이루빛터',
    path: '/',
    description: '장애인 근로자와 기업이 함께 빛나는 일터, 이루빛터 공식 웹사이트입니다.',
  },
  {
    title: '기업 문의',
    path: '/inquiry',
    description: '기업 문의 및 도입 상담을 신청할 수 있습니다.',
  },
  {
    title: '이력서 등록',
    path: '/resume',
    description: '근로자 이력서 등록을 진행할 수 있습니다.',
  },
  {
    title: '개인정보처리방침',
    path: '/policies/privacy',
    description: '이루빛터 개인정보처리방침 안내 페이지입니다.',
  },
  {
    title: '이용약관',
    path: '/policies/terms',
    description: '이루빛터 서비스 이용약관 안내 페이지입니다.',
  },
  {
    title: '웹 접근성',
    path: '/policies/accessibility',
    description: '이루빛터 웹 접근성 정책 안내 페이지입니다.',
  },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchDynamicItems(): Promise<RssItem[]> {
  const items: RssItem[] = [];

  try {
    const [galleries, newsletters] = await Promise.all([
      serverFetch<PaginatedResponse<GalleryItem>>('/galleries?limit=20', 3600),
      serverFetch<PaginatedResponse<NewsletterItem>>('/newsletters?limit=20', 3600),
    ]);

    for (const g of galleries.data) {
      items.push({
        title: `[갤러리] ${g.title}`,
        path: `/gallery/${g.id}`,
        description: g.description || `${g.artistName} 작가의 작품 "${g.title}"`,
        pubDate: new Date(g.createdAt).toUTCString(),
      });
    }

    for (const n of newsletters.data) {
      items.push({
        title: `[소식지] ${n.title}`,
        path: `/newsletter/${n.id}`,
        description: n.content.slice(0, 200),
        pubDate: new Date(n.createdAt).toUTCString(),
      });
    }
  } catch {
    // API 실패 시 정적 항목만 반환
  }

  return items;
}

function buildItemXml(item: RssItem, fallbackDate: string): string {
  const url = `${BASE_URL}${item.path}`;
  return [
    '<item>',
    `<title>${escapeXml(item.title)}</title>`,
    `<link>${escapeXml(url)}</link>`,
    `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `<description>${escapeXml(item.description)}</description>`,
    `<pubDate>${item.pubDate ?? fallbackDate}</pubDate>`,
    '</item>',
  ].join('');
}

export async function GET(): Promise<Response> {
  const now = new Date().toUTCString();
  const siteDescription = '가능성이 일상의 빛이 되는 곳, 이루빛터에서는 장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여 빛나는 내일을 함께 합니다.';

  const dynamicItems = await fetchDynamicItems();
  const allItems = [...RSS_ITEMS, ...dynamicItems];

  const itemsXml = allItems.map((item) => buildItemXml(item, now)).join('');

  const rssXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    `<title>${escapeXml('이루빛터')}</title>`,
    `<link>${escapeXml(BASE_URL)}</link>`,
    `<description>${escapeXml(siteDescription)}</description>`,
    '<language>ko-KR</language>',
    `<lastBuildDate>${now}</lastBuildDate>`,
    itemsXml,
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
