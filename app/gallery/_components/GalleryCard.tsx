import Link from 'next/link';
import Image from 'next/image';
import type { GalleryItem } from '@/types/gallery';

interface GalleryCardProps {
  item: GalleryItem;
  priority?: boolean;
}

export default function GalleryCard({ item, priority = false }: GalleryCardProps) {
  const alt = item.imageAlt || `${item.title} - ${item.artistName}`;
  const imageSrc = item.imageCardUrl || item.imageUrl;

  return (
    <Link
      href={`/gallery/${item.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:ring-offset-2"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={priority}
          {...(item.imageBlurData
            ? { placeholder: 'blur' as const, blurDataURL: item.imageBlurData }
            : {})}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-duru-orange-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{item.artistName}</p>
        {item.disabilityType && (
          <span className="inline-block mt-2 text-xs bg-duru-orange-50 text-duru-orange-600 px-2 py-0.5 rounded-full">
            {item.disabilityType}
          </span>
        )}
      </div>
    </Link>
  );
}
