'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  Users,
  FileText,
  Edit3,
  Save,
  X,
  Upload,
  Download,
  Trash2,
  Paperclip,
  Eye,
  Hash,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Clock,
} from 'lucide-react';
import { getCompany, updateCompany } from '@/lib/api/companies';
import { getEmployees } from '@/lib/api/employees';
import { getCompanyFiles, uploadCompanyFile, deleteCompanyFile } from '@/lib/api/companyFiles';
import { useToast } from '@/components/ui/Toast';
import { extractErrorMessage } from '@/lib/api/error';
import { formatKSTDate } from '@/lib/kst';
import type { CompanyWithEmployeeCount, CompanyFile } from '@/types/company';
import type { Employee } from '@/types/employee';

interface EditedInfo {
  hrContactName: string;
  hrContactPhone: string;
  hrContactEmail: string;
  address: string;
}

interface PMInfo {
  name: string;
  phone: string;
  email: string;
}

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [company, setCompany] = useState<CompanyWithEmployeeCount | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [files, setFiles] = useState<CompanyFile[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<EditedInfo>({
    hrContactName: '',
    hrContactPhone: '',
    hrContactEmail: '',
    address: '',
  });

  const [pmInfo, setPmInfo] = useState<PMInfo>({ name: '', phone: '', email: '' });
  const [isEditingPm, setIsEditingPm] = useState(false);
  const [editedPm, setEditedPm] = useState<PMInfo>({ name: '', phone: '', email: '' });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);
  const [resignForm, setResignForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // 회사 정보 (필수) - 실패 시 catch로
      const companyRes = await getCompany(id);
      const c = companyRes.data;
      setCompany(c);
      setEditedInfo({
        hrContactName: c.hrContactName || '',
        hrContactPhone: c.hrContactPhone || '',
        hrContactEmail: c.hrContactEmail || '',
        address: c.address || '',
      });
      setPmInfo({
        name: c.pmContactName || '',
        phone: c.pmContactPhone || '',
        email: c.pmContactEmail || '',
      });

      // 부가 데이터 (개별 실패 허용)
      const [employeesResult, filesResult] = await Promise.allSettled([
        getEmployees({ companyId: id, limit: 100 }),
        getCompanyFiles(id),
      ]);
      if (employeesResult.status === 'fulfilled') {
        setEmployees(employeesResult.value.data);
      }
      if (filesResult.status === 'fulfilled') {
        setFiles(filesResult.value);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditPm = () => {
    setEditedPm({ name: pmInfo.name, phone: pmInfo.phone, email: pmInfo.email });
    setIsEditingPm(true);
  };

  const handleSavePm = async () => {
    try {
      const result = await updateCompany(id, {
        pmContactName: editedPm.name || null,
        pmContactPhone: editedPm.phone || null,
        pmContactEmail: editedPm.email || null,
      });
      setCompany(result.data);
      setPmInfo({ ...editedPm });
      setIsEditingPm(false);
      setEditedPm({ name: '', phone: '', email: '' });
      toast.success('영업 담당자 정보가 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleCancelPmEdit = () => {
    setIsEditingPm(false);
    setEditedPm({ name: '', phone: '', email: '' });
  };

  const handleStartEdit = () => {
    if (company) {
      setEditedInfo({
        hrContactName: company.hrContactName || '',
        hrContactPhone: company.hrContactPhone || '',
        hrContactEmail: company.hrContactEmail || '',
        address: company.address || '',
      });
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const result = await updateCompany(id, {
        hrContactName: editedInfo.hrContactName || null,
        hrContactPhone: editedInfo.hrContactPhone || null,
        hrContactEmail: editedInfo.hrContactEmail || null,
        address: editedInfo.address || null,
      });
      setCompany(result.data);
      setIsEditing(false);
      toast.success('회원사 정보가 수정되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleResign = async () => {
    if (!resignForm.date) return;
    try {
      const result = await updateCompany(id, {
        isActive: false,
        resignDate: resignForm.date,
        resignReason: resignForm.reason || null,
      });
      setCompany(result.data);
      setShowResignModal(false);
      setResignForm({ date: new Date().toISOString().split('T')[0], reason: '' });
      toast.success('탈퇴 처리되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const newFile = await uploadCompanyFile(id, file);
      setFiles((prev) => [newFile, ...prev]);
      toast.success('파일이 업로드되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      await deleteCompanyFile(id, fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast.success('파일이 삭제되었습니다.');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin" />
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
            {/* 회사 프로필 카드 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{company.name}</h2>
                <p className="text-gray-600">{company.businessNumber || '-'}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                    company.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {company.isActive ? '활성' : '탈퇴'}
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">주소:</span>
                    {isEditing ? (
                      <textarea
                        value={editedInfo.address}
                        onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                        rows={2}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{company.address || '-'}</span>
                    )}
                  </div>
                </div>

                {/* HR 담당자 */}
                <div className="border-t border-gray-200 my-3" />
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">HR 담당자</p>
                <div className="flex items-start gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">담당자:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.hrContactName}
                        onChange={(e) => setEditedInfo({ ...editedInfo, hrContactName: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{company.hrContactName || '-'}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">담당자 연락처:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.hrContactPhone}
                        onChange={(e) => setEditedInfo({ ...editedInfo, hrContactPhone: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{company.hrContactPhone || '-'}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">담당자 이메일:</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedInfo.hrContactEmail}
                        onChange={(e) => setEditedInfo({ ...editedInfo, hrContactEmail: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{company.hrContactEmail || '-'}</span>
                    )}
                  </div>
                </div>

                {/* 계약 정보 */}
                <div className="border-t border-gray-200 my-3" />
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">계약 시작일:</span>
                    <span className="font-semibold text-gray-900">
                      {company.contractStartDate || '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">기업 고유 번호:</span>
                    <span className="font-semibold text-gray-900 font-mono tracking-wide">
                      {company.code}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">등록일:</span>
                    <span className="font-semibold text-gray-900">
                      {formatKSTDate(company.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      저장
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    정보 수정
                  </button>
                )}
              </div>
            </div>

            {/* 영업 담당자 (PM) 카드 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-duru-orange-600" />
                  영업 담당자
                </h3>
                {!isEditingPm ? (
                  <button
                    onClick={handleEditPm}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleCancelPmEdit}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={handleSavePm}
                      className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 w-12">이름:</span>
                  {isEditingPm ? (
                    <input
                      type="text"
                      value={editedPm.name}
                      onChange={(e) => setEditedPm({ ...editedPm, name: e.target.value })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="font-semibold text-gray-900">{pmInfo.name || '-'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 w-12">연락처:</span>
                  {isEditingPm ? (
                    <input
                      type="text"
                      value={editedPm.phone}
                      onChange={(e) => setEditedPm({ ...editedPm, phone: e.target.value })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="font-semibold text-gray-900">{pmInfo.phone || '-'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 w-12">이메일:</span>
                  {isEditingPm ? (
                    <input
                      type="email"
                      value={editedPm.email}
                      onChange={(e) => setEditedPm({ ...editedPm, email: e.target.value })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{pmInfo.email || '-'}</span>
                      {pmInfo.email && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(pmInfo.email);
                            setCopiedEmail(true);
                            setTimeout(() => setCopiedEmail(false), 2000);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="이메일 복사"
                        >
                          {copiedEmail ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 회원사 탈퇴 버튼 (활성 회원사인 경우만) */}
            {company.isActive ? (
              <button
                onClick={() => setShowResignModal(true)}
                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
              >
                <Trash2 className="w-5 h-5" />
                회원사 탈퇴
              </button>
            ) : (
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  탈퇴 회원사
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">탈퇴일:</span>
                    <span className="font-semibold text-red-900">{company.resignDate || '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 shrink-0">탈퇴 사유:</span>
                    <span className="font-semibold text-red-900">{company.resignReason || '(사유 없음)'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 근로자 목록 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-duru-orange-600" />
                소속 근로자 ({employees.length}명)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">이름</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">입사일</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">장애유형</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">고유번호</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.length > 0 ? (
                      employees.map((worker) => (
                        <tr
                          key={worker.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/admin/employees/${worker.id}`)}
                        >
                          <td className="px-4 py-3 text-gray-900 font-medium">{worker.name}</td>
                          <td className="px-4 py-3 text-gray-600">{worker.phone}</td>
                          <td className="px-4 py-3 text-gray-600">{worker.hireDate}</td>
                          <td className="px-4 py-3 text-gray-600">{worker.disability || '-'}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 font-mono">
                              {worker.uniqueCode}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          소속 근로자가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 계약서 및 첨부 파일 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-duru-orange-600" />
                  계약서 및 첨부 파일
                </h3>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  해당 기업과 관련된 계약서 및 내부 자료를 관리합니다
                </p>
              </div>

              {/* 업로드 영역 */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                    e.target.value = '';
                  }
                }}
              />
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-duru-orange-400 transition-colors cursor-pointer mb-6"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-duru-orange-500 animate-spin mx-auto mb-3" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                )}
                <p className="text-sm text-gray-600 mb-3">
                  {isUploading ? '업로드 중...' : '파일을 드래그하거나 클릭하여 업로드'}
                </p>
                <button
                  className="px-4 py-2 bg-duru-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-duru-orange-600 transition-colors disabled:opacity-50"
                  disabled={isUploading}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  파일 선택
                </button>
              </div>

              {/* 업로드된 파일 리스트 */}
              <div className="space-y-2">
                {files.length > 0 ? (
                  files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(file.createdAt).toLocaleDateString('ko-KR')} · {formatFileSize(file.fileSize)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/companies/${id}/files/${file.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="보기"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </a>
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/companies/${id}/files/${file.id}/download`}
                          download
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="다운로드"
                        >
                          <Download className="w-4 h-4 text-gray-500" />
                        </a>
                        <button
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="삭제"
                          onClick={() => handleFileDelete(file.id)}
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">업로드된 파일이 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 회원사 탈퇴 모달 */}
      {showResignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                회원사 탈퇴
              </h3>
              <button
                onClick={() => setShowResignModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">
                <strong>{company.name}</strong> 회원사를 탈퇴 처리합니다.
                <br />
                탈퇴 처리 후 해당 회원사와 소속 근로자는 서비스에 접속할 수 없습니다.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  탈퇴일 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={resignForm.date}
                    onChange={(e) => setResignForm({ ...resignForm, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  비고 (탈퇴 사유 등)
                </label>
                <textarea
                  value={resignForm.reason}
                  onChange={(e) => setResignForm({ ...resignForm, reason: e.target.value })}
                  placeholder="탈퇴 사유나 특이사항을 입력해주세요..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowResignModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleResign}
                  disabled={!resignForm.date}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  회원사 탈퇴
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
