import Header from './_components/Header';
import HeroSection from './_components/HeroSection';
import ServiceSection from './_components/ServiceSection';
import TargetAudienceSection from './_components/TargetAudienceSection';
import Footer from './_components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-duru-ivory font-sans text-duru-text-main selection:bg-duru-orange-200">
      <Header />
      <HeroSection />
      <ServiceSection />
      <TargetAudienceSection />
      <Footer />
    </div>
  );
}
