import Link from 'next/link';
import type { NewsletterItem } from '@/types/newsletter';

interface NewsletterCardProps {
  item: NewsletterItem;
}

export default function NewsletterCard({ item }: NewsletterCardProps) {
  const date = new Date(item.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/newsletter/${item.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:ring-offset-2"
    >
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
