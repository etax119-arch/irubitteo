import Link from 'next/link';
import {
  Briefcase,
  Clock,
  Building2,
  HeartHandshake,
  ChevronRight,
  Phone,
  MapPin,
  Smartphone,
  CalendarCheck,
  Calculator,
  Shield
} from 'lucide-react';
import HeroSlider from './_components/HeroSlider';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-duru-ivory font-sans text-duru-text-main selection:bg-duru-orange-200">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-duru-orange-600">두루빛터</div>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-lg font-semibold text-gray-600">
              <a href="#" className="hover:text-duru-orange-600 transition-colors">신규 기업 문의</a>
              <a href="#" className="hover:text-duru-orange-600 transition-colors">채용정보</a>
              <a href="#" className="hover:text-duru-orange-600 transition-colors">고객센터</a>
            </nav>
            <Link
              href="/login/admin"
              className="text-base font-semibold text-white bg-duru-orange-500 px-6 py-2.5 rounded hover:bg-duru-orange-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Shield className="w-4 h-4" />
              두루빛 관리자
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 text-left">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-12 h-[2px] bg-duru-orange-500"></span>
              <span className="text-duru-orange-500 font-bold tracking-[0.2em] text-sm uppercase">
                DURUBITTEO : SHINING TOGETHER
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.3] tracking-tight text-gray-900 break-keep">
              장애인 근로자와 기업이<br/>
              <span className="text-duru-orange-600">함께 빛나는</span> 일터
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed break-keep max-w-xl">
              두루빛터는 장애인 근로자를 위한 맞춤형 일자리 매칭부터<br className="hidden sm:block"/>
              편리한 출퇴근 관리까지, 든든한 다리가 되어드립니다.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/login/employee"
                className="px-8 py-4 bg-duru-orange-500 text-white rounded font-medium text-lg hover:bg-duru-orange-600 transition-colors shadow-soft flex items-center gap-2"
              >
                <Clock className="w-5 h-5" />
                출퇴근 하기
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login/company"
                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded font-medium text-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                기업 관리자 페이지
              </Link>
            </div>
          </div>

          <HeroSlider />
        </div>
      </section>

      {/* Service Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">주요 서비스 안내</h2>
            <p className="text-lg text-gray-600">안정적인 직업 생활을 위한 통합 서비스를 제공합니다.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Briefcase className="w-10 h-10 text-duru-orange-500" />,
                title: "맞춤 일자리 연결",
                desc: "직무 능력과 희망 조건을 고려한 최적의 일자리를 매칭해 드립니다."
              },
              {
                icon: <Clock className="w-10 h-10 text-duru-orange-500" />,
                title: "스마트 출퇴근 관리",
                desc: "모바일 앱으로 간편하게 출퇴근을 기록하고 근무 일정을 관리합니다."
              },
              {
                icon: <Building2 className="w-10 h-10 text-duru-orange-500" />,
                title: "기업·기관 채용 연계",
                desc: "장애인 고용을 희망하는 우수 기업 및 공공기관과 협력합니다."
              },
              {
                icon: <HeartHandshake className="w-10 h-10 text-duru-orange-500" />,
                title: "안정적인 근무 지원",
                desc: "취업 후에도 지속적인 상담과 모니터링으로 적응을 돕습니다."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-duru-ivory border border-duru-orange-100 rounded-xl hover:shadow-soft transition-shadow">
                <div className="mb-6 bg-white w-16 h-16 rounded-lg border border-duru-orange-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed break-keep">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commute Management Section */}
      <section className="py-20 bg-duru-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-white border border-duru-orange-200 rounded text-duru-orange-600 text-base font-medium mb-4">
                스마트 근태 관리
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                복잡한 출퇴근 기록,<br/>
                <span className="text-duru-orange-600">간편하게 해결하세요</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed break-keep">
                위치 기반 인증으로 정확한 출퇴근 체크가 가능합니다.
                근로자는 자신의 근무 시간을 투명하게 확인하고, 관리자는 실시간으로 현황을 파악할 수 있어 효율적입니다.
              </p>

              <div className="space-y-6">
                {[
                  { step: "01", title: "간편 출근 체크", desc: "GPS/Beacon 기반으로 앱에서 터치 한 번으로 출근 완료" },
                  { step: "02", title: "실시간 근무 현황", desc: "일별/월별 근무 시간과 잔여 연차를 한눈에 확인" },
                  { step: "03", title: "자동 급여 정산", desc: "기록된 근태 데이터를 기반으로 정확한 급여 계산 지원" }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="text-duru-orange-400 font-bold font-mono text-xl mt-1">{step.step}</span>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-base text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-duru-orange-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 bg-duru-orange-100 rounded-full flex items-center justify-center text-duru-orange-600">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">모바일 앱 지원</h4>
                  <p className="text-base text-gray-600">언제 어디서나 간편한 접근성</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 bg-duru-orange-100 rounded-full flex items-center justify-center text-duru-orange-600">
                  <CalendarCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">유연한 스케줄</h4>
                  <p className="text-base text-gray-600">시차출퇴근, 재택근무 등 다양한 유형 지원</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-duru-orange-100 rounded-full flex items-center justify-center text-duru-orange-600">
                  <Calculator className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">정확한 데이터</h4>
                  <p className="text-base text-gray-600">오류 없는 근태 기록 및 통계 제공</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Workers */}
            <div className="bg-duru-ivory rounded-2xl p-10 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">구직자 안내</h3>
              <p className="text-lg text-gray-600 mb-8 break-keep">
                나의 능력에 맞는 일자리를 찾고 계신가요?
                상담부터 취업, 근태 관리까지 원스톱으로 도와드립니다.
              </p>
              <ul className="space-y-3 mb-8 text-gray-700 text-base">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-duru-orange-500 rounded-full"></div>
                  맞춤형 직무 추천 및 상담
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-duru-orange-500 rounded-full"></div>
                  이력서 및 면접 코칭
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-duru-orange-500 rounded-full"></div>
                  취업 후 적응 지원 프로그램
                </li>
              </ul>
              <a href="#" className="block w-full py-4 text-lg bg-white border border-duru-orange-200 text-duru-orange-600 font-bold rounded hover:bg-duru-orange-50 transition-colors text-center">
                구직자 서비스 바로가기
              </a>
            </div>

            {/* For Companies */}
            <div className="bg-gray-50 rounded-2xl p-10 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">기업/기관 안내</h3>
              <p className="text-lg text-gray-600 mb-8 break-keep">
                장애인 고용을 통해 사회적 가치를 실현하세요.
                적합한 인재 추천과 효율적인 인사 관리를 지원합니다.
              </p>
              <ul className="space-y-3 mb-8 text-gray-700 text-base">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  직무 분석 및 인재 매칭
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  고용 장려금 및 지원 제도 안내
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  통합 근태/인사 관리 시스템 제공
                </li>
              </ul>
              <a
                href="#"
                className="block w-full py-4 text-lg bg-white border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-100 transition-colors text-center"
              >
                신규 기업 문의 신청
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-8">함께하는 기관 및 기업</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-60 grayscale">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                Partner Logo {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h5 className="text-white font-bold text-xl mb-4">두루빛터</h5>
              <p className="leading-relaxed mb-4 max-w-sm">
                장애인 근로자의 안정적인 일자리와<br/>
                효율적인 근태 관리를 지원하는 고용 플랫폼입니다.
              </p>
            </div>
            <div>
              <h6 className="text-white font-bold mb-4 text-lg">서비스</h6>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">일자리 찾기</a></li>
                <li><a href="#" className="hover:text-white">근태관리 안내</a></li>
                <li><a href="#" className="hover:text-white">기업 채용 문의</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-white font-bold mb-4 text-lg">문의처</h6>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><Phone className="w-5 h-5"/> 1588-0000</li>
                <li className="flex items-center gap-2"><MapPin className="w-5 h-5"/> 서울특별시 중구 ...</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 Duru-bit-teo. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">이용약관</a>
              <a href="#" className="hover:text-white">개인정보처리방침</a>
              <a href="#" className="hover:text-white">웹접근성정책</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
