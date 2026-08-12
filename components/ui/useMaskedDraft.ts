import { useCallback, useEffect, useState } from 'react';

/**
 * 마스킹 직접입력 + 팝오버 선택을 함께 쓰는 입력값 상태를 관리한다.
 * DatePicker / TimePicker의 `allowManualInput` 트리거에서 공유한다.
 *
 * - `draft`: 타이핑 중인(아직 확정되지 않은) 문자열
 * - `handleChange`: input onChange에서 호출, `mask`를 적용해 draft를 갱신
 * - `commit`: onBlur / Enter에서 호출, `normalize`로 값을 확정하거나 이전 값으로 되돌림
 *
 * @param mask 입력 원문을 표시용 형태로 변환 (예: 20260207 → 2026-02-07)
 * @param normalize trim된 draft를 확정 값으로 변환. 유효하지 않으면 `null`을 반환해
 *                  이전 값으로 복원한다. 빈 문자열은 `''`을 반환해 값 해제를 허용.
 */
export function useMaskedDraft(
  value: string,
  onChange: (v: string) => void,
  mask: (raw: string) => string,
  normalize: (draft: string) => string | null,
) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleChange = useCallback((raw: string) => setDraft(mask(raw)), [mask]);

  const commit = useCallback(() => {
    const result = normalize(draft.trim());
    if (result === null) {
      setDraft(value); // 잘못된 형식은 이전 값으로 되돌림
    } else {
      onChange(result);
    }
  }, [draft, normalize, onChange, value]);

  return { draft, handleChange, commit };
}
