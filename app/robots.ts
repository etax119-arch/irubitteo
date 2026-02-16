import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/inquiry', '/policies/'],
        disallow: [
          '/login', '/login/',
          '/employee', '/employee/',
          '/company', '/company/',
          '/admin', '/admin/',
          '/playground', '/playground/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://www.irubitteo.com/sitemap.xml',
  };
}
