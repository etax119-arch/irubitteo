'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Building2,
  Phone,
  Heart,
  Users as UserIcon,
  Briefcase,
  Clock,
  FileText,
  Upload,
  Download,
  Eye,
  X,
  Edit3,
  Edit2,
  Save,
  Check,
  IdCard,
  Shield,
  Hash,
  MessageSquare,
  UserX,
  Loader2,
  Trash2,
  CalendarOff,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { getEmployee, updateEmployee } from '@/lib/api/employees';
import { attendanceApi } from '@/lib/api/attendance';
import { getEmployeeFiles, uploadEmployeeFile, deleteEmployeeFile } from '@/lib/api/employeeFiles';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import { formatUtcTimestampAsKST, formatDateAsKST, buildKSTTimestamp } from '@/lib/kst';
import type { Employee, EmployeeFile, DocumentType, WorkDay } from '@/types/employee';
import type { AttendanceWithEmployee } from '@/types/attendance';

const WORK_DAY_MAP: Record<number, string> = {
  1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 7: '일',
};
const DAY_NAME_TO_NUM: Record<string, number> = {
  '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7,
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function getAttendanceDisplayStatus(record: AttendanceWithEmployee): string {
  if (record.status === 'absent') return '결근';
  if (record.status === 'leave') return '휴가';
  if (record.status === 'holiday') return '휴일';
  if (record.isLate) return '지각';
  return '정상';
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const toast = useToast();

  const [worker, setWorker] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceWithEmployee[]>([]);
  const [documents, setDocuments] = useState<EmployeeFile[]>([]);

  // Notes editing state
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Work info editing state
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');
  const [savingWorkInfo, setSavingWorkInfo] = useState(false);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showWorkDoneModal, setShowWorkDoneModal] = useState(false);
  const [selectedWorkDone, setSelectedWorkDone] = useState<{ date: string; workDone: string } | null>(null);
  const [isEditingWorkTime, setIsEditingWorkTime] = useState(false);
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null);
  const [editedWorkTime, setEditedWorkTime] = useState({
    date: '',
    checkin: '09:00',
    checkout: '18:00',
    workDone: '',
  });
  const [savingWorkTime, setSavingWorkTime] = useState(false);

  // Upload state
  const [uploadDocType, setUploadDocType] = useState<DocumentType>('근로계약서');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchEmployee = useCallback(async () => {
    try {
      const result = await getEmployee(employeeId);
      const emp = result.data;
      setWorker(emp);
      setNotes(emp.adminNote || '');
      const dayNames = (emp.workDays ?? []).map((d) => WORK_DAY_MAP[d]).filter(Boolean);
      setWorkDays(dayNames);
      setWorkStartTime(emp.workStartTime ? emp.workStartTime.slice(0, 5) : '09:00');
    } catch (err) {
      console.error('Failed to fetch employee:', err);
      toast.error(extractErrorMessage(err));
    }
  }, [employeeId, toast]);

  const fetchAttendance = useCallback(async () => {
    try {
      const result = await attendanceApi.getAttendances({
        employeeId,
        limit: 10,
      });
      setAttendanceHistory(result.data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  }, [employeeId]);

  const fetchFiles = useCallback(async () => {
    try {
      const files = await getEmployeeFiles(employeeId);
      setDocuments(files);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    }
  }, [employeeId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchEmployee(), fetchAttendance(), fetchFiles()]);
      setLoading(false);
    };
    load();
  }, [fetchEmployee, fetchAttendance, fetchFiles]);

  // Notes handlers
  const handleEditNotes = () => {
    setTempNotes(notes);
    setIsEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      await updateEmployee(employeeId, { adminNote: tempNotes || null });
      setNotes(tempNotes);
      setIsEditingNotes(false);
      toast.success('비고란이 저장되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    setIsEditingNotes(false);
    setTempNotes('');
  };

  // Work info handlers
  const handleEditWorkInfo = () => {
    setTempWorkDays([...workDays]);
    setTempWorkStartTime(workStartTime);
    setIsEditingWorkInfo(true);
  };

  const handleSaveWorkInfo = async () => {
    try {
      setSavingWorkInfo(true);
      const dayNums = tempWorkDays
        .map((d) => DAY_NAME_TO_NUM[d])
        .filter(Boolean)
        .sort() as WorkDay[];
      await updateEmployee(employeeId, {
        workDays: dayNums,
        workStartTime: tempWorkStartTime,
      });
      setWorkDays([...tempWorkDays]);
      setWorkStartTime(tempWorkStartTime);
      setIsEditingWorkInfo(false);
      toast.success('근무 정보가 저장되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingWorkInfo(false);
    }
  };

  const handleCancelEditWorkInfo = () => {
    setIsEditingWorkInfo(false);
    setTempWorkDays([]);
    setTempWorkStartTime('');
  };

  const toggleTempWorkDay = (day: string) => {
    if (tempWorkDays.includes(day)) {
      setTempWorkDays(tempWorkDays.filter((d) => d !== day));
    } else {
      setTempWorkDays([...tempWorkDays, day]);
    }
  };

  // Attendance edit handlers
  const handleEditWorkTime = (record: AttendanceWithEmployee) => {
    const dateStr = formatDateAsKST(new Date(record.date));
    setEditingAttendanceId(record.id);
    setEditedWorkTime({
      date: dateStr,
      checkin: record.clockIn ? formatUtcTimestampAsKST(record.clockIn) : '',
      checkout: record.clockOut ? formatUtcTimestampAsKST(record.clockOut) : '',
      workDone: record.workContent || '',
    });
    setIsEditingWorkTime(true);
  };

  const handleSaveWorkTime = async () => {
    if (!editingAttendanceId) return;
    try {
      setSavingWorkTime(true);
      await attendanceApi.updateAttendance(editingAttendanceId, {
        clockIn: editedWorkTime.checkin ? buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkin) : undefined,
        clockOut: editedWorkTime.checkout ? buildKSTTimestamp(editedWorkTime.date, editedWorkTime.checkout) : undefined,
        workContent: editedWorkTime.workDone || undefined,
      });
      setIsEditingWorkTime(false);
      toast.success('근무시간이 수정되었습니다.');
      fetchAttendance();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingWorkTime(false);
    }
  };

  const handleVacation = async () => {
    if (!editingAttendanceId) return;
    try {
      setSavingWorkTime(true);
      await attendanceApi.updateAttendance(editingAttendanceId, { status: 'leave' });
      setIsEditingWorkTime(false);
      toast.success('휴가 처리되었습니다.');
      fetchAttendance();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSavingWorkTime(false);
    }
  };

  // File handlers
  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('파일을 선택해주세요.');
      return;
    }
    try {
      setUploading(true);
      await uploadEmployeeFile(employeeId, uploadFile, uploadDocType);
      setShowUploadModal(false);
      setUploadFile(null);
      toast.success('파일이 업로드되었습니다.');
      fetchFiles();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('파일을 삭제하시겠습니까?')) return;
    try {
      await deleteEmployeeFile(employeeId, fileId);
      toast.success('파일이 삭제되었습니다.');
      fetchFiles();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '정상':
        return 'bg-green-100 text-green-700';
      case '지각':
        return 'bg-yellow-100 text-yellow-700';
      case '휴가':
      case '휴일':
        return 'bg-blue-100 text-blue-700';
      case '결근':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
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

  const statusLabel = worker.isActive
    ? worker.status === 'checkin'
      ? '근무중'
      : worker.status === 'checkout'
      ? '퇴근'
      : worker.status === 'absent'
      ? '결근'
      : '대기'
    : '퇴사';

  const statusClass = !worker.isActive
    ? 'bg-gray-200 text-gray-600'
    : worker.status === 'checkin'
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-200 text-gray-700';

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
            {/* 프로필 카드 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-duru-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-duru-orange-600">{worker.name[0]}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{worker.name}</h2>
                <p className="text-gray-600">{worker.disability ?? '-'}</p>
                <span
                  className={cn(
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2',
                    statusClass
                  )}
                >
                  {statusLabel}
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">소속 회사:</span>
                  <span className="font-semibold text-gray-900">
                    {(worker as Employee & { companyName?: string }).companyName ?? '-'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IdCard className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">주민번호:</span>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">핸드폰번호:</span>
                  <span className="font-semibold text-gray-900">{worker.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Heart className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">비상연락처:</span>
                  <span className="font-semibold text-gray-900">
                    {worker.emergencyContactPhone
                      ? `${worker.emergencyContactPhone} (${worker.emergencyContactRelation ?? ''})`
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">성별:</span>
                  <span className="font-semibold text-gray-900">{worker.gender ?? '-'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">입사일:</span>
                  <span className="font-semibold text-gray-900">{worker.hireDate?.substring(0, 10) ?? '-'}</span>
                </div>
              </div>
            </div>

            {/* 근로자 고유번호 */}
            <div className="bg-duru-orange-50 rounded-xl p-6 border border-duru-orange-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-duru-orange-600" />
                근로자 고유번호
              </h3>
              <div className="bg-white rounded-lg p-4 border border-duru-orange-300">
                <p className="text-2xl font-bold text-duru-orange-600 text-center tracking-wider">
                  {worker.uniqueCode}
                </p>
              </div>
            </div>

            {/* 장애 정보 */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-duru-orange-600" />
                장애 정보
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">유형</span>
                  <span className="font-bold text-gray-900">{worker.disabilityType ?? worker.disability ?? '-'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">중증/경증</span>
                  <span className={cn(
                    'inline-block px-2 py-0.5 rounded-full text-xs font-bold',
                    worker.disabilitySeverity === '중증'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  )}>
                    {worker.disabilitySeverity ?? '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">인정일</span>
                  <span className="font-bold text-gray-900">
                    {worker.disabilityRecognitionDate?.substring(0, 10) ?? '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* 기업 비고란 (읽기 전용) */}
            {worker.companyNote && (
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    기업 비고란
                  </h3>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 min-h-[60px]">
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">
                    {worker.companyNote}
                  </p>
                </div>
              </div>
            )}

            {/* 비고란 */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-duru-orange-600" />
                  비고란
                </h3>
                {!isEditingNotes ? (
                  <button
                    onClick={handleEditNotes}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    수정
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleCancelNotes}
                      className="px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="px-2 py-1 bg-duru-orange-500 text-white rounded text-xs font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      저장
                    </button>
                  </div>
                )}
              </div>
              {!isEditingNotes ? (
                <div className="bg-gray-50 rounded-lg p-3 min-h-[60px]">
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">
                    {notes || '특이사항이 없습니다.'}
                  </p>
                </div>
              ) : (
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="근로자 특징이나 특이사항을 입력하세요..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-duru-orange-500 resize-none"
                />
              )}
            </div>

            {/* 퇴사 정보 (퇴사자인 경우) */}
            {!worker.isActive && (
              <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <UserX className="w-4 h-4 text-gray-500" />
                  퇴사 정보
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">퇴사일</span>
                    <span className="font-bold text-gray-700">{worker.resignDate?.substring(0, 10) ?? '-'}</span>
                  </div>
                  {worker.resignReason && (
                    <div className="text-xs">
                      <span className="text-gray-600">비고</span>
                      <p className="mt-1 p-2 bg-white rounded border border-gray-200 text-gray-700">
                        {worker.resignReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 출퇴근 기록 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-duru-orange-600" />
                최근 출퇴근 기록
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">날짜</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">출근</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">퇴근</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">업무 내용</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">수정</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceHistory.length > 0 ? (
                      attendanceHistory.slice(0, 7).map((record) => {
                        const displayStatus = getAttendanceDisplayStatus(record);
                        const checkinDisplay = record.clockIn
                          ? formatUtcTimestampAsKST(record.clockIn)
                          : displayStatus === '결근'
                          ? '결근'
                          : '-';
                        const checkoutDisplay = record.clockOut
                          ? formatUtcTimestampAsKST(record.clockOut)
                          : '-';
                        const dateDisplay = formatDateAsKST(new Date(record.date));

                        return (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900">{dateDisplay}</td>
                            <td
                              className={cn(
                                'px-4 py-3',
                                checkinDisplay === '결근' ? 'text-red-600 font-semibold' : 'text-gray-900'
                              )}
                            >
                              {checkinDisplay}
                            </td>
                            <td className="px-4 py-3 text-gray-900">{checkoutDisplay}</td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  'px-2 py-1 rounded-full text-xs font-semibold',
                                  getStatusColor(displayStatus)
                                )}
                              >
                                {displayStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {record.workContent ? (
                                <button
                                  onClick={() => {
                                    setSelectedWorkDone({ date: dateDisplay, workDone: record.workContent! });
                                    setShowWorkDoneModal(true);
                                  }}
                                  className="text-sm text-duru-orange-600 underline hover:text-duru-orange-700"
                                >
                                  확인하기
                                </button>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleEditWorkTime(record)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="수정"
                              >
                                <Edit3 className="w-4 h-4 text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                          출퇴근 기록이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 근무 정보 */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-duru-orange-600" />
                  근무 정보
                </h3>
                {!isEditingWorkInfo ? (
                  <button
                    onClick={handleEditWorkInfo}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    수정
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEditWorkInfo}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveWorkInfo}
                      disabled={savingWorkInfo}
                      className="px-3 py-1.5 bg-duru-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingWorkInfo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      저장
                    </button>
                  </div>
                )}
              </div>

              {!isEditingWorkInfo ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">근무 요일</label>
                    <div className="flex gap-1">
                      {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                        <div
                          key={day}
                          className={cn(
                            'flex-1 py-1 rounded text-xs font-semibold text-center border',
                            workDays.includes(day)
                              ? 'bg-duru-orange-500 text-white border-duru-orange-500'
                              : 'bg-gray-50 text-gray-400 border-gray-200'
                          )}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">출근 시간</label>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">{workStartTime}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">근무 요일</label>
                    <div className="grid grid-cols-7 gap-1">
                      {['월', '화', '수', '목', '금', '토', '일'].map((day) => {
                        const isSelected = tempWorkDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleTempWorkDay(day)}
                            className={cn(
                              'py-1 rounded text-xs font-semibold transition-colors border',
                              isSelected
                                ? 'bg-duru-orange-500 text-white border-duru-orange-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            )}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">출근 시간</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="time"
                        value={tempWorkStartTime}
                        onChange={(e) => setTempWorkStartTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:border-transparent text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 문서 관리 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-duru-orange-600" />
                  문서 관리
                </h3>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  파일 업로드
                </button>
              </div>

              <div className="space-y-3">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{doc.fileName}</p>
                          <p className="text-xs text-gray-600">
                            {doc.documentType} · {doc.createdAt?.substring(0, 10)} · {formatFileSize(doc.fileSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="미리보기"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </a>
                        <a
                          href={doc.filePath}
                          download
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="다운로드"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(doc.id)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8">등록된 문서가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 파일 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">파일 업로드</h3>
              <button
                onClick={() => { setShowUploadModal(false); setUploadFile(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">문서 종류</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as DocumentType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                >
                  <option value="근로계약서">근로계약서</option>
                  <option value="동의서">동의서</option>
                  <option value="건강검진">건강검진</option>
                  <option value="자격증">자격증</option>
                  <option value="장애인등록증">장애인등록증</option>
                  <option value="이력서">이력서</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">파일 선택</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                />
                <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG 파일만 업로드 가능 (최대 10MB)</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowUploadModal(false); setUploadFile(null); }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !uploadFile}
                  className="flex-1 py-3 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  업로드
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 근무시간 수정 모달 */}
      {isEditingWorkTime && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">근무시간 수정</h3>
              <button
                onClick={() => setIsEditingWorkTime(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">날짜</label>
                <input
                  type="text"
                  value={editedWorkTime.date}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">출근 시간</label>
                <input
                  type="time"
                  value={editedWorkTime.checkin}
                  onChange={(e) => setEditedWorkTime({ ...editedWorkTime, checkin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">퇴근 시간</label>
                <input
                  type="time"
                  value={editedWorkTime.checkout}
                  onChange={(e) => setEditedWorkTime({ ...editedWorkTime, checkout: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">업무 내용</label>
                <textarea
                  value={editedWorkTime.workDone}
                  onChange={(e) => setEditedWorkTime({ ...editedWorkTime, workDone: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setIsEditingWorkTime(false)}
                  disabled={savingWorkTime}
                  className="py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleVacation}
                    disabled={savingWorkTime}
                    className="py-3 px-5 border border-duru-orange-300 bg-duru-orange-50/50 text-duru-orange-600 hover:bg-duru-orange-100 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <CalendarOff className="w-4 h-4" />
                    휴가
                  </button>
                  <button
                    onClick={handleSaveWorkTime}
                    disabled={savingWorkTime}
                    className="py-3 px-6 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {savingWorkTime ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 업무내용 확인 모달 */}
      {showWorkDoneModal && selectedWorkDone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">업무 내용</h3>
              <button
                onClick={() => {
                  setShowWorkDoneModal(false);
                  setSelectedWorkDone(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{selectedWorkDone.date}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">{selectedWorkDone.workDone}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowWorkDoneModal(false);
                setSelectedWorkDone(null);
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
