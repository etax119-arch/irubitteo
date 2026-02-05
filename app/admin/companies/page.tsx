'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { CompanyCard } from '../_components/CompanyCard';
import { AddCompanyModal } from '../_components/AddCompanyModal';
import { companiesData as initialCompanies } from '../_data/dummyData';
import type { Company, AddCompanyForm, PMInfo } from '@/types/adminDashboard';

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleViewDetail = (company: Company) => {
    router.push(`/admin/companies/${company.id}`);
  };

  const handleRevenueUpdate = (companyId: number, newRevenue: number) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId ? { ...company, revenue: newRevenue } : company
      )
    );
  };

  const handleAddCompany = (form: AddCompanyForm, pmInfo: PMInfo) => {
    const newCompany: Company = {
      id: companies.length + 1,
      name: form.companyName,
      industry: '미정',
      location: form.address || '미정',
      workers: 0,
      contractEnd: form.contractStartDate,
      status: 'active',
      revenue: 0,
      pm: pmInfo,
    };
    setCompanies([...companies, newCompany]);
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

      <div className="grid grid-cols-1 gap-4">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onViewDetail={handleViewDetail}
            onRevenueUpdate={handleRevenueUpdate}
          />
        ))}
      </div>

      <AddCompanyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCompany}
      />
    </div>
  );
}
