import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Header from './_components/Header';
import HeroSection from './_components/HeroSection';
import ServiceSection from './_components/ServiceSection';
import ManagementSystemSection from './_components/ManagementSystemSection';
import ConsultingProcessSection from './_components/ConsultingProcessSection';
import RecommendedJobsSection from './_components/RecommendedJobsSection';
import TargetAudienceSection from './_components/TargetAudienceSection';
import Footer from './_components/Footer';
import StructuredData from './_components/StructuredData';
import { serverFetch } from '@/lib/api/server-fetch';
import type { GalleryItem } from '@/types/gallery';
import type { PaginatedResponse } from '@/types/api';

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

export default async function LandingPage() {
  let galleryItems: GalleryItem[] = [];
  try {
    const result = await serverFetch<PaginatedResponse<GalleryItem>>('/galleries?page=1&limit=10');
    galleryItems = result.data;
  } catch {
    // 갤러리 로드 실패 시 캐러셀은 렌더링되지 않음
  }

  return (
    <div className={`min-h-screen bg-duru-ivory text-duru-text-main selection:bg-landing-orange selection:text-white ${notoSansKR.className}`} style={{ fontWeight: 500 }}>
      <StructuredData data={organizationData} />
      <StructuredData data={websiteData} />
      <Header />
      <HeroSection />
      <ServiceSection galleryItems={galleryItems} />
      <ManagementSystemSection />
      <RecommendedJobsSection />
      <ConsultingProcessSection />
      {/* <TargetAudienceSection /> */}
      <Footer />
    </div>
  );
}
