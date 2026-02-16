import { StarIcon } from '@/components/icons/LandingIcons';

const stats = [
  { num: "1,247", label: "누적 근로자", unit: "명" },
  { num: "83", label: "파트너 기업", unit: "곳" },
  { num: "96.2", label: "평균 근속률", unit: "%" },
  { num: "4.8", label: "관리자 만족도", unit: "/ 5.0" }
];

const testimonials = [
  {
    role: "표준사업장 관리자",
    company: "00 표준사업장",
    text: "이제 엑셀 안 써도 돼요. 출퇴근부터 급여까지 자동으로 정리되니까 근로자들과 대화하는 시간이 훨씬 늘었어요.",
    rating: 5
  },
  {
    role: "근로자",
    company: "익명",
    text: "내 근무시간이 투명하게 보이니까 안심이 돼요. 급여도 정확하게 나오고, 궁금한 건 언제든 확인할 수 있어서 좋아요.",
    rating: 5
  },
  {
    role: "기업 담당자",
    company: "00 기업",
    text: "표준사업장 설립이 어려울 줄 알았는데, 인증부터 시스템까지 전부 도와주셔서 3개월 만에 운영을 시작했습니다.",
    rating: 5
  }
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-duru-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 통계 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">숫자로 보는 이루빛터</h2>
          <p className="text-base text-gray-600">신뢰할 수 있는 파트너, 검증된 성과</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-duru-orange-600 mb-1">
                {stat.num}
                <span className="text-xl text-gray-500 ml-1">{stat.unit}</span>
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 후기 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">함께하는 분들의 이야기</h2>
          <p className="text-base text-gray-600">실제 사용자들의 솔직한 후기</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-duru-orange-200 transition-colors">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-duru-orange-500" />
                ))}
              </div>
              <p className="text-base text-gray-700 leading-relaxed break-keep mb-4">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-duru-orange-100 rounded-full flex items-center justify-center text-duru-orange-600 font-bold text-sm">
                  {testimonial.role.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{testimonial.role}</p>
                  <p className="text-xs text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 인증 배지 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-white px-8 py-4 rounded-full border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">고용노동부 인증</span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">사회적 기업</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}