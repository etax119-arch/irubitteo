'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  Briefcase,
  CalendarClock,
  FileSpreadsheet,
  FileUp,
  Languages,
  Megaphone,
  Newspaper,
  Palette,
  Presentation,
  Receipt,
  ScanSearch,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  example: string;
  icon: LucideIcon;
  /** gpt-image-2 일러스트 도착 시 이 필드만 추가하면 아이콘 대신 렌더됨 */
  image?: string;
  imageAlt?: string;
}

const JOBS: Job[] = [
  { id: 'monitoring', title: '모니터링', example: '경쟁사·키워드 모니터링 등', icon: ScanSearch, image: '/images/jobs/job-1.png', imageAlt: '모니터링 일러스트 — 돋보기와 그래프' },
  { id: 'data-entry', title: '자료입력', example: '엑셀·한글·워드 입력 등', icon: FileSpreadsheet, image: '/images/jobs/job-2.png', imageAlt: '자료입력 일러스트 — 키보드와 스프레드시트' },
  { id: 'job-posting', title: '채용공고 업로드', example: '블로그·카페·채용사이트 업로드 등', icon: FileUp, image: '/images/jobs/job-3.png', imageAlt: '채용공고 업로드 일러스트 — 문서와 업로드 화살표' },
  { id: 'marketing', title: '홍보 마케팅', example: '홍보 블로그·카페 운영 등', icon: Megaphone, image: '/images/jobs/job-4.png', imageAlt: '홍보 마케팅 일러스트 — 확성기' },
  { id: 'attendance', title: '근태관리', example: '근무자 출결·법정교육 관리 등', icon: CalendarClock, image: '/images/jobs/job-5.png', imageAlt: '근태관리 일러스트 — 달력과 시계' },
  { id: 'translation', title: '번역', example: '영어·일어·중국어 등 외국어 번역', icon: Languages, image: '/images/jobs/job-6.png', imageAlt: '번역 일러스트 — 언어 말풍선' },
  { id: 'sns', title: 'SNS 활성화', example: '좋아요·댓글 작업 등', icon: ThumbsUp, image: '/images/jobs/job-7.png', imageAlt: 'SNS 활성화 일러스트 — 좋아요와 하트' },
  { id: 'ppt', title: 'PPT 제작', example: '기획안 작성 등', icon: Presentation, image: '/images/jobs/job-8.png', imageAlt: 'PPT 제작 일러스트 — 차트 프레젠테이션 보드' },
  { id: 'biz-support', title: '경영지원', example: '자료조사·보고서 작성 등', icon: Briefcase, image: '/images/jobs/job-9.png', imageAlt: '경영지원 일러스트 — 서류가방과 문서' },
  { id: 'design', title: '디자인', example: '카드뉴스·배너 디자인 등', icon: Palette, image: '/images/jobs/job-10.png', imageAlt: '디자인 일러스트 — 팔레트와 붓' },
  { id: 'news-clipping', title: '뉴스클리핑', example: '인터넷 기사 수집 및 보고 등', icon: Newspaper, image: '/images/jobs/job-11.png', imageAlt: '뉴스클리핑 일러스트 — 신문과 가위' },
  { id: 'accounting', title: '회계', example: '전표작성·영수증 처리 등', icon: Receipt, image: '/images/jobs/job-12.png', imageAlt: '회계 일러스트 — 영수증과 계산기' },
];

function JobVisual({ job }: { job: Job }) {
  return (
    <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-duru-orange-50 flex items-center justify-center overflow-hidden">
      {job.image ? (
        <Image
          src={job.image}
          alt={job.imageAlt ?? job.title}
          fill
          sizes="56px"
          className="object-cover"
        />
      ) : (
        <job.icon aria-hidden className="w-6 h-6 lg:w-7 lg:h-7 text-landing-orange" />
      )}
    </div>
  );
}

export default function RecommendedJobsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-duru-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            우리 회사에 맞는 <span className="text-landing-orange">이런 직무</span>를 추천해
            드려요
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            재택근무로도 충분히 해낼 수 있는 열두 가지 직무예요.{' '}
            <br className="hidden sm:block" />
            어떤 직무가 맞을지 고민된다면, 이루빛터가 함께 찾아드릴게요.
          </p>
        </div>

        {/* 직무 카드 그리드 */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {JOBS.map((job, index) => (
            <li
              key={job.id}
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? `${100 + index * 60}ms` : '0ms' }}
            >
              {/* 호버 전환은 스태거 delay의 영향을 받지 않도록 li와 분리 */}
              <div className="h-full rounded-2xl bg-white border border-duru-orange-100 shadow-soft p-4 lg:p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-duru-orange-200">
                <JobVisual job={job} />
                <h3 className="mt-3 font-bold text-sm lg:text-base text-duru-text-main break-keep leading-snug">
                  {job.title}
                </h3>
                <p className="mt-1 text-xs lg:text-sm text-duru-text-sub break-keep leading-relaxed">
                  {job.example}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
