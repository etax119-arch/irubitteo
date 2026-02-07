'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import { useEmployeeDetail } from '../_hooks/useEmployeeDetail';
import { useAttendanceHistory } from '../_hooks/useAttendanceHistory';
import { useResign } from '../_hooks/useResign';
import { ProfileCard } from './_components/ProfileCard';
import { DisabilityInfoSection } from './_components/DisabilityInfoSection';
import { NotesSection } from './_components/NotesSection';
import { ResignSection } from './_components/ResignSection';
import { AttendanceTable } from './_components/AttendanceTable';
import { WorkInfoSection } from './_components/WorkInfoSection';
import { DocumentSection } from './_components/DocumentSection';
import { UploadModal } from './_components/UploadModal';
import { WorkTimeEditModal } from './_components/WorkTimeEditModal';
import { WorkDoneModal } from './_components/WorkDoneModal';
import { ResignModal } from './_components/ResignModal';

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

export default function CompanyEmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  const detail = useEmployeeDetail(employeeId);
  const attendance = useAttendanceHistory(employeeId);
  const resign = useResign();

  const [documents] = useState<Document[]>([
    { id: 1, name: '근로계약서.pdf', type: '계약서', uploadDate: '2025-12-01', size: '1.2MB' },
    { id: 2, name: '개인정보동의서.pdf', type: '동의서', uploadDate: '2025-12-01', size: '0.8MB' },
    { id: 3, name: '건강검진결과.pdf', type: '건강검진', uploadDate: '2026-01-15', size: '2.1MB' },
    { id: 4, name: '장애인등록증.pdf', type: '신분증', uploadDate: '2025-12-01', size: '0.5MB' },
    { id: 5, name: '이력서.pdf', type: '이력서', uploadDate: '2025-11-28', size: '0.9MB' },
  ]);

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
            <AttendanceTable
              records={attendance.attendanceHistory}
              onEditWorkTime={attendance.handleEditWorkTime}
              onOpenWorkDone={attendance.openWorkDoneModal}
            />
            <WorkInfoSection
              workDays={detail.workDays}
              workStartTime={detail.workStartTime}
              isEditing={detail.isEditingWorkInfo}
              tempWorkDays={detail.tempWorkDays}
              tempWorkStartTime={detail.tempWorkStartTime}
              setTempWorkStartTime={detail.setTempWorkStartTime}
              toggleTempWorkDay={detail.toggleTempWorkDay}
              onEdit={detail.handleEditWorkInfo}
              onSave={detail.handleSaveWorkInfo}
              onCancel={detail.handleCancelEditWorkInfo}
            />
            <DocumentSection documents={documents} onOpenUploadModal={() => setShowUploadModal(true)} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
      <WorkTimeEditModal
        isOpen={attendance.isEditingWorkTime}
        onClose={() => attendance.setIsEditingWorkTime(false)}
        editedWorkTime={attendance.editedWorkTime}
        setEditedWorkTime={attendance.setEditedWorkTime}
        onSave={attendance.handleSaveWorkTime}
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
        onUpdateForm={resign.updateResignForm}
        onSubmit={resign.handleSubmitResign}
      />
    </div>
  );
}
