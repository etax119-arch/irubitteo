import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostImageList from '@/components/PostImageList';
import Header from '@/app/_components/Header';
import Footer from '@/app/_components/Footer';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import { serverFetch } from '@/lib/api/server-fetch';
import { formatKSTLongDate } from '@/lib/kst';
import { resolvePostThumbnail } from '@/lib/postThumbnail';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { StoryItem } from '@/types/story';
import type { PaginatedResponse } from '@/types/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getStoryItem = cache(async (id: string) => {
  const { data } = await serverFetch<{ success: boolean; data: StoryItem }>(`/stories/${id}`);
  return data;
});

export async function generateStaticParams() {
  try {
    const { data } = await serverFetch<PaginatedResponse<StoryItem>>('/stories?page=1&limit=50', 3600);
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
    const item = await getStoryItem(id);
    const ogImage = resolvePostThumbnail(item)?.src;
    return {
      title: `${item.title} | 빛터 이야기`,
      description: item.content.slice(0, 160),
      alternates: { canonical: `/story/${id}` },
      openGraph: {
        title: `${item.title} | 빛터 이야기`,
        description: item.content.slice(0, 160),
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
    };
  } catch {
    return { title: '이야기 | 이루빛터' };
  }
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { id } = await params;

  let item: StoryItem;
  try {
    item = await getStoryItem(id);
  } catch {
    notFound();
  }

  const date = formatKSTLongDate(item.createdAt);

  // JSON-LD
  const jsonLdImage = resolvePostThumbnail(item)?.src;
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
    ...(jsonLdImage ? { image: jsonLdImage } : {}),
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
          <Link href="/story" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-8 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            이야기 목록
          </Link>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {item.title}
          </h1>
          <p className="text-gray-500 mb-8">{date}</p>

          {/* Video (대표사진은 목록 전용이라 여기서 노출하지 않음) */}
          {item.videoUrl && <YoutubeEmbed url={item.videoUrl} title={item.title} />}

          {/* Images */}
          <PostImageList images={item.images} title={item.title} />

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
