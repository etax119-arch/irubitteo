import { Metadata } from 'next';
import Header from '@/app/_components/Header';
import Footer from '@/app/_components/Footer';
import { serverFetch } from '@/lib/api/server-fetch';
import type { GalleryItem } from '@/types/gallery';
import type { PaginatedResponse } from '@/types/api';
import GalleryGrid from './_components/GalleryGrid';
import GalleryPagination from './_components/GalleryPagination';

export const metadata: Metadata = {
  title: '빛터 갤러리 | 이루빛터',
  description:
    '장애인 근로자분들의 작품을 만나보세요. 이루빛터 갤러리에서 다양한 예술 작품을 감상하실 수 있습니다.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: '빛터 갤러리 | 이루빛터',
    description: '장애인 근로자분들의 작품을 만나보세요.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '빛터 갤러리',
  description: '장애인 근로자분들의 작품을 만나보세요.',
  url: 'https://www.irubitteo.com/gallery',
  publisher: { '@type': 'Organization', name: '이루빛터' },
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  let data: GalleryItem[] = [];
  let pagination = { page: 1, limit: 12, total: 0, totalPages: 0 };

  try {
    const result = await serverFetch<PaginatedResponse<GalleryItem>>(
      `/galleries?page=${page}&limit=12`,
    );
    data = result.data;
    pagination = result.pagination;
  } catch {
    // Render empty state on error
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
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">빛터 갤러리</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              이루빛터 근로자분들의 소중한 작품을 만나보세요
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {data.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              등록된 작품이 없습니다.
            </div>
          ) : (
            <>
              <GalleryGrid items={data} />
              <GalleryPagination pagination={pagination} currentPage={page} />
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
