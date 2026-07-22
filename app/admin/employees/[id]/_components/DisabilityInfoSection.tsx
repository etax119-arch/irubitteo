import { Shield } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Employee } from '@/types/employee';

interface DisabilityInfoSectionProps {
  worker: Employee;
}

export function DisabilityInfoSection({ worker }: DisabilityInfoSectionProps) {
  return (
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
  );
}
