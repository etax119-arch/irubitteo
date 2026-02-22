'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination } from '@/types/api';

interface NewsletterPaginationProps {
  pagination: Pagination;
  currentPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function NewsletterPagination({
  pagination,
  currentPage,
  onPrevPage,
  onNextPage,
}: NewsletterPaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:text-gray-300 disabled:bg-gray-50 disabled:border-gray-200 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        이전
      </button>

      <span className="text-sm text-gray-600">
        {currentPage} / {pagination.totalPages}
        <span className="text-gray-400 ml-1.5">
          (총 {pagination.total}건)
        </span>
      </span>

      <button
        onClick={onNextPage}
        disabled={currentPage >= pagination.totalPages}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:text-gray-300 disabled:bg-gray-50 disabled:border-gray-200 disabled:cursor-not-allowed"
      >
        다음
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
