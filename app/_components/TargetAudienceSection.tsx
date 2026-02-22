import Link from 'next/link';

export default function TargetAudienceSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Workers */}
          <div className="bg-landing-orange/10 rounded-2xl p-10 border-2 border-landing-orange/30 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-3xl font-bold text-landing-orange mb-4">장애인 구직자 안내</h3>
            <p className="text-lg text-gray-700 mb-8 break-keep">
              나의 능력에 맞는 일자리를 찾고 계신가요?
              상담부터 취업, 근태 관리까지 원스톱으로 도와드립니다.
            </p>
            <ul className="space-y-3 mb-8 text-gray-700 text-base">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-landing-orange rounded-full"></div>
                맞춤형 직무 추천 및 상담
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-landing-orange rounded-full"></div>
                이력서 등록 및 기업 매칭
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-landing-orange rounded-full"></div>
                취업 후 적응 지원 프로그램
              </li>
            </ul>
            <Link href="/resume" className="block w-full py-4 text-lg bg-white border-2 border-landing-orange text-landing-orange font-bold rounded-lg hover:bg-landing-orange/10 transition-colors text-center shadow-md">
              이력서 등록 바로가기
            </Link>
          </div>

          {/* For Companies */}
          <div className="bg-white rounded-2xl p-10 border-2 border-landing-orange/30 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-3xl font-bold text-landing-orange mb-4">기업 안내</h3>
            <p className="text-lg text-gray-700 mb-8 break-keep">
              장애인 고용을 통해 사회적 가치를 실현하세요.
              적합한 인재 추천과 효율적인 인사 관리를 지원합니다.
            </p>
            <ul className="space-y-3 mb-8 text-gray-700 text-base">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-landing-orange rounded-full"></div>
                직무 분석 및 인재 매칭
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-landing-orange rounded-full"></div>
                안정적인 근로 관리
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-landing-orange rounded-full"></div>
                통합 근태/인사 관리 시스템 제공
              </li>
            </ul>
            <Link
              href="/inquiry"
              className="block w-full py-4 text-lg bg-landing-orange text-white font-bold rounded-lg hover:bg-landing-orange/90 transition-colors text-center shadow-md"
            >
              신규 기업 문의 신청
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
