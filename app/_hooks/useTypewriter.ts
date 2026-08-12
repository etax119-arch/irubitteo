'use client';

import { useEffect, useMemo, useState } from 'react';

/** 타이핑 대상 조각. `\n`은 줄바꿈으로 렌더링됩니다. */
export type TypePiece = {
  text: string;
  className?: string;
};

type Options = {
  /** 한 글자당 기본 간격(ms) */
  speed?: number;
  /** 타이핑 시작 전 대기(ms) */
  startDelay?: number;
  /** false면 타이핑 없이 전체 문장을 즉시 표시 (동작 줄이기 설정 등) */
  enabled?: boolean;
  /** true가 되는 순간부터 타이핑을 시작. false면 아무것도 표시하지 않음 */
  start?: boolean;
};

/**
 * 조각(TypePiece[]) 단위 텍스트를 한 글자씩 노출시키는 훅.
 * 노출된 글자 수(count)만 돌려주고, 실제 렌더링은 호출부에서 처리합니다.
 */
export function useTypewriter(pieces: TypePiece[], options: Options = {}) {
  const { speed = 60, startDelay = 0, enabled = true, start = true } = options;

  const fullText = useMemo(() => pieces.map((piece) => piece.text).join(''), [pieces]);
  const total = fullText.length;

  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    if (!enabled || !start) return;

    let typed = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      typed += 1;
      setTypedCount(typed);
      if (typed >= total) return;

      // 줄바꿈 뒤에는 잠깐 멈춰서 문장 단위로 읽히게 하고, 공백은 빠르게 지나갑니다.
      const justTyped = fullText[typed - 1];
      const delay = justTyped === '\n' ? speed * 7 : justTyped === ' ' ? speed * 0.5 : speed;
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [fullText, total, speed, startDelay, enabled, start]);

  const count = enabled ? Math.min(typedCount, total) : total;

  return { count, total, fullText, isDone: count >= total };
}
