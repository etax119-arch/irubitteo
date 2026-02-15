'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { CompanyCard } from '../_components/CompanyCard';
import { AddCompanyModal } from '../_components/AddCompanyModal';
import { useCompanies } from '../_hooks/useCompanyQuery';
import { useCreateCompany } from '../_hooks/useCompanyMutations';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import type { CompanyWithEmployeeCount, CompanyCreateInput } from '@/types/company';
import type { CompanyFilter } from '@/types/adminDashboard';

const filters: { id: CompanyFilter; label: string }[] = [
  { id: 'active', label: '계약중' },
  { id: 'inactive', label: '계약해제' },
];

export default function AdminCompaniesPage() {
  const router = useRouter();
  const toast = useToast();
  const createMutation = useCreateCompany();
  const [filter, setFilter] = useState<CompanyFilter>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const companiesQuery = useCompanies(filter, debouncedSearch, page);
  const companies = companiesQuery.data?.companies ?? [];
  const pagination = companiesQuery.data?.pagination;

  const handleViewDetail = (company: CompanyWithEmployeeCount) => {
    router.push(`/admin/companies/${company.id}`);
  };

  const handleAddCompany = (data: CompanyCreateInput) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('회원사가 추가되었습니다.');
        setShowAddModal(false);
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">회원사 관리</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => { setFilter(f.id); setPage(1); }}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap',
                  filter === f.id
                    ? 'bg-white text-duru-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="회사명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            leftIcon={<Search className="w-5 h-5" />}
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors whitespace-nowrap shrink-0"
          >
            + 회원사 추가
          </button>
        </div>
      </div>

      {companiesQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="w-32 h-5 mb-2" />
                  <Skeleton className="w-48 h-4" />
                </div>
                <Skeleton className="w-20 h-8 rounded-lg" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : companiesQuery.error ? (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">회원사 목록을 불러오는데 실패했습니다.</p>
          <button
            onClick={() => companiesQuery.refetch()}
            className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {companies.length > 0 ? (
              companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onViewDetail={handleViewDetail}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                {searchQuery ? '검색 결과가 없습니다.' : filter === 'active' ? '계약중인 회원사가 없습니다.' : '계약해제된 회원사가 없습니다.'}
              </p>
            )}
          </div>
          {pagination && (
            <PaginationBar
              currentPage={page}
              pagination={pagination}
              onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
              onNextPage={() => setPage((p) => p + 1)}
            />
          )}
        </>
      )}

      <AddCompanyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCompany}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
