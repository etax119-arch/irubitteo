'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEmployeeDetail } from '../_hooks/useEmployeeDetail';
import { useEmployeeNotes } from '../_hooks/useEmployeeNotes';
import { useEmployeeWorkInfo } from '../_hooks/useEmployeeWorkInfo';
import { useEmployeeDisability } from '../_hooks/useEmployeeDisability';
import { useAttendanceHistory } from '../_hooks/useAttendanceHistory';
import { useResign } from '../_hooks/useResign';
import { useEmployeeFiles } from '../_hooks/useEmployeeFiles';
import { useEmployeeProfile } from '../_hooks/useEmployeeProfile';
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

  const detail = useEmployeeDetail(employeeId);
  const notesHook = useEmployeeNotes(employeeId);
  const workInfoHook = useEmployeeWorkInfo(employeeId);
  const disabilityHook = useEmployeeDisability(employeeId, detail.employee);
  const attendance = useAttendanceHistory(employeeId, { onSaved: detail.fetchEmployee });
  const resign = useResign({ employeeId, onSuccess: detail.fetchEmployee });
  const employeeFiles = useEmployeeFiles(employeeId);
  const profileHook = useEmployeeProfile(employeeId);

  useEffect(() => {
    if (detail.employee) {
      notesHook.syncFromEmployee(detail.employee);
      workInfoHook.syncFromEmployee(detail.employee);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.employee]);

  const handleSaveNotes = () => notesHook.handleSaveNotes(detail.setEmployee);
  const handleSaveWorkInfo = () => workInfoHook.handleSaveWorkInfo(detail.setEmployee);
  const handleSaveDisability = () => disabilityHook.handleSaveDisability(detail.setEmployee);
  const handleSaveProfile = () => profileHook.handleSaveProfile(detail.setEmployee);

  const [showUploadModal, setShowUploadModal] = useState(false);

  if (detail.isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">근로자 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (detail.error || !detail.employee) {
    return (
      <div className="text-center py-20" role="alert">
        <p className="text-gray-500">{detail.error || '근로자 정보를 찾을 수 없습니다.'}</p>
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

  const { employee } = detail;

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
              isEditing={profileHook.isEditingProfile}
              isSaving={profileHook.isSavingProfile}
              profileForm={profileHook.profileForm}
              onEdit={() => profileHook.handleEditProfile(employee)}
              onSave={handleSaveProfile}
              onCancel={profileHook.handleCancelProfile}
              onUpdateForm={profileHook.updateProfileForm}
            />
            <DisabilityInfoSection
              employee={employee}
              isEditing={disabilityHook.isEditingDisability}
              isSaving={disabilityHook.isSavingDisability}
              tempDisabilityType={disabilityHook.tempDisabilityType}
              setTempDisabilityType={disabilityHook.setTempDisabilityType}
              tempSeverity={disabilityHook.tempDisabilitySeverity}
              setTempSeverity={disabilityHook.setTempDisabilitySeverity}
              tempRecognitionDate={disabilityHook.tempDisabilityRecognitionDate}
              setTempRecognitionDate={disabilityHook.setTempDisabilityRecognitionDate}
              onEdit={disabilityHook.handleEditDisability}
              onSave={handleSaveDisability}
              onCancel={disabilityHook.handleCancelDisability}
            />
            <NotesSection
              notes={notesHook.notes}
              isEditing={notesHook.isEditingNotes}
              isSaving={notesHook.isSavingNotes}
              tempNotes={notesHook.tempNotes}
              setTempNotes={notesHook.setTempNotes}
              onEdit={notesHook.handleEditNotes}
              onSave={handleSaveNotes}
              onCancel={notesHook.handleCancelNotes}
            />
            <ResignSection employee={employee} onOpenResignModal={resign.openResignModal} />
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceHistoryTable
              records={attendance.attendanceHistory}
              isLoading={attendance.isLoadingAttendance}
              error={attendance.attendanceError}
              onEditWorkTime={attendance.handleEditWorkTime}
              onOpenWorkDone={attendance.openWorkDoneModal}
            />
            <WorkInfoSection
              workDays={workInfoHook.workDays}
              workStartTime={workInfoHook.workStartTime}
              isEditing={workInfoHook.isEditingWorkInfo}
              isSaving={workInfoHook.isSavingWorkInfo}
              tempWorkDays={workInfoHook.tempWorkDays}
              tempWorkStartTime={workInfoHook.tempWorkStartTime}
              setTempWorkStartTime={workInfoHook.setTempWorkStartTime}
              toggleTempWorkDay={workInfoHook.toggleTempWorkDay}
              onEdit={workInfoHook.handleEditWorkInfo}
              onSave={handleSaveWorkInfo}
              onCancel={workInfoHook.handleCancelEditWorkInfo}
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
        isOpen={resign.showResignModal}
        onClose={resign.closeResignModal}
        employeeName={employee.name}
        resignForm={resign.resignForm}
        isSubmitting={resign.isSubmitting}
        onUpdateForm={resign.updateResignForm}
        onSubmit={resign.handleSubmitResign}
      />
    </div>
  );
}
