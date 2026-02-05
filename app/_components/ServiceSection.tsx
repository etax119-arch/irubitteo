import { Briefcase, Clock, Building2, HeartHandshake } from 'lucide-react';

const services = [
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
];

export default function ServiceSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">주요 서비스 안내</h2>
          <p className="text-lg text-gray-600">안정적인 직업 생활을 위한 통합 서비스를 제공합니다.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => (
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
  );
}
