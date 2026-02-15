import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination } from '@/types/api';

interface PaginationBarProps {
  currentPage: number;
  pagination: Pagination;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function PaginationBar({ currentPage, pagination, onPrevPage, onNextPage }: PaginationBarProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        이전
      </button>
      <span className="text-sm text-gray-600">
        {currentPage} / {pagination.totalPages}
        <span className="text-gray-400 ml-1.5">(총 {pagination.total}건)</span>
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage >= pagination.totalPages}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        다음
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
