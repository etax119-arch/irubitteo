import { Shield, Edit2, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Employee } from '@/types/employee';

interface DisabilityInfoSectionProps {
  employee: Employee;
  isEditing: boolean;
  isSaving: boolean;
  tempSeverity: string;
  setTempSeverity: (v: string) => void;
  tempRecognitionDate: string;
  setTempRecognitionDate: (v: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function DisabilityInfoSection({
  employee,
  isEditing,
  isSaving,
  tempSeverity,
  setTempSeverity,
  tempRecognitionDate,
  setTempRecognitionDate,
  onEdit,
  onSave,
  onCancel,
}: DisabilityInfoSectionProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-duru-orange-600" />
          장애 정보
        </h3>
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            수정
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={onCancel}
              className="px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-2 py-1 bg-duru-orange-500 text-white rounded text-xs font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-3 h-3" />
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
      </div>
      {!isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">유형</span>
            <span className="font-bold text-gray-900">{employee.disabilityType ?? '-'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">중증/경증</span>
            <span className={cn(
              'inline-block px-2 py-0.5 rounded-full text-xs font-bold',
              employee.disabilitySeverity === '중증' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            )}>
              {employee.disabilitySeverity ?? '-'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">인정일</span>
            <span className="font-bold text-gray-900">{employee.disabilityRecognitionDate ?? '-'}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">유형</span>
            <span className="font-bold text-gray-900">{employee.disabilityType ?? '-'}</span>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">중증/경증</label>
            <div className="flex gap-2">
              {['중증', '경증'].map((severity) => (
                <button
                  key={severity}
                  type="button"
                  onClick={() => setTempSeverity(severity)}
                  className={cn(
                    'flex-1 py-1.5 rounded text-xs font-semibold transition-colors border',
                    tempSeverity === severity
                      ? 'bg-duru-orange-500 text-white border-duru-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {severity}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">인정일</label>
            <input
              type="date"
              value={tempRecognitionDate}
              onChange={(e) => setTempRecognitionDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-duru-orange-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
