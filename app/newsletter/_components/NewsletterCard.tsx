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
      className="group flex items-stretch bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:ring-offset-2"
    >
      {thumbnail && (
        <div className="relative shrink-0 w-28 sm:w-48 min-h-[7rem] sm:min-h-[9rem] bg-gray-100 overflow-hidden">
          <Image
            src={thumbnail.src}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 112px, 192px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
            placeholder={thumbnail.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={thumbnail.blurDataURL}
          />
        </div>
      )}
      <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-duru-orange-600 transition-colors line-clamp-2 break-keep">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{date}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2 break-keep">
          {item.content}
        </p>
      </div>
    </Link>
  );
}
