'use client';

import { useState, useCallback } from 'react';
import type { AnnouncementItem } from '@/types/announcement';
import type { PaginatedResponse } from '@/types/api';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { usePublicAnnouncements } from '../_hooks/usePublicAnnouncements';
import AnnouncementSearch from './AnnouncementSearch';
import AnnouncementCard from './AnnouncementCard';

type Props = {
  initialData?: PaginatedResponse<AnnouncementItem> | null;
};

export default function AnnouncementContent({ initialData }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isPlaceholderData } = usePublicAnnouncements(page, 12, search, initialData ?? undefined);
  const announcements = data?.announcements ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 0 };

  const handleSearch = useCallback((term: string) => {
    setSearch(term);
    setPage(1);
  }, []);

  return (
    <>
      {/* Search */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-12">
        <div className="text-center">
          <AnnouncementSearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Announcement List */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {announcements.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {search
              ? '검색 결과가 없습니다.'
              : '등록된 공고가 없습니다.'}
          </div>
        ) : (
          <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <div className="space-y-4">
              {announcements.map((item, index) => (
                <AnnouncementCard key={item.id} item={item} priority={index < 3} />
              ))}
            </div>
            <PaginationBar
              pagination={pagination}
              currentPage={page}
              onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
              onNextPage={() => setPage((p) => p + 1)}
            />
          </div>
        )}
      </section>
    </>
  );
}
