import { useState, useEffect, useCallback } from 'react';
import { getEmployee } from '@/lib/api/employees';
import type { Employee } from '@/types/employee';

export function useEmployeeDetail(employeeId: string) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEmployee(employeeId);
      setEmployee(response.data);
    } catch {
      setError('근로자 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return {
    employee,
    setEmployee,
    isLoading,
    error,
    fetchEmployee,
  };
}
