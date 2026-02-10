import type { Employee } from '@/types/employee';

/** 이름, 전화번호, 장애유형으로 직원 필터링 */
export function filterEmployees(employees: Employee[], query: string): Employee[] {
  if (!query) return employees;
  const q = query.toLowerCase();
  return employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(q) ||
      emp.phone.includes(query) ||
      (emp.disabilityType ?? '').toLowerCase().includes(q)
  );
}
