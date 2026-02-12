'use client';

import { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { useEmployeeDetail } from '@/hooks/useEmployeeQuery';
import { useUploadProfileImage, useDeleteProfileImage } from '@/hooks/useEmployeeMutations';
import { NUM_TO_LABEL } from '@/lib/workDays';
import { useAdminEditForm } from './_hooks/useAdminEditForm';
import { useAdminAttendanceHistory } from './_hooks/useAdminAttendanceHistory';
import { useAdminEmployeeFiles } from './_hooks/useAdminEmployeeFiles';
import { ProfileCard } from './_components/ProfileCard';
import { CompanyNoteSection } from './_components/CompanyNoteSection';
import { AdminNoteSection } from './_components/AdminNoteSection';
import { ResignInfoSection } from './_components/ResignInfoSection';
import { AttendanceHistoryTable } from './_components/AttendanceHistoryTable';
import { WorkInfoSection } from './_components/WorkInfoSection';
import { DocumentSection } from './_components/DocumentSection';
import { FileUploadModal } from './_components/FileUploadModal';
import { WorkTimeEditModal } from './_components/WorkTimeEditModal';
import { WorkDoneModal } from './_components/WorkDoneModal';

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  const toast = useToast();
  const { data: worker, isLoading } = useEmployeeDetail(employeeId);
  const editForm = useAdminEditForm(employeeId);
  const attendance = useAdminAttendanceHistory(employeeId);
  const files = useAdminEmployeeFiles(employeeId);
  const uploadImage = useUploadProfileImage(employeeId);
  const deleteImage = useDeleteProfileImage(employeeId);

  const handleUploadImage = (base64: string) => {
    uploadImage.mutate(base64, {
      onSuccess: () => toast.success('프로필 이미지가 업로드되었습니다.'),
      onError: () => toast.error('프로필 이미지 업로드에 실패했습니다.'),
    });
  };

  const handleDeleteImage = () => {
    deleteImage.mutate(undefined, {
      onSuccess: () => toast.success('프로필 이미지가 삭제되었습니다.'),
      onError: () => toast.error('프로필 이미지 삭제에 실패했습니다.'),
    });
  };

  const workDays = useMemo(
    () => (worker?.workDays ?? []).map((d) => NUM_TO_LABEL[d]).filter(Boolean),
    [worker?.workDays],
  );
  const workStartTime = worker?.workStartTime ? worker.workStartTime.slice(0, 5) : '09:00';

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
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div>
                    <Skeleton className="w-24 h-5 mb-2" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4" />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Skeleton className="w-24 h-5 mb-4" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Skeleton className="w-32 h-6 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Skeleton className="w-28 h-6 mb-4" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">근로자 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/admin/employees')}
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
            <ProfileCard
              worker={worker}
              isUploadingImage={uploadImage.isPending || deleteImage.isPending}
              onUploadImage={handleUploadImage}
              onDeleteImage={handleDeleteImage}
            />
            {worker.companyNote && <CompanyNoteSection companyNote={worker.companyNote} />}
            <AdminNoteSection
              notes={worker.adminNote || ''}
              isEditingNotes={editForm.isEditingNotes}
              tempNotes={editForm.tempNotes}
              setTempNotes={editForm.setTempNotes}
              savingNotes={editForm.savingNotes}
              onEdit={() => editForm.handleEditNotes(worker)}
              onSave={editForm.handleSaveNotes}
              onCancel={editForm.handleCancelNotes}
            />
            {!worker.isActive && <ResignInfoSection worker={worker} />}
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceHistoryTable
              records={attendance.attendanceHistory}
              onEditWorkTime={attendance.handleEditWorkTime}
              onOpenWorkDone={attendance.openWorkDoneModal}
              currentPage={attendance.currentPage}
              pagination={attendance.pagination}
              onNextPage={attendance.goToNextPage}
              onPrevPage={attendance.goToPrevPage}
              startDate={attendance.startDate}
              endDate={attendance.endDate}
              onStartDateChange={attendance.handleStartDateChange}
              onEndDateChange={attendance.handleEndDateChange}
              onClearDates={attendance.handleClearDates}
            />
            <WorkInfoSection
              workDays={workDays}
              workStartTime={workStartTime}
              isEditingWorkInfo={editForm.isEditingWorkInfo}
              tempWorkDays={editForm.tempWorkDays}
              tempWorkStartTime={editForm.tempWorkStartTime}
              setTempWorkStartTime={editForm.setTempWorkStartTime}
              savingWorkInfo={editForm.savingWorkInfo}
              toggleTempWorkDay={editForm.toggleTempWorkDay}
              onEdit={() => editForm.handleEditWorkInfo(worker)}
              onSave={editForm.handleSaveWorkInfo}
              onCancel={editForm.handleCancelEditWorkInfo}
            />
            <DocumentSection
              documents={files.documents}
              onOpenUploadModal={() => files.setShowUploadModal(true)}
              onDeleteFile={files.handleDeleteFile}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <FileUploadModal
        isOpen={files.showUploadModal}
        onClose={() => files.setShowUploadModal(false)}
        uploadDocType={files.uploadDocType}
        setUploadDocType={files.setUploadDocType}
        uploadFile={files.uploadFile}
        setUploadFile={files.setUploadFile}
        uploading={files.uploading}
        onUpload={files.handleUpload}
      />
      <WorkTimeEditModal
        isOpen={attendance.isEditingWorkTime}
        onClose={() => attendance.setIsEditingWorkTime(false)}
        editedWorkTime={attendance.editedWorkTime}
        setEditedWorkTime={attendance.setEditedWorkTime}
        savingWorkTime={attendance.savingWorkTime}
        onSave={attendance.handleSaveWorkTime}
      />
      <WorkDoneModal
        isOpen={attendance.showWorkDoneModal}
        onClose={attendance.closeWorkDoneModal}
        selectedWorkDone={attendance.selectedWorkDone}
      />
    </div>
  );
}
