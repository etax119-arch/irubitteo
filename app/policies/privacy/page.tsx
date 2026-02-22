import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '이루빛터의 개인정보처리방침을 확인하세요.',
  alternates: { canonical: '/policies/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="space-y-8 text-sm leading-7 text-gray-700">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">개인정보처리방침</h2>
        <p>시행일: 2026년 3월 1일</p>
        <p>개정일: 2026년 3월 1일</p>
        <p>세무법인 스타택스(이하 &quot;회사&quot;)는 개인정보보호법 등 관련 법령을 준수하며 이용자의 개인정보를 안전하게 처리합니다.</p>
      </header>

      <section className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-base font-semibold text-gray-900">개인정보처리자 정보</h3>
        <p>법인명: 세무법인 스타택스</p>
        <p>대표자명: 윤현웅</p>
        <p>사업자등록번호: 154-81-02264</p>
        <p>
          사업장 소재지: 서울특별시 성동구 아차산로17길 49, 1509호, 1510호, 1511호, 1512호 (성수동2가, 생각공장 데시앙플렉스)
        </p>
        <p>
          본점 소재지: 서울특별시 성동구 아차산로17길 49, 1509호, 1510호, 1511호, 1512호 (성수동2가, 생각공장 데시앙플렉스)
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">1. 수집하는 개인정보 항목</h3>
        <p>회사는 회원가입, 서비스 제공, 출퇴근 기록 관리 과정에서 이름, 연락처, 계정정보, 서비스 이용기록 등을 수집할 수 있습니다.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">2. 개인정보의 처리 목적</h3>
        <p>회원 식별 및 인증, 서비스 제공, 출퇴근 및 근태 관리, 고객 문의 대응, 서비스 품질 개선을 위해 개인정보를 처리합니다.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">3. 개인정보 보유 및 이용기간</h3>
        <p>개인정보는 수집 목적 달성 시 지체 없이 파기하며, 관련 법령에서 보존 의무를 규정한 경우 해당 기간 동안 보관합니다.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">4. 개인정보의 제3자 제공 및 처리위탁</h3>
        <p>회사는 법령상 근거가 있거나 이용자 동의가 있는 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">5. 이용자의 권리</h3>
        <p>이용자는 개인정보 열람, 정정, 삭제, 처리정지 등을 요청할 수 있으며 회사는 관련 법령에 따라 지체 없이 조치합니다.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">6. 개인정보 보호책임자</h3>
        <p>개인정보 관련 문의는 아래 창구를 통해 접수할 수 있습니다.</p>
        <p>개인정보 보호책임자: 윤현웅</p>
        <p>담당 조직: 스타택스</p>
        <p>문의 이메일: etax119@gmail.com</p>
      </section>
    </article>
  );
}
