'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/**
 * 사용자가 OS에서 "동작 줄이기"를 켰는지 여부.
 * 애니메이션을 건너뛰고 최종 상태를 즉시 보여줄 때 사용합니다.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // 서버 렌더링 시에는 애니메이션이 있다고 가정
  );
}
