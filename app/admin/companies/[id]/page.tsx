'use client';

import { useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCompanyDetail, useCompanyEmployees } from '../../_hooks/useCompanyQuery';
import { useCompanyFilesQuery, useUploadCompanyFile, useDeleteCompanyFile } from '../../_hooks/useCompanyFiles';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import { useCompanyDetailUI } from './_hooks/useCompanyDetailUI';
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
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: company, isLoading } = useCompanyDetail(id);
  const { data: employees = [] } = useCompanyEmployees(id);
  const { data: files = [] } = useCompanyFilesQuery(id);
  const uploadFile = useUploadCompanyFile(id);
  const deleteFile = useDeleteCompanyFile(id);
  const detailUI = useCompanyDetailUI(id);

  const handleFileUpload = async (file: File) => {
    try {
      await uploadFile.mutateAsync(file);
      toast.success('파일이 업로드되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      await deleteFile.mutateAsync(fileId);
      toast.success('파일이 삭제되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-duru-ivory -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto pb-8">
          <div className="flex justify-end mb-2">
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-14 h-14 rounded-lg" />
                  <div>
                    <Skeleton className="w-28 h-5 mb-2" />
                    <Skeleton className="w-36 h-4" />
                  </div>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4" />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Skeleton className="w-20 h-5 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Skeleton className="w-28 h-6 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Skeleton className="w-24 h-6 mb-4" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
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

  const pmInfo = {
    name: company.pmContactName || '',
    phone: company.pmContactPhone || '',
    email: company.pmContactEmail || '',
  };

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
              company={company}
              isEditing={detailUI.isEditing}
              editedInfo={detailUI.editedInfo}
              setEditedInfo={detailUI.setEditedInfo}
              onStartEdit={() => detailUI.handleStartEdit(company)}
              onSaveEdit={detailUI.handleSaveEdit}
              onCancelEdit={() => detailUI.setIsEditing(false)}
            />
            <PMInfoCard
              pmInfo={pmInfo}
              isEditingPm={detailUI.isEditingPm}
              editedPm={detailUI.editedPm}
              setEditedPm={detailUI.setEditedPm}
              copiedEmail={detailUI.copiedEmail}
              onEdit={() => detailUI.handleEditPm(company)}
              onSave={detailUI.handleSavePm}
              onCancel={detailUI.handleCancelPmEdit}
              onCopyEmail={() => detailUI.handleCopyEmail(company.pmContactEmail)}
            />
            <ResignSection
              company={company}
              onOpenResignModal={() => detailUI.setShowResignModal(true)}
            />
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <EmployeeListSection
              employees={employees}
              onViewEmployee={(employeeId) => router.push(`/admin/employees/${employeeId}`)}
            />
            <FileSection
              files={files}
              isUploading={uploadFile.isPending}
              fileInputRef={fileInputRef}
              onFileChange={handleFileUpload}
              onDelete={handleFileDelete}
            />
          </div>
        </div>
      </div>

      {/* 회원사 탈퇴 모달 */}
      <ResignModal
        isOpen={detailUI.showResignModal}
        onClose={() => detailUI.setShowResignModal(false)}
        companyName={company.name}
        resignForm={detailUI.resignForm}
        setResignForm={detailUI.setResignForm}
        onSubmit={detailUI.handleResign}
      />
    </div>
  );
}
