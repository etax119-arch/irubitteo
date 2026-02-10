'use client';

import FileSection from './_components/FileSection';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">리포트</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileSection title="문서 템플릿" category="TEMPLATE" />
        <FileSection title="통계 리포트" category="REPORT" />
      </div>
    </div>
  );
}
