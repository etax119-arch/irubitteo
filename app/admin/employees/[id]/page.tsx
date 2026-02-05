'use client';

import { useState } from 'react';
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
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { workersData } from '../../_data/dummyData';

interface AttendanceRecord {
  date: string;
  checkin: string;
  checkout: string;
  status: string;
  workDone: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = Number(params.id);

  const worker = workersData.find((w) => w.id === employeeId);

  const [notes, setNotes] = useState(worker?.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  const [workDays, setWorkDays] = useState(['월', '화', '수', '목', '금']);
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [isEditingWorkInfo, setIsEditingWorkInfo] = useState(false);
  const [tempWorkDays, setTempWorkDays] = useState<string[]>([]);
  const [tempWorkStartTime, setTempWorkStartTime] = useState('');

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 0, 1));

  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([
    { date: '2026-01-28', checkin: '결근', checkout: '-', status: '결근', workDone: '-' },
    { date: '2026-01-27', checkin: '09:05', checkout: '18:10', status: '정상', workDone: '포장 작업' },
    { date: '2026-01-26', checkin: '09:00', checkout: '17:55', status: '정상', workDone: '재고 정리' },
    { date: '2026-01-25', checkin: '-', checkout: '-', status: '휴가', workDone: '-' },
    { date: '2026-01-24', checkin: '09:10', checkout: '18:00', status: '지각', workDone: '품질 검사' },
    { date: '2026-01-23', checkin: '09:00', checkout: '18:05', status: '정상', workDone: '설비 점검' },
    { date: '2026-01-22', checkin: '09:00', checkout: '18:00', status: '정상', workDone: '제품 포장' },
  ]);

  const [documents] = useState<Document[]>([
    { id: 1, name: '근로계약서.pdf', type: '계약서', uploadDate: '2025-12-01', size: '1.2MB' },
    { id: 2, name: '개인정보동의서.pdf', type: '동의서', uploadDate: '2025-12-01', size: '0.8MB' },
    { id: 3, name: '건강검진결과.pdf', type: '건강검진', uploadDate: '2026-01-15', size: '2.1MB' },
    { id: 4, name: '장애인등록증.pdf', type: '신분증', uploadDate: '2025-12-01', size: '0.5MB' },
    { id: 5, name: '이력서.pdf', type: '이력서', uploadDate: '2025-11-28', size: '0.9MB' },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isEditingWorkTime, setIsEditingWorkTime] = useState(false);
  const [editedWorkTime, setEditedWorkTime] = useState({
    date: '2026-01-28',
    checkin: '09:00',
    checkout: '18:00',
    workDone: '제품 검수 완료',
  });

  const handleEditNotes = () => {
    setTempNotes(notes);
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    setNotes(tempNotes);
    setIsEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setIsEditingNotes(false);
    setTempNotes('');
  };

  const handleEditWorkInfo = () => {
    setTempWorkDays([...workDays]);
    setTempWorkStartTime(workStartTime);
    setIsEditingWorkInfo(true);
  };

  const handleSaveWorkInfo = () => {
    setWorkDays([...tempWorkDays]);
    setWorkStartTime(tempWorkStartTime);
    setIsEditingWorkInfo(false);
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

  const handleEditWorkTime = (record: AttendanceRecord) => {
    setEditedWorkTime({
      date: record.date,
      checkin: record.checkin === '결근' || record.checkin === '-' ? '09:00' : record.checkin,
      checkout: record.checkout === '-' ? '18:00' : record.checkout,
      workDone: record.workDone === '-' ? '' : record.workDone,
    });
    setIsEditingWorkTime(true);
  };

  const handleSaveWorkTime = () => {
    setAttendanceHistory((prev) =>
      prev.map((record) =>
        record.date === editedWorkTime.date
          ? {
              ...record,
              checkin: editedWorkTime.checkin,
              checkout: editedWorkTime.checkout,
              workDone: editedWorkTime.workDone,
              status: editedWorkTime.checkin > '09:00' ? '지각' : '정상',
            }
          : record
      )
    );
    setIsEditingWorkTime(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '정상':
        return 'bg-green-100 text-green-700';
      case '지각':
        return 'bg-yellow-100 text-yellow-700';
      case '휴가':
        return 'bg-blue-100 text-blue-700';
      case '결근':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
                <p className="text-gray-600">{worker.department}</p>
                <span
                  className={cn(
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2',
                    worker.isResigned
                      ? 'bg-gray-200 text-gray-600'
                      : worker.status === 'working'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-700'
                  )}
                >
                  {worker.isResigned ? '퇴사' : worker.status === 'working' ? '근무중' : worker.status}
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">소속 회사:</span>
                  <span className="font-semibold text-gray-900">{worker.company}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <IdCard className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">주민번호:</span>
                  <span className="font-semibold text-gray-900">123456-1234567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">핸드폰번호:</span>
                  <span className="font-semibold text-gray-900">{worker.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Heart className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">비상연락처:</span>
                  <span className="font-semibold text-gray-900">010-9876-5432 (부모)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">성별:</span>
                  <span className="font-semibold text-gray-900">남</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">입사일:</span>
                  <span className="font-semibold text-gray-900">{worker.contractEnd.substring(0, 10)}</span>
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
                  {worker.workerId}
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
                  <span className="font-bold text-gray-900">{worker.disability}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">중증/경증</span>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    경증
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">인정일</span>
                  <span className="font-bold text-gray-900">2020-03-15</span>
                </div>
              </div>
            </div>

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
                      className="px-2 py-1 bg-duru-orange-500 text-white rounded text-xs font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
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
            {worker.isResigned && (
              <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <UserX className="w-4 h-4 text-gray-500" />
                  퇴사 정보
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">퇴사일</span>
                    <span className="font-bold text-gray-700">{worker.resignDate}</span>
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-duru-orange-600" />
                  최근 출퇴근 기록
                  <span className="text-xs font-normal text-gray-500 ml-2">(클릭하여 수정 가능)</span>
                </h3>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={cn(
                    'p-2 rounded-lg border transition-colors',
                    showCalendar
                      ? 'bg-duru-orange-50 border-duru-orange-300 text-duru-orange-600'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  )}
                  title="달력 보기"
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>

              {showCalendar && (
                <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <button
                      onClick={() =>
                        setCalendarMonth(
                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
                        )
                      }
                      className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600"
                    >
                      &lt;
                    </button>
                    <span className="font-bold text-gray-900">
                      {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
                    </span>
                    <button
                      onClick={() =>
                        setCalendarMonth(
                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
                        )
                      }
                      className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600"
                    >
                      &gt;
                    </button>
                  </div>
                  <div className="grid grid-cols-7">
                    {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                      <div
                        key={d}
                        className="py-2 text-center text-xs font-semibold text-gray-500 border-b border-gray-100"
                      >
                        {d}
                      </div>
                    ))}
                    {(() => {
                      const year = calendarMonth.getFullYear();
                      const month = calendarMonth.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const cells: (number | null)[] = [];
                      for (let i = 0; i < firstDay; i++) cells.push(null);
                      for (let d = 1; d <= daysInMonth; d++) cells.push(d);

                      return cells.map((day, i) => {
                        if (day === null)
                          return <div key={`empty-${i}`} className="py-3 border-b border-gray-50" />;
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(
                          2,
                          '0'
                        )}`;
                        const record = attendanceHistory.find((r) => r.date === dateStr);
                        const statusColor = record
                          ? record.status === '정상'
                            ? 'bg-green-500'
                            : record.status === '지각'
                            ? 'bg-yellow-500'
                            : record.status === '휴가'
                            ? 'bg-blue-400'
                            : record.status === '결근'
                            ? 'bg-red-500'
                            : ''
                          : '';

                        return (
                          <div
                            key={day}
                            className={cn(
                              'py-3 flex flex-col items-center gap-1 border-b border-gray-50 transition-colors',
                              record ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'
                            )}
                          >
                            <span className={cn('text-sm', record ? 'text-gray-900' : 'text-gray-300')}>
                              {day}
                            </span>
                            {record && <span className={cn('w-2 h-2 rounded-full', statusColor)} />}
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="flex items-center gap-4 px-4 py-2.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      정상
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      지각
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      휴가
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      결근
                    </span>
                  </div>
                </div>
              )}

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
                    {attendanceHistory.slice(0, 7).map((record, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{record.date}</td>
                        <td
                          className={cn(
                            'px-4 py-3',
                            record.checkin === '결근' ? 'text-red-600 font-semibold' : 'text-gray-900'
                          )}
                        >
                          {record.checkin}
                        </td>
                        <td className="px-4 py-3 text-gray-900">{record.checkout}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'px-2 py-1 rounded-full text-xs font-semibold',
                              getStatusColor(record.status)
                            )}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{record.workDone}</td>
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
                    ))}
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
                      className="px-3 py-1.5 bg-duru-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
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
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-600">
                          {doc.type} · {doc.uploadDate} · {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="미리보기"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="다운로드"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
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
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">문서 종류</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500">
                  <option>근로계약서</option>
                  <option>동의서</option>
                  <option>건강검진</option>
                  <option>자격증</option>
                  <option>장애인등록증</option>
                  <option>이력서</option>
                  <option>기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">파일 선택</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
                />
                <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG 파일만 업로드 가능 (최대 10MB)</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors"
                >
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

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditingWorkTime(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveWorkTime}
                  className="flex-1 py-3 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
