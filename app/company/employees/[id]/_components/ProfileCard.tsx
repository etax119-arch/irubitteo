import { Phone, Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getEmployeeStatusLabel, getEmployeeStatusStyle } from '../../_hooks/useEmployeeDetail';
import type { CompanyEmployee } from '@/types/companyDashboard';

interface ProfileCardProps {
  employee: CompanyEmployee;
}

export function ProfileCard({ employee }: ProfileCardProps) {
  return (
    <>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-duru-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-duru-orange-600">{employee.name[0]}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{employee.name}</h2>
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2',
              getEmployeeStatusStyle(employee.status, employee.isActive)
            )}
          >
            {getEmployeeStatusLabel(employee.status, employee.isActive)}
          </span>
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-6">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">핸드폰번호:</span>
            <span className="font-semibold text-gray-900">{employee.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">입사일:</span>
            <span className="font-semibold text-gray-900">{employee.hireDate}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">계약 만료일:</span>
            <span className="font-semibold text-gray-900">{employee.contractEndDate ?? '-'}</span>
          </div>
        </div>
      </div>

      <div className="bg-duru-orange-50 rounded-xl p-6 border border-duru-orange-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-duru-orange-600 text-lg">#</span>
          근로자 고유번호
        </h3>
        <div className="bg-white rounded-lg p-4 border border-duru-orange-300">
          <p className="text-2xl font-bold text-duru-orange-600 text-center tracking-wider">
            {employee.uniqueCode}
          </p>
        </div>
      </div>
    </>
  );
}
