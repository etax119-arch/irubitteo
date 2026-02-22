import type { GalleryItem } from '@/types/gallery';
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <GalleryCard key={item.id} item={item} priority={index < 3} />
      ))}
    </div>
  );
}
