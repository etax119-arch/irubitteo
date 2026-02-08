'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import { useEmployeeDetail } from '../_hooks/useEmployeeDetail';
import { useAttendanceHistory } from '../_hooks/useAttendanceHistory';
import { useResign } from '../_hooks/useResign';
import { useEmployeeFiles } from '../_hooks/useEmployeeFiles';
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
  const employeeId = params.id as string;

  const detail = useEmployeeDetail(employeeId);
  const attendance = useAttendanceHistory(employeeId);
  const resign = useResign({ employeeId, onSuccess: detail.fetchEmployee });
  const employeeFiles = useEmployeeFiles(employeeId);

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
      <div className="text-center py-20">
        <p className="text-gray-500">{detail.error || '근로자 정보를 찾을 수 없습니다.'}</p>
        <button
          onClick={() => router.push('/company/employees')}
          className="mt-4 text-duru-orange-600 hover:text-duru-orange-700 font-semibold"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const { employee } = detail;

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
            <ProfileCard employee={employee} />
            <DisabilityInfoSection
              employee={employee}
              isEditing={detail.isEditingDisability}
              isSaving={detail.isSaving}
              tempSeverity={detail.tempDisabilitySeverity}
              setTempSeverity={detail.setTempDisabilitySeverity}
              tempRecognitionDate={detail.tempDisabilityRecognitionDate}
              setTempRecognitionDate={detail.setTempDisabilityRecognitionDate}
              onEdit={detail.handleEditDisability}
              onSave={detail.handleSaveDisability}
              onCancel={detail.handleCancelDisability}
            />
            <NotesSection
              notes={detail.notes}
              isEditing={detail.isEditingNotes}
              isSaving={detail.isSaving}
              tempNotes={detail.tempNotes}
              setTempNotes={detail.setTempNotes}
              onEdit={detail.handleEditNotes}
              onSave={detail.handleSaveNotes}
              onCancel={detail.handleCancelNotes}
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
              workDays={detail.workDays}
              workStartTime={detail.workStartTime}
              isEditing={detail.isEditingWorkInfo}
              isSaving={detail.isSaving}
              tempWorkDays={detail.tempWorkDays}
              tempWorkStartTime={detail.tempWorkStartTime}
              setTempWorkStartTime={detail.setTempWorkStartTime}
              toggleTempWorkDay={detail.toggleTempWorkDay}
              onEdit={detail.handleEditWorkInfo}
              onSave={detail.handleSaveWorkInfo}
              onCancel={detail.handleCancelEditWorkInfo}
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
