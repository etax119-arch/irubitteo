'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { useCompanyDetail } from './_hooks/useCompanyDetail';
import { useCompanyFiles } from './_hooks/useCompanyFiles';
import { CompanyProfileCard } from './_components/CompanyProfileCard';
import { PMInfoCard } from './_components/PMInfoCard';
import { ResignSection } from './_components/ResignSection';
import { EmployeeListSection } from './_components/EmployeeListSection';
import { FileSection } from './_components/FileSection';
import { ResignModal } from './_components/ResignModal';

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fileHook = useCompanyFiles(id);
  const detail = useCompanyDetail(id, fileHook.setFiles);

  useEffect(() => {
    detail.fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (detail.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
      </div>
    );
  }

  if (!detail.company) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">회사 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/admin/companies')}
          className="mt-4 text-duru-orange-600 hover:text-duru-orange-700 font-semibold"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-duru-ivory -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto pb-8">
        {/* 닫기 버튼 */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="닫기"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 기본 정보 */}
          <div className="space-y-6">
            <CompanyProfileCard
              company={detail.company}
              isEditing={detail.isEditing}
              editedInfo={detail.editedInfo}
              setEditedInfo={detail.setEditedInfo}
              onStartEdit={detail.handleStartEdit}
              onSaveEdit={detail.handleSaveEdit}
              onCancelEdit={() => detail.setIsEditing(false)}
            />
            <PMInfoCard
              pmInfo={detail.pmInfo}
              isEditingPm={detail.isEditingPm}
              editedPm={detail.editedPm}
              setEditedPm={detail.setEditedPm}
              copiedEmail={detail.copiedEmail}
              onEdit={detail.handleEditPm}
              onSave={detail.handleSavePm}
              onCancel={detail.handleCancelPmEdit}
              onCopyEmail={detail.handleCopyEmail}
            />
            <ResignSection
              company={detail.company}
              onOpenResignModal={() => detail.setShowResignModal(true)}
            />
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <EmployeeListSection
              employees={detail.employees}
              onViewEmployee={(employeeId) => router.push(`/admin/employees/${employeeId}`)}
            />
            <FileSection
              files={fileHook.files}
              companyId={id}
              isUploading={fileHook.isUploading}
              fileInputRef={fileHook.fileInputRef}
              onFileChange={fileHook.handleFileUpload}
              onDelete={fileHook.handleFileDelete}
            />
          </div>
        </div>
      </div>

      {/* 회원사 탈퇴 모달 */}
      <ResignModal
        isOpen={detail.showResignModal}
        onClose={() => detail.setShowResignModal(false)}
        companyName={detail.company.name}
        resignForm={detail.resignForm}
        setResignForm={detail.setResignForm}
        onSubmit={detail.handleResign}
      />
    </div>
  );
}
