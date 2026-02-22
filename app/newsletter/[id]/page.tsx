import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/_components/Header';
import Footer from '@/app/_components/Footer';
import { serverFetch } from '@/lib/api/server-fetch';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { NewsletterItem } from '@/types/newsletter';
import type { PaginatedResponse } from '@/types/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getNewsletterItem = cache(async (id: string) => {
  const { data } = await serverFetch<{ success: boolean; data: NewsletterItem }>(`/newsletters/${id}`);
  return data;
});

export async function generateStaticParams() {
  try {
    const { data } = await serverFetch<PaginatedResponse<NewsletterItem>>('/newsletters?page=1&limit=50', 3600);
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
    const item = await getNewsletterItem(id);
    return {
      title: `${item.title} | 빛터 소식지`,
      description: item.content.slice(0, 160),
      alternates: { canonical: `/newsletter/${id}` },
      openGraph: {
        title: `${item.title} | 빛터 소식지`,
        description: item.content.slice(0, 160),
        images: item.imageCardUrl
          ? [{ url: item.imageCardUrl }]
          : undefined,
      },
    };
  } catch {
    return { title: '소식지 | 이루빛터' };
  }
}

export default async function NewsletterDetailPage({ params }: PageProps) {
  const { id } = await params;

  let item: NewsletterItem;
  try {
    item = await getNewsletterItem(id);
  } catch {
    notFound();
  }

  const date = new Date(item.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // JSON-LD
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
    ...(item.imageCardUrl ? { image: item.imageCardUrl } : {}),
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
          <Link href="/newsletter" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-8 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            소식지 목록
          </Link>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {item.title}
          </h1>
          <p className="text-gray-500 mb-8">{date}</p>

          {/* Cover image */}
          {(item.imageCardUrl || item.imageUrl) && (
            <div className="relative aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden mb-8">
              <Image
                src={item.imageCardUrl || item.imageUrl!}
                alt={item.imageAlt || item.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
                {...(item.imageBlurData
                  ? {
                      placeholder: 'blur' as const,
                      blurDataURL: item.imageBlurData,
                    }
                  : {})}
              />
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
