import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/_components/Header';
import Footer from '@/app/_components/Footer';
import { serverFetch } from '@/lib/api/server-fetch';
import type { GalleryItem } from '@/types/gallery';
import type { PaginatedResponse } from '@/types/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PurchaseInquiryButton from '../_components/PurchaseInquiryButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getGalleryItem = cache(async (id: string) => {
  const { data } = await serverFetch<{ success: boolean; data: GalleryItem }>(`/galleries/${id}`);
  return data;
});

export async function generateStaticParams() {
  try {
    const { data } = await serverFetch<PaginatedResponse<GalleryItem>>('/galleries?page=1&limit=50', 3600);
    return data.map((item) => ({ id: item.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await getGalleryItem(id);
    return {
      title: `${item.title} | 빛터 갤러리`,
      description:
        item.description || `${item.artistName} 작가의 작품 - ${item.title}`,
      alternates: { canonical: `/gallery/${id}` },
      openGraph: {
        title: `${item.title} | 빛터 갤러리`,
        description:
          item.description || `${item.artistName} 작가의 작품`,
        images:
          item.imageCardUrl || item.imageUrl
            ? [{ url: item.imageCardUrl || item.imageUrl }]
            : undefined,
      },
    };
  } catch {
    return { title: '작품 | 빛터 갤러리' };
  }
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { id } = await params;

  let item: GalleryItem;
  try {
    item = await getGalleryItem(id);
  } catch {
    notFound();
  }

  const alt = item.imageAlt || `${item.title} - ${item.artistName}`;
  const imageSrc = item.imageCardUrl || item.imageUrl;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: item.title,
    description: item.description,
    creator: {
      '@type': 'Person',
      name: item.artistName,
    },
    image: imageSrc,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Back link */}
          <Link href="/gallery" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-8 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            갤러리로 돌아가기
          </Link>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Image */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain"
                  priority
                  {...(item.imageBlurData
                    ? {
                        placeholder: 'blur' as const,
                        blurDataURL: item.imageBlurData,
                      }
                    : {})}
                />
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {item.title}
              </h1>

              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-sm text-gray-500">작가</span>
                  <p className="font-medium text-gray-900">
                    {item.artistName}
                  </p>
                </div>

                {item.disabilityType && (
                  <div>
                    <span className="text-sm text-gray-500">장애유형</span>
                    <p>
                      <span className="inline-block mt-1 text-sm bg-duru-orange-50 text-duru-orange-600 px-3 py-1 rounded-full">
                        {item.disabilityType}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {item.description && (
                <div className="mb-8">
                  <span className="text-sm text-gray-500 block mb-2">
                    작품 설명
                  </span>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              )}

              <div className="mt-auto">
                <PurchaseInquiryButton />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
