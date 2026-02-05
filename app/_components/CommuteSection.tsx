import { Smartphone, CalendarCheck, Calculator } from 'lucide-react';

const steps = [
  { step: "01", title: "간편 출근 체크", desc: "GPS/Beacon 기반으로 앱에서 터치 한 번으로 출근 완료" },
  { step: "02", title: "실시간 근무 현황", desc: "일별/월별 근무 시간과 잔여 연차를 한눈에 확인" },
  { step: "03", title: "자동 급여 정산", desc: "기록된 근태 데이터를 기반으로 정확한 급여 계산 지원" }
];

const features = [
  {
    icon: <Smartphone className="w-7 h-7" />,
    title: "모바일 앱 지원",
    desc: "언제 어디서나 간편한 접근성"
  },
  {
    icon: <CalendarCheck className="w-7 h-7" />,
    title: "유연한 스케줄",
    desc: "시차출퇴근, 재택근무 등 다양한 유형 지원"
  },
  {
    icon: <Calculator className="w-7 h-7" />,
    title: "정확한 데이터",
    desc: "오류 없는 근태 기록 및 통계 제공"
  }
];

export default function CommuteSection() {
  return (
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
              {steps.map((step, idx) => (
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
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 ${idx < features.length - 1 ? 'mb-6 pb-6 border-b border-gray-100' : ''}`}
              >
                <div className="w-14 h-14 bg-duru-orange-100 rounded-full flex items-center justify-center text-duru-orange-600">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{feature.title}</h4>
                  <p className="text-base text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
