'use client';

import { Download, Eye } from 'lucide-react';

const documentTemplates = [
  '근로계약서',
  '출근확인서',
  '경력증명서',
  '개인정보 동의서',
  '장애인 고용계획서',
];

const statisticsReports = [
  '월별 출근율 리포트',
  '회사별 정산 리포트',
  '장애유형별 통계',
  '지역별 배치 현황',
  '계약 현황 리포트',
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">리포트</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">문서 템플릿</h3>
          <div className="space-y-2">
            {documentTemplates.map((doc) => (
              <button
                key={doc}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900">{doc}</span>
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">통계 리포트</h3>
          <div className="space-y-2">
            {statisticsReports.map((report) => (
              <button
                key={report}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900">{report}</span>
                <Eye className="w-5 h-5 text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
