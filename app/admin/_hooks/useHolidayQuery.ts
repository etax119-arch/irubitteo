import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { holidayApi } from '@/lib/api/holidays';
import { holidayKeys } from '@/lib/query/keys';

/** 연도별 국가 공휴일 목록 (관리자 설정 화면) */
export function useHolidays(year: number) {
  return useQuery({
    queryKey: holidayKeys.year(year),
    queryFn: () => holidayApi.getByYear(year),
    select: (data) => data.holidays,
    // 연도를 넘길 때 목록이 스켈레톤으로 깜빡이지 않게 이전 연도를 유지한다
    placeholderData: keepPreviousData,
  });
}
