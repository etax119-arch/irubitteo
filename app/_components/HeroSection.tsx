import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, FileUp, ChevronRight } from 'lucide-react';

/** 등장 애니메이션(아래에서 천천히 올라오기)의 순서별 지연 시간 */
const RISE_DELAY = {
  tagline: '0.2s',
  headline: '0.55s',
  description: '0.95s',
  actions: '1.35s',
} as const;

/** 반복 애니메이션으로 강조할 문구 (글자 단위로 쪼개서 순차 재생) */
const BLINK_TEXT = '함께 빛나는';
/**
 * 사이클이 "보이는 상태"에서 시작하므로, 이 지연 동안 문구는 헤드라인과 함께 떠오른 채 유지된다.
 * 첫 사라짐은 여기에 보이는 구간(4s의 55% = 2.2s)을 더한 2.8초 시점에 일어난다.
 */
const BLINK_START_DELAY = 0.6;
/** 글자 사이의 시차 */
const BLINK_STAGGER = 0.14;

/**
 * 글자마다 inline-block 스팬으로 쪼개면 글자 사이에서도 줄바꿈이 일어날 수 있어,
 * 단어 단위로 묶어 둡니다. start는 공백까지 포함한 원문 기준 글자 순번(=재생 순서)입니다.
 */
const BLINK_WORDS = BLINK_TEXT.split(' ').reduce<{ word: string; start: number }[]>(
  (words, word) => {
    const previous = words[words.length - 1];
    const start = previous ? previous.start + previous.word.length + 1 : 0;
    return [...words, { word, start }];
  },
  [],
);

export default function HeroSection() {
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
            className="flex items-center gap-3 mb-2 animate-hero-rise"
            style={{ animationDelay: RISE_DELAY.tagline }}
          >
            <span className="w-12 h-[2px] bg-landing-orange"></span>
            <span className="text-landing-orange font-bold tracking-[0.2em] text-sm uppercase">
              IRUBITTEO : SHINING TOGETHER
            </span>
          </div>

          {/* text-5xl/lg:text-6xl이 line-height:1을 함께 지정하므로, 줄 간격은 브레이크포인트마다 다시 덮어써야 한다 */}
          <h1
            className="text-5xl lg:text-6xl font-bold leading-[1.35] lg:leading-[1.35] tracking-tight text-gray-900 break-keep animate-hero-rise"
            style={{ animationDelay: RISE_DELAY.headline }}
          >
            {/* 글자를 쪼개면 읽기 흐름이 끊길 수 있어, 스크린리더에는 원문 한 줄만 전달합니다 */}
            <span className="sr-only">장애인 근로자와 기업이 함께 빛나는 일터</span>
            <span aria-hidden>
              장애인 근로자와 기업이
              <br />
              {/* 위로 사라졌다 아래에서 나타나기를 글자마다 시차를 두고 반복 */}
              <span className="text-landing-orange">
                {BLINK_WORDS.map(({ word, start }, wordIndex) => (
                  <Fragment key={word + start}>
                    {wordIndex > 0 && ' '}
                    <span className="whitespace-nowrap">
                      {Array.from(word).map((char, charIndex) => (
                        <span
                          key={charIndex}
                          className="inline-block animate-hero-char"
                          style={{
                            animationDelay: `${(
                              BLINK_START_DELAY +
                              (start + charIndex) * BLINK_STAGGER
                            ).toFixed(2)}s`,
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  </Fragment>
                ))}
              </span>{' '}
              일터
            </span>
          </h1>

          <p
            className="text-xl text-gray-600 leading-relaxed break-keep max-w-xl animate-hero-rise"
            style={{ animationDelay: RISE_DELAY.description }}
          >
            {/* 모바일에서는 줄바꿈 대신 공백으로 자연스럽게 흐르게 합니다. */}
            가능성이 일상의 빛이 되는 곳, 이루빛터에서는{' '}
            <br className="hidden sm:block" />
            장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여{' '}
            <br className="hidden sm:block" />
            빛나는 내일을 함께 합니다.
          </p>

          <div
            className="flex flex-wrap gap-4 pt-4 animate-hero-rise"
            style={{ animationDelay: RISE_DELAY.actions }}
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
