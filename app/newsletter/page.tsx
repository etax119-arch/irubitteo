import { Metadata } from 'next';
import Header from '@/app/_components/Header';
import Footer from '@/app/_components/Footer';
import { serverFetch } from '@/lib/api/server-fetch';
import type { NewsletterItem } from '@/types/newsletter';
import type { PaginatedResponse } from '@/types/api';
import NewsletterContent from './_components/NewsletterContent';

export const metadata: Metadata = {
  title: '빛터 소식지 | 이루빛터',
  description: '이루빛터의 최신 소식과 활동을 확인하세요.',
  alternates: { canonical: '/newsletter' },
  openGraph: {
    title: '빛터 소식지 | 이루빛터',
    description: '이루빛터의 최신 소식과 활동을 확인하세요.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '빛터 소식지',
  description: '이루빛터의 최신 소식과 활동을 확인하세요.',
  url: 'https://www.irubitteo.com/newsletter',
  publisher: { '@type': 'Organization', name: '이루빛터' },
};

export default async function NewsletterPage() {
  let initialData: PaginatedResponse<NewsletterItem> | null = null;

  try {
    initialData = await serverFetch<PaginatedResponse<NewsletterItem>>(
      '/newsletters?page=1&limit=12',
    );
  } catch {
    // Render empty state on error — CSR will retry
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              빛터 소식지
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              이루빛터의 최신 소식과 활동을 확인하세요
            </p>
          </div>
        </section>

        <NewsletterContent initialData={initialData} />
      </main>
      <Footer />
    </div>
  );
}
