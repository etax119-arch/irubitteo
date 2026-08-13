import Link from 'next/link';
import Image from 'next/image';
import { formatKSTLongDate } from '@/lib/kst';
import { resolvePostThumbnail } from '@/lib/postThumbnail';
import type { NewsletterItem } from '@/types/newsletter';

interface NewsletterCardProps {
  item: NewsletterItem;
  priority?: boolean;
}

export default function NewsletterCard({ item, priority = false }: NewsletterCardProps) {
  const date = formatKSTLongDate(item.createdAt);
  const thumbnail = resolvePostThumbnail(item);

  return (
    <Link
      href={`/newsletter/${item.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:ring-offset-2"
    >
      {thumbnail && (
        <div className="relative aspect-[16/9] bg-gray-100">
          <Image
            src={thumbnail.src}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
            placeholder={thumbnail.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={thumbnail.blurDataURL}
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-duru-orange-600 transition-colors truncate">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{date}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {item.content}
          </p>
        </div>
      </div>
    </Link>
  );
}
