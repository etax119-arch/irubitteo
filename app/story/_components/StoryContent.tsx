'use client';

import { useState, useCallback } from 'react';
import type { StoryItem } from '@/types/story';
import type { PaginatedResponse } from '@/types/api';
import { usePublicStories } from '../_hooks/usePublicStories';
import StorySearch from './StorySearch';
import StoryCard from './StoryCard';
import StoryPagination from './StoryPagination';

type Props = {
  initialData?: PaginatedResponse<StoryItem> | null;
};

export default function StoryContent({ initialData }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isPlaceholderData } = usePublicStories(page, 12, search, initialData ?? undefined);
  const stories = data?.stories ?? [];
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
          <StorySearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Story List */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {stories.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {search
              ? '검색 결과가 없습니다.'
              : '등록된 이야기가 없습니다.'}
          </div>
        ) : (
          <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <div className="space-y-4">
              {stories.map((item, index) => (
                <StoryCard key={item.id} item={item} priority={index < 3} />
              ))}
            </div>
            <StoryPagination
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
