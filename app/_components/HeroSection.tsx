'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { Clock, FileUp, ChevronRight } from 'lucide-react';
import { useTypewriter, type TypePiece } from '../_hooks/useTypewriter';
import { usePrefersReducedMotion } from '../_hooks/usePrefersReducedMotion';

const HEADLINE: TypePiece[] = [
  { text: '장애인 근로자와 기업이\n' },
  { text: '함께 빛나는', className: 'text-landing-orange' },
  { text: ' 일터' },
];

const DESCRIPTION: TypePiece[] = [
  { text: '가능성이 일상의 빛이 되는 곳, 이루빛터에서는\n장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여\n빛나는 내일을 함께 합니다.' },
];

/** 조각 배열에서 앞쪽 count 글자만 노드로 만들어 반환합니다. */
function renderTyped(
  pieces: TypePiece[],
  count: number,
  options: { extraClassName?: (piece: TypePiece) => string; softBreak?: boolean } = {},
) {
  const { extraClassName, softBreak = false } = options;
  const nodes: ReactNode[] = [];
  let consumed = 0;

  pieces.forEach((piece, pieceIndex) => {
    const remaining = count - consumed;
    if (remaining <= 0) return;

    const visible = piece.text.slice(0, remaining);
    consumed += visible.length;

    visible.split('\n').forEach((line, lineIndex) => {
      const className = [piece.className, extraClassName?.(piece)].filter(Boolean).join(' ');
      nodes.push(
        <Fragment key={`${pieceIndex}-${lineIndex}`}>
          {lineIndex > 0 && (
            <>
              {/* 모바일에서는 줄바꿈 대신 공백으로 자연스럽게 흐르게 합니다. */}
              {softBreak && <span className="sm:hidden"> </span>}
              <br className={softBreak ? 'hidden sm:block' : undefined} />
            </>
          )}
          <span className={className || undefined}>{line}</span>
        </Fragment>,
      );
    });
  });

  return nodes;
}

/** 타이핑 위치를 알려주는 깜빡이는 커서 */
function Caret({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block w-[0.08em] translate-y-[0.12em] rounded-full bg-landing-orange shadow-[0_0_10px_rgba(223,143,75,0.75)] animate-caret-blink ${className}`}
    />
  );
}

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const headline = useTypewriter(HEADLINE, {
    speed: 85,
    startDelay: 350,
    enabled: !prefersReducedMotion,
    start: isLoaded,
  });

  const description = useTypewriter(DESCRIPTION, {
    speed: 38,
    startDelay: 250,
    enabled: !prefersReducedMotion,
    // 제목이 다 찍힌 뒤에 이어서 타이핑합니다.
    start: headline.isDone,
  });

  const showDescription = headline.isDone;

  const reveal = (delay: number) => ({
    className: `transition-all duration-1000 ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section className="relative isolate flex items-center min-h-screen overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src="/images/hero-bg-02.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center z-0"
      />
      {/* 가독성 오버레이 (왼쪽 아이보리 → 오른쪽 투명) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-duru-ivory via-duru-ivory/85 to-transparent" />
      {/* 하단 페이드 (주황 → 옅은 오렌지빛 → 아이보리로 서비스 섹션과 연결) */}
      <div className="absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-b from-transparent via-duru-orange-50/60 to-duru-ivory" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-xl space-y-8 text-left">
          <div
            className={`flex items-center gap-3 mb-2 ${reveal(0).className}`}
            style={reveal(0).style}
          >
            <span className="w-12 h-[2px] bg-landing-orange"></span>
            <span className="text-landing-orange font-bold tracking-[0.2em] text-sm uppercase">
              IRUBITTEO : SHINING TOGETHER
            </span>
          </div>

          {/* text-5xl/lg:text-6xl이 line-height:1을 함께 지정하므로, 줄 간격은 브레이크포인트마다 다시 덮어써야 한다 */}
          <h1 className="grid text-5xl lg:text-6xl font-bold leading-[1.35] lg:leading-[1.35] tracking-tight text-gray-900 break-keep">
            {/* 검색엔진·스크린리더용 원문 (레이아웃에 영향 없음) */}
            <span className="sr-only">장애인 근로자와 기업이 함께 빛나는 일터</span>
            {/* 타이핑 중에도 높이가 흔들리지 않도록 자리를 잡아두는 사본 */}
            <span aria-hidden className="col-start-1 row-start-1 invisible">
              장애인 근로자와 기업이<br />
              함께 빛나는 일터
            </span>
            <span aria-hidden className="col-start-1 row-start-1">
              {renderTyped(HEADLINE, headline.count, {
                extraClassName: (piece) =>
                  piece.className
                    ? `hero-highlight ${headline.isDone ? 'hero-highlight-on' : ''}`
                    : '',
              })}
              {!showDescription && <Caret className="h-[0.9em] ml-[0.06em]" />}
            </span>
          </h1>

          <div
            className={`grid text-xl text-gray-600 leading-relaxed break-keep max-w-xl transition-opacity duration-500 ${
              showDescription ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="sr-only">
              가능성이 일상의 빛이 되는 곳, 이루빛터에서는 장애인 근로자를 위한 맞춤형 직무를
              설계하고 매칭하여 빛나는 내일을 함께 합니다.
            </p>
            <span aria-hidden className="col-start-1 row-start-1 invisible">
              가능성이 일상의 빛이 되는 곳, 이루빛터에서는<br className="hidden sm:block" />
              장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여<br className="hidden sm:block" />
              빛나는 내일을 함께 합니다.
            </span>
            <span aria-hidden className="col-start-1 row-start-1">
              {renderTyped(DESCRIPTION, description.count, { softBreak: true })}
              {showDescription && !description.isDone && <Caret className="h-[0.85em] ml-[0.06em]" />}
            </span>
          </div>

          <div
            className={`flex flex-wrap gap-4 pt-4 ${reveal(450).className}`}
            style={reveal(450).style}
          >
            <Link
              href="/login/employee"
              className="px-8 py-4 min-w-[240px] bg-landing-orange text-white border border-transparent rounded font-medium text-lg hover:bg-landing-orange/90 transition-colors shadow-soft flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              출퇴근 하기
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/resume"
              className="px-8 py-4 min-w-[240px] bg-white text-gray-700 border border-gray-200 rounded font-medium text-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <FileUp className="w-5 h-5" />
              이력서 등록하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
