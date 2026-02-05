'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
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
} from 'lucide-react';
import { companiesData } from '../../_data/dummyData';

interface EditedInfo {
  contact: string;
  phone: string;
  email: string;
  address: string;
}

interface PMInfo {
  name: string;
  phone: string;
  email: string;
}

interface Worker {
  id: number;
  name: string;
  phone: string;
  hireDate: string;
  workerId: string;
  disability: string;
}

interface UploadedFile {
  id: number;
  name: string;
  uploadDate: string;
  size: string;
}

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = Number(params.id);

  const company = companiesData.find((c) => c.id === companyId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<EditedInfo>({
    contact: '홍길동',
    phone: '02-1234-5678',
    email: 'contact@company.com',
    address: '서울시 강남구 테헤란로 123',
  });

  const [pmInfo, setPmInfo] = useState<PMInfo>(
    company?.pm || { name: '김영업', phone: '010-1111-2222', email: 'sales.kim@duruviter.com' }
  );
  const [isEditingPm, setIsEditingPm] = useState(false);
  const [editedPm, setEditedPm] = useState<PMInfo>({ name: '', phone: '', email: '' });
  const [copiedEmail, setCopiedEmail] = useState(false);

  const workers: Worker[] = [
    { id: 1, name: '김민수', phone: '010-1234-5678', hireDate: '2025-06-15', workerId: 'ms0315', disability: '지체장애' },
    { id: 2, name: '이영희', phone: '010-2345-6789', hireDate: '2025-07-01', workerId: 'yh0520', disability: '청각장애' },
    { id: 3, name: '박철수', phone: '010-3456-7890', hireDate: '2025-08-10', workerId: 'cs1108', disability: '시각장애' },
    { id: 4, name: '정수진', phone: '010-4567-8901', hireDate: '2025-09-01', workerId: 'sj0723', disability: '지적장애' },
  ];

  const uploadedFiles: UploadedFile[] = [
    { id: 1, name: '두루빛터_위탁계약서_2025.pdf', uploadDate: '2025-06-01', size: '2.4 MB' },
    { id: 2, name: '개인정보처리위탁_동의서.pdf', uploadDate: '2025-06-01', size: '1.1 MB' },
    { id: 3, name: '근로자_배치계획서_2026.pdf', uploadDate: '2026-01-10', size: '850 KB' },
  ];

  const handleEditPm = () => {
    setEditedPm({ name: pmInfo.name, phone: pmInfo.phone, email: pmInfo.email });
    setIsEditingPm(true);
  };

  const handleSavePm = () => {
    setPmInfo({ ...editedPm });
    setIsEditingPm(false);
    setEditedPm({ name: '', phone: '', email: '' });
  };

  const handleCancelPmEdit = () => {
    setIsEditingPm(false);
    setEditedPm({ name: '', phone: '', email: '' });
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

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
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-[64px] z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => router.push('/admin/companies')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">회사 상세 정보</h1>
              <p className="text-xs text-gray-500">관리자 모드</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8">
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
                <p className="text-gray-600">{company.industry}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 bg-green-100 text-green-700">
                  활성
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-start gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">담당자:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.contact}
                        onChange={(e) => setEditedInfo({ ...editedInfo, contact: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{editedInfo.contact}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">전화번호:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedInfo.phone}
                        onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{editedInfo.phone}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">이메일:</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedInfo.email}
                        onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                        className="w-full mt-1 px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{editedInfo.email}</span>
                    )}
                  </div>
                </div>
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
                      <span className="font-semibold text-gray-900">{editedInfo.address}</span>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-200 my-3" />
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">계약 시작일:</span>
                    <span className="font-semibold text-gray-900">2025-06-01</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">기업 고유 번호:</span>
                    <span className="font-semibold text-gray-900 font-mono tracking-wide">
                      DRT-2025-000{company.id}
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
                    onClick={() => setIsEditing(true)}
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
                    <span className="font-semibold text-gray-900">{pmInfo.name}</span>
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
                    <span className="font-semibold text-gray-900">{pmInfo.phone}</span>
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
                      <span className="font-semibold text-gray-900">{pmInfo.email}</span>
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 근로자 목록 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-duru-orange-600" />
                소속 근로자
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
                    {workers.map((worker) => (
                      <tr key={worker.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{worker.name}</td>
                        <td className="px-4 py-3 text-gray-600">{worker.phone}</td>
                        <td className="px-4 py-3 text-gray-600">{worker.hireDate}</td>
                        <td className="px-4 py-3 text-gray-600">{worker.disability}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 font-mono">
                            {worker.workerId}
                          </span>
                        </td>
                      </tr>
                    ))}
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
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-duru-orange-400 transition-colors cursor-pointer mb-6">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">PDF 파일을 드래그하거나 클릭하여 업로드</p>
                <button className="px-4 py-2 bg-duru-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-duru-orange-600 transition-colors">
                  파일 선택
                </button>
              </div>

              {/* 업로드된 파일 리스트 */}
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {file.uploadDate} · {file.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="보기"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="다운로드"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
