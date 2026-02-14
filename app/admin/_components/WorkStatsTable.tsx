'use client';

import { useState } from 'react';
import { Building2, ChevronDown, ChevronRight, Eye, Edit, Check, X } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import type { MonthlyWorkStatsCompany } from '@/types/adminDashboard';

interface WorkStatsTableProps {
  companies: MonthlyWorkStatsCompany[];
  selectedMonth: string;
  onPrintPreview: (company: MonthlyWorkStatsCompany) => void;
  onWorkStatsUpdate?: (companyId: string, employeeId: string, field: 'workDays' | 'totalHours', value: number) => void;
}

export function WorkStatsTable({
  companies,
  selectedMonth,
  onPrintPreview,
  onWorkStatsUpdate,
}: WorkStatsTableProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({});
  const [editingCell, setEditingCell] = useState<{
    companyId: string;
    employeeId: string;
    field: 'workDays' | 'totalHours';
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const startEdit = (companyId: string, employeeId: string, field: 'workDays' | 'totalHours', currentValue: number) => {
    setEditingCell({ companyId, employeeId, field });
    setEditValue(currentValue.toString());
  };

  const saveEdit = () => {
    if (!editingCell) return;
    const value = Number(editValue);
    if (!isNaN(value) && value >= 0) {
      onWorkStatsUpdate?.(editingCell.companyId, editingCell.employeeId, editingCell.field, value);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  return (
    <div className="space-y-4">
      {companies.map((company) => {
        const totalEmployees = company.employees.length;
        const avgWorkHours = totalEmployees > 0
          ? (company.employees.reduce((sum, w) => sum + w.totalHours, 0) / totalEmployees).toFixed(1)
          : '0';
        const avgWorkDays = totalEmployees > 0
          ? (company.employees.reduce((sum, w) => sum + w.workDays, 0) / totalEmployees).toFixed(1)
          : '0';
        const isExpanded = expandedCompanies[company.companyId];

        return (
          <div
            key={company.companyId}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden print:break-inside-avoid"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggleCompany(company.companyId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCompany(company.companyId);
                }
              }}
              className="w-full bg-gradient-to-r from-duru-orange-50 to-white px-6 py-5 border-b border-gray-200 hover:from-duru-orange-100 hover:to-duru-orange-50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-duru-orange-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-duru-orange-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1">
                      <Building2 className="w-5 h-5 text-duru-orange-600" />
                      {company.companyName}
                    </h3>
                    <p className="text-sm text-gray-600">전체 {totalEmployees}명</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrintPreview(company);
                    }}
                    className="px-4 py-2 bg-duru-orange-500 text-white rounded-lg font-semibold hover:bg-duru-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    인쇄 프리뷰
                  </button>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="p-6">
                <div className="mb-6 print:block hidden">
                  <h2 className="text-2xl font-bold text-center mb-2">{company.companyName} 월 근무 통계</h2>
                  <p className="text-center text-gray-600">
                    {selectedMonth.split('-')[0]}년 {selectedMonth.split('-')[1]}월
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-duru-orange-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-300">
                          이름
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 border border-gray-300">
                          근무요일
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 border border-gray-300">
                          출근 일수
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 border border-gray-300">
                          총 근무시간
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {company.employees.map((employee, index) => (
                        <tr key={employee.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-gray-900 border border-gray-300">
                            {employee.name}
                          </td>
                          <td className="px-4 py-3 text-gray-700 border border-gray-300">
                            <div className="flex gap-1 flex-wrap">
                              {employee.scheduledWorkDays.map((day) => (
                                <span
                                  key={day}
                                  className="px-2 py-0.5 bg-duru-orange-100 text-duru-orange-700 text-xs font-medium rounded"
                                >
                                  {day}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-900 border border-gray-300">
                            {editingCell?.companyId === company.companyId &&
                            editingCell?.employeeId === employee.id &&
                            editingCell?.field === 'workDays' ? (
                              <div className="flex items-center justify-center gap-2">
                                <Input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEdit();
                                    if (e.key === 'Escape') cancelEdit();
                                  }}
                                  min="0"
                                  size="sm"
                                  className="w-20 text-center"
                                  autoFocus
                                />
                                <IconButton onClick={saveEdit} variant="ghost" size="sm" icon={<Check className="w-full h-full text-green-600" />} label="저장" className="hover:bg-green-100" />
                                <IconButton onClick={cancelEdit} variant="ghost" size="sm" icon={<X className="w-full h-full text-red-600" />} label="취소" className="hover:bg-red-100" />
                              </div>
                            ) : (
                              <div
                                onClick={() => startEdit(company.companyId, employee.id, 'workDays', employee.workDays)}
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-flex items-center gap-1"
                              >
                                <span>{employee.workDays}일</span>
                                <Edit className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-blue-600 border border-gray-300">
                            {editingCell?.companyId === company.companyId &&
                            editingCell?.employeeId === employee.id &&
                            editingCell?.field === 'totalHours' ? (
                              <div className="flex items-center justify-center gap-2">
                                <Input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEdit();
                                    if (e.key === 'Escape') cancelEdit();
                                  }}
                                  min="0"
                                  step="0.5"
                                  size="sm"
                                  className="w-20 text-center"
                                  autoFocus
                                />
                                <IconButton onClick={saveEdit} variant="ghost" size="sm" icon={<Check className="w-full h-full text-green-600" />} label="저장" className="hover:bg-green-100" />
                                <IconButton onClick={cancelEdit} variant="ghost" size="sm" icon={<X className="w-full h-full text-red-600" />} label="취소" className="hover:bg-red-100" />
                              </div>
                            ) : (
                              <div
                                onClick={() => startEdit(company.companyId, employee.id, 'totalHours', employee.totalHours)}
                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-flex items-center gap-1"
                              >
                                <span>{employee.totalHours}h</span>
                                <Edit className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-duru-orange-100 border-t-2 border-duru-orange-500">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 font-bold text-gray-900 border border-gray-300">
                          평균
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-gray-900 border border-gray-300">
                          {avgWorkDays}일
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-blue-600 border border-gray-300">
                          {avgWorkHours}h
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
