'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { CompanyCard } from '../_components/CompanyCard';
import { AddCompanyModal } from '../_components/AddCompanyModal';
import { useCompanies } from '@/hooks/useCompanyQuery';
import { useCreateCompany } from '@/hooks/useCompanyMutations';
import { extractErrorMessage } from '@/lib/api/error';
import { useToast } from '@/components/ui/Toast';
import type { CompanyWithEmployeeCount, CompanyCreateInput } from '@/types/company';

export default function AdminCompaniesPage() {
  const router = useRouter();
  const toast = useToast();
  const companiesQuery = useCompanies();
  const createMutation = useCreateCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const companies = companiesQuery.data ?? [];

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

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">회원사 관리</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="회사명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors"
          >
            + 회원사 추가
          </button>
        </div>
      </div>

      {companiesQuery.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
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
        <div className="grid grid-cols-1 gap-4">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onViewDetail={handleViewDetail}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 회원사가 없습니다.'}
            </p>
          )}
        </div>
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
