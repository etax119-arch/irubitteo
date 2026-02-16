import { Noto_Sans_KR } from 'next/font/google';
import Header from './_components/Header';
import HeroSection from './_components/HeroSection';
import ServiceSection from './_components/ServiceSection';
import ReviewSection from './_components/ReviewSection';
import TargetAudienceSection from './_components/TargetAudienceSection';
import Footer from './_components/Footer';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-duru-ivory text-duru-text-main selection:bg-duru-orange-200 ${notoSansKR.className}`}>
      <Header />
      <HeroSection />
      <ServiceSection />
      <ReviewSection />
      <TargetAudienceSection />
      <Footer />
    </div>
  );
}
