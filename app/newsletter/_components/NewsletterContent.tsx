'use client';

import { useState, useCallback } from 'react';
import type { NewsletterItem } from '@/types/newsletter';
import type { PaginatedResponse } from '@/types/api';
import { usePublicNewsletters } from '../_hooks/usePublicNewsletters';
import NewsletterSearch from './NewsletterSearch';
import NewsletterCard from './NewsletterCard';
import NewsletterPagination from './NewsletterPagination';

type Props = {
  initialData?: PaginatedResponse<NewsletterItem> | null;
};

export default function NewsletterContent({ initialData }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isPlaceholderData } = usePublicNewsletters(page, 12, search, initialData ?? undefined);
  const newsletters = data?.newsletters ?? [];
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
          <NewsletterSearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Newsletter List */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {newsletters.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {search
              ? '검색 결과가 없습니다.'
              : '등록된 소식지가 없습니다.'}
          </div>
        ) : (
          <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <div className="space-y-4">
              {newsletters.map((item) => (
                <NewsletterCard key={item.id} item={item} />
              ))}
            </div>
            <NewsletterPagination
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
