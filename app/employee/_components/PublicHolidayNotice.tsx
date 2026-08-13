/**
 * 국가 공휴일 안내.
 *
 * 회사 휴일과 달리 출근 버튼을 가리지 않는다 — 공휴일에 근무하는 근로자도 있으므로
 * 출근은 항상 가능해야 하고, 출근하지 않으면 서버가 결근 대신 '공휴'로 남긴다.
 */
export function PublicHolidayNotice({ name }: { name: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
      <p className="text-lg font-bold text-red-600">오늘은 {name}입니다</p>
      <p className="mt-1 text-sm text-red-500">
        쉬는 날이라 출근하지 않아도 결근으로 처리되지 않습니다
      </p>
    </div>
  );
}
