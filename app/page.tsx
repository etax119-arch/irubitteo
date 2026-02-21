import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Header from './_components/Header';
import HeroSection from './_components/HeroSection';
import ServiceSection from './_components/ServiceSection';
import ReviewSection from './_components/ReviewSection';
import TargetAudienceSection from './_components/TargetAudienceSection';
import Footer from './_components/Footer';
import StructuredData from './_components/StructuredData';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.irubitteo.com',
  },
};

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '이루빛터',
  alternateName: 'Irubitteo',
  url: 'https://www.irubitteo.com',
  logo: 'https://www.irubitteo.com/images/logo.png',
  description: '가능성이 일상의 빛이 되는 곳, 이루빛터에서는 장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여 빛나는 내일을 함께 합니다.',
};

const websiteData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '이루빛터',
  alternateName: 'Irubitteo',
  url: 'https://www.irubitteo.com',
};

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-duru-ivory text-duru-text-main selection:bg-landing-orange selection:text-white ${notoSansKR.className}`} style={{ fontWeight: 500 }}>
      <StructuredData data={organizationData} />
      <StructuredData data={websiteData} />
      <Header />
      <HeroSection />
      <ServiceSection />
      <ReviewSection />
      <TargetAudienceSection />
      <Footer />
    </div>
  );
}
