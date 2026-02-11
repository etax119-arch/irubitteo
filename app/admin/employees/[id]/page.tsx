'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { useAdminEmployeeDetail } from './_hooks/useAdminEmployeeDetail';
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

  const detail = useAdminEmployeeDetail(employeeId);
  const attendance = useAdminAttendanceHistory(employeeId, detail.fetchEmployee);
  const files = useAdminEmployeeFiles(employeeId);

  useEffect(() => {
    const load = async () => {
      detail.setLoading(true);
      await Promise.all([detail.fetchEmployee(), attendance.fetchAttendance(), files.fetchFiles()]);
      detail.setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (detail.loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
      </div>
    );
  }

  if (!detail.worker) {
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

  const { worker } = detail;

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
            <ProfileCard worker={worker} />
            {worker.companyNote && <CompanyNoteSection companyNote={worker.companyNote} />}
            <AdminNoteSection
              notes={detail.notes}
              isEditingNotes={detail.isEditingNotes}
              tempNotes={detail.tempNotes}
              setTempNotes={detail.setTempNotes}
              savingNotes={detail.savingNotes}
              onEdit={detail.handleEditNotes}
              onSave={detail.handleSaveNotes}
              onCancel={detail.handleCancelNotes}
            />
            {!worker.isActive && <ResignInfoSection worker={worker} />}
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceHistoryTable
              records={attendance.attendanceHistory}
              onEditWorkTime={attendance.handleEditWorkTime}
              onOpenWorkDone={attendance.openWorkDoneModal}
            />
            <WorkInfoSection
              workDays={detail.workDays}
              workStartTime={detail.workStartTime}
              isEditingWorkInfo={detail.isEditingWorkInfo}
              tempWorkDays={detail.tempWorkDays}
              tempWorkStartTime={detail.tempWorkStartTime}
              setTempWorkStartTime={detail.setTempWorkStartTime}
              savingWorkInfo={detail.savingWorkInfo}
              toggleTempWorkDay={detail.toggleTempWorkDay}
              onEdit={detail.handleEditWorkInfo}
              onSave={detail.handleSaveWorkInfo}
              onCancel={detail.handleCancelEditWorkInfo}
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
