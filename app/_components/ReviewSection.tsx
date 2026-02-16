'use client';

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    category: '기업',
    company: '제조업 기업',
    name: '이○수 대표님',
    rating: 5,
    text: '장애인 고용 의무를 이행하면서도 우수한 인력을 확보할 수 있었습니다. 출퇴근 관리 시스템이 매우 편리하고, 근로자들의 업무 능력도 뛰어나 만족스럽습니다.',
    gradient: 'from-orange-400/15 to-amber-400/15',
    borderColor: 'border-orange-200',
    iconBg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    iconColor: 'text-orange-600'
  },
  {
    category: '보호자',
    company: '장애인 자녀',
    name: '김○희 어머님',
    rating: 5,
    text: '우리 아이가 처음으로 안정적인 직장을 갖게 되었어요. 매달 급여도 꼬박꼬박 받고, 회사에서도 인정받는 모습을 보니 정말 뿌듯합니다. 이루빛터 덕분에 희망을 찾았습니다.',
    gradient: 'from-orange-500/15 to-amber-500/15',
    borderColor: 'border-duru-orange-200',
    iconBg: 'bg-gradient-to-br from-duru-orange-50 to-amber-50',
    iconColor: 'text-duru-orange-600'
  },
  {
    category: '병원',
    company: '종합병원',
    name: '박○진 인사팀장님',
    rating: 5,
    text: '병원 내 다양한 부서에 장애인 근로자를 배치했는데, 관리가 정말 수월합니다. 실시간 근태 확인과 급여 정산이 자동화되어 있어 업무 효율이 크게 향상되었습니다.',
    gradient: 'from-orange-300/15 to-yellow-400/15',
    borderColor: 'border-orange-100',
    iconBg: 'bg-gradient-to-br from-orange-50 to-yellow-50',
    iconColor: 'text-orange-500'
  }
];

export default function ReviewSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-duru-orange-50 to-amber-50 border border-duru-orange-100 rounded-full text-duru-orange-600 text-sm font-semibold mb-6 shadow-sm">
            REVIEWS
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            함께한 분들의{' '}
            <span className="bg-gradient-to-r from-duru-orange-600 to-amber-600 bg-clip-text text-transparent">
              생생한 이야기
            </span>
          </h2>
        </div>

        {/* 리뷰 카드 그리드 */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden bg-white rounded-3xl p-8 border ${review.borderColor} hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${idx * 150}ms`
              }}
            >

              <div className="relative z-10">
                {/* 카테고리 배지 */}
                <div className={`inline-block px-4 py-1.5 ${review.iconBg} ${review.iconColor} rounded-full text-sm font-semibold mb-5 shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                  {review.category}
                </div>

                {/* 별점 */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>

                {/* 리뷰 내용 */}
                <p className="text-gray-700 leading-relaxed mb-6 min-h-[140px] break-keep">
                  "{review.text}"
                </p>

                {/* 구분선 */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent mb-5 group-hover:via-orange-400 transition-colors duration-300" />

                {/* 작성자 정보 */}
                <div>
                  <p className="text-gray-900 font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors duration-300">
                    {review.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {review.company}
                  </p>
                </div>
              </div>

              {/* 하단 강조선 - 주황빛 그라데이션으로 통일 */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${
                idx === 0 ? 'from-orange-500 via-amber-500 to-yellow-500' :
                idx === 1 ? 'from-duru-orange-500 via-orange-400 to-amber-500' :
                'from-amber-500 via-orange-400 to-red-400'
              } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}