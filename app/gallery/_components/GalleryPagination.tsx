'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination } from '@/types/api';

interface GalleryPaginationProps {
  pagination: Pagination;
  currentPage: number;
}

export default function GalleryPagination({
  pagination,
  currentPage,
}: GalleryPaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      {currentPage > 1 ? (
        <Link
          href={`/gallery?page=${currentPage - 1}`}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          이전
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          이전
        </span>
      )}

      <span className="text-sm text-gray-600">
        {currentPage} / {pagination.totalPages}
        <span className="text-gray-400 ml-1.5">
          (총 {pagination.total}건)
        </span>
      </span>

      {currentPage < pagination.totalPages ? (
        <Link
          href={`/gallery?page=${currentPage + 1}`}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          다음
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
          다음
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
