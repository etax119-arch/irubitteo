'use client';

import { Building2 } from 'lucide-react';

type CompanyNoteSectionProps = {
  companyNote: string;
};

export function CompanyNoteSection({ companyNote }: CompanyNoteSectionProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          기업 비고란
        </h3>
      </div>
      <div className="bg-blue-50 rounded-lg p-3 min-h-[60px]">
        <p className="text-xs text-gray-700 whitespace-pre-wrap">
          {companyNote}
        </p>
      </div>
    </div>
  );
}
