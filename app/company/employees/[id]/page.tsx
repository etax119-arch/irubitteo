'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { useEmployeeDetail } from '@/hooks/useEmployeeQuery';
import { useUploadProfileImage, useDeleteProfileImage } from '@/hooks/useEmployeeMutations';
import { useEmployeeEditForm } from './_hooks/useEmployeeEditForm';
import { useAttendanceHistory } from './_hooks/useAttendanceHistory';
import { useEmployeeFiles } from './_hooks/useEmployeeFiles';
import { NUM_TO_LABEL } from '@/lib/workDays';
import { ProfileCard } from './_components/ProfileCard';
import { DisabilityInfoSection } from './_components/DisabilityInfoSection';
import { NotesSection } from './_components/NotesSection';
import { ResignSection } from './_components/ResignSection';
import { AttendanceHistoryTable } from './_components/AttendanceHistoryTable';
import { WorkInfoSection } from './_components/WorkInfoSection';
import { DocumentSection } from './_components/DocumentSection';
import { UploadModal } from './_components/UploadModal';
import { WorkTimeEditModal } from './_components/WorkTimeEditModal';
import { WorkDoneModal } from './_components/WorkDoneModal';
import { ResignModal } from './_components/ResignModal';

export default function CompanyEmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = Array.isArray(params.id) ? params.id[0] : (params.id ?? '');

  const toast = useToast();
  const { data: employee, isLoading, error } = useEmployeeDetail(employeeId);
  const editForm = useEmployeeEditForm(employeeId);
  const attendance = useAttendanceHistory(employeeId);
  const employeeFiles = useEmployeeFiles(employeeId);
  const uploadImage = useUploadProfileImage(employeeId);
  const deleteImage = useDeleteProfileImage(employeeId);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadImage = (blob: Blob) => {
    uploadImage.mutate(blob, {
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
    () => (employee?.workDays ?? []).map((n: number) => NUM_TO_LABEL[n] ?? ''),
    [employee?.workDays],
  );

  if (isLoading) {
    return (
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Skeleton className="w-24 h-5 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4" />
                ))}
              </div>
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
    );
  }

  if (error || !employee) {
    return (
      <div className="text-center py-20" role="alert">
        <p className="text-gray-500">{error ? '근로자 정보를 불러오는데 실패했습니다.' : '근로자 정보를 찾을 수 없습니다.'}</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => router.push('/company/employees')}
        >
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto pb-8">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="닫기"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 기본 정보 */}
          <div className="space-y-6">
            <ProfileCard
              employee={employee}
              isEditing={editForm.isEditingProfile}
              isSaving={editForm.isSavingProfile}
              profileForm={editForm.profileForm}
              onEdit={() => editForm.handleEditProfile(employee)}
              onSave={() => editForm.handleSaveProfile(employee)}
              onCancel={editForm.handleCancelProfile}
              onUpdateForm={editForm.updateProfileForm}
              isUploadingImage={uploadImage.isPending || deleteImage.isPending}
              onUploadImage={handleUploadImage}
              onDeleteImage={handleDeleteImage}
            />
            <DisabilityInfoSection
              employee={employee}
              isEditing={editForm.isEditingDisability}
              isSaving={editForm.isSavingDisability}
              tempDisabilityType={editForm.tempDisabilityType}
              setTempDisabilityType={editForm.setTempDisabilityType}
              tempSeverity={editForm.tempDisabilitySeverity}
              setTempSeverity={editForm.setTempDisabilitySeverity}
              tempRecognitionDate={editForm.tempDisabilityRecognitionDate}
              setTempRecognitionDate={editForm.setTempDisabilityRecognitionDate}
              onEdit={() => editForm.handleEditDisability(employee)}
              onSave={editForm.handleSaveDisability}
              onCancel={editForm.handleCancelDisability}
            />
            <NotesSection
              notes={employee.companyNote || ''}
              isEditing={editForm.isEditingNotes}
              isSaving={editForm.isSavingNotes}
              tempNotes={editForm.tempNotes}
              setTempNotes={editForm.setTempNotes}
              onEdit={() => editForm.handleEditNotes(employee)}
              onSave={editForm.handleSaveNotes}
              onCancel={editForm.handleCancelNotes}
            />
            <ResignSection employee={employee} onOpenResignModal={editForm.openResignModal} />
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceHistoryTable
              records={attendance.attendanceHistory}
              isLoading={attendance.isLoadingAttendance}
              error={attendance.attendanceError}
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
              workStartTime={employee.workStartTime || ''}
              workEndTime={employee.workEndTime || ''}
              isEditing={editForm.isEditingWorkInfo}
              isSaving={editForm.isSavingWorkInfo}
              tempWorkDays={editForm.tempWorkDays}
              tempWorkStartTime={editForm.tempWorkStartTime}
              tempWorkEndTime={editForm.tempWorkEndTime}
              setTempWorkStartTime={editForm.setTempWorkStartTime}
              setTempWorkEndTime={editForm.setTempWorkEndTime}
              toggleTempWorkDay={editForm.toggleTempWorkDay}
              onEdit={() => editForm.handleEditWorkInfo(employee)}
              onSave={editForm.handleSaveWorkInfo}
              onCancel={editForm.handleCancelEditWorkInfo}
            />
            <DocumentSection
              files={employeeFiles.files}
              isLoading={employeeFiles.isLoading}
              onOpenUploadModal={() => setShowUploadModal(true)}
              onDelete={employeeFiles.remove}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={employeeFiles.upload}
        isUploading={employeeFiles.isUploading}
      />
      <WorkTimeEditModal
        isOpen={attendance.isEditingWorkTime}
        onClose={() => attendance.setIsEditingWorkTime(false)}
        editedWorkTime={attendance.editedWorkTime}
        setEditedWorkTime={attendance.setEditedWorkTime}
        onSave={attendance.handleSaveWorkTime}
        isSaving={attendance.isSaving}
      />
      <WorkDoneModal
        isOpen={attendance.showWorkDoneModal}
        onClose={attendance.closeWorkDoneModal}
        selectedWorkDone={attendance.selectedWorkDone}
      />
      <ResignModal
        isOpen={editForm.showResignModal}
        onClose={editForm.closeResignModal}
        employeeName={employee.name}
        resignForm={editForm.resignForm}
        isSubmitting={editForm.isSubmittingResign}
        onUpdateForm={editForm.updateResignForm}
        onSubmit={editForm.handleSubmitResign}
      />
    </div>
  );
}
