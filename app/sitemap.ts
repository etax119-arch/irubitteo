import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.irubitteo.com';
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/inquiry`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/policies/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/policies/terms`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/policies/accessibility`, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
