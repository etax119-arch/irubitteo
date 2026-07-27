import { MetadataRoute } from 'next';

// Yeti(네이버)와 기본 크롤러가 동일한 목록을 쓰므로 한 곳에서 관리 — 섹션 추가 시 한 번만 수정
const ALLOW = [
  '/', '/inquiry', '/resume', '/policies/',
  '/gallery', '/gallery/',
  '/newsletter', '/newsletter/',
  '/story', '/story/',
  '/announcements', '/announcements/',
];

const DISALLOW = [
  '/login', '/login/',
  '/employee', '/employee/',
  '/company', '/company/',
  '/admin', '/admin/',
  '/playground', '/playground/',
  '/api/',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'Yeti', allow: ALLOW, disallow: DISALLOW },
      { userAgent: '*', allow: ALLOW, disallow: DISALLOW },
    ],
    sitemap: 'https://www.irubitteo.com/sitemap.xml',
  };
}
