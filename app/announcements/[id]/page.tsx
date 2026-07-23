import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/_components/Header';
import Footer from '@/app/_components/Footer';
import { serverFetch } from '@/lib/api/server-fetch';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatKSTLongDate } from '@/lib/kst';
import type { AnnouncementItem } from '@/types/announcement';
import type { PaginatedResponse } from '@/types/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getAnnouncementItem = cache(async (id: string) => {
  const { data } = await serverFetch<{ success: boolean; data: AnnouncementItem }>(`/announcements/${id}`);
  return data;
});

export async function generateStaticParams() {
  try {
    const { data } = await serverFetch<PaginatedResponse<AnnouncementItem>>('/announcements?page=1&limit=50', 3600);
    return data.map((item) => ({ id: item.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await getAnnouncementItem(id);
    const cover = item.images[0];
    return {
      title: `${item.title} | 이루빛터 채용 공고`,
      description: item.content.slice(0, 160),
      alternates: { canonical: `/announcements/${id}` },
      openGraph: {
        title: `${item.title} | 이루빛터 채용 공고`,
        description: item.content.slice(0, 160),
        images: cover?.imageCardUrl
          ? [{ url: cover.imageCardUrl }]
          : undefined,
      },
    };
  } catch {
    return { title: '채용 공고 | 이루빛터' };
  }
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { id } = await params;

  let item: AnnouncementItem;
  try {
    item = await getAnnouncementItem(id);
  } catch {
    notFound();
  }

  const date = formatKSTLongDate(item.createdAt);

  // JSON-LD
  const coverImage = item.images[0];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    datePublished: item.createdAt,
    dateModified: item.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: '이루빛터',
    },
    ...(coverImage?.imageCardUrl ? { image: coverImage.imageCardUrl } : {}),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          {/* Back link */}
          <Link href="/announcements" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-8 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            공고 목록
          </Link>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {item.title}
          </h1>
          <p className="text-gray-500 mb-8">{date}</p>

          {/* Images */}
          {item.images.length > 0 && (
            <div className="space-y-6 mb-8">
              {item.images.map((img, idx) => (
                <div key={img.id} className="relative aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden">
                  <Image
                    src={img.imageCardUrl || img.imageUrl}
                    alt={img.imageAlt || `${item.title} - ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                    priority={idx === 0}
                    {...(img.imageBlurData
                      ? {
                          placeholder: 'blur' as const,
                          blurDataURL: img.imageBlurData,
                        }
                      : {})}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-gray max-w-none whitespace-pre-line text-gray-700 leading-relaxed">
            {item.content}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
