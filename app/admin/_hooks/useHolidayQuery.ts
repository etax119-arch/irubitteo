import { useQuery } from '@tanstack/react-query';
import { holidayApi } from '@/lib/api/holidays';
import { holidayKeys } from '@/lib/query/keys';

/** 연도별 국가 공휴일 목록 (관리자 설정 화면) */
export function useHolidays(year: number) {
  return useQuery({
    queryKey: holidayKeys.year(year),
    queryFn: () => holidayApi.getByYear(year),
    select: (data) => data.holidays,
  });
}
