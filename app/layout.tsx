import type { Metadata, Viewport } from "next";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { ToastContainer } from "@/components/ui/Toast";
import GoogleAnalytics from "./_components/GoogleAnalytics";
import NaverAnalytics from "./_components/NaverAnalytics";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: '#F97316',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.irubitteo.com'),
  title: {
    default: '이루빛터 - 장애인 근로자와 기업이 함께 빛나는 일터',
    template: '%s | 이루빛터',
  },
  description: '장애인 근로자와 기업을 위한, 일자리 매칭, 장애인 표준사업장, 장애인 고용부담금, 인증대행',
  keywords: ['이루빛터', 'irubitteo', '장애인 근로자', '장애인 고용', '출퇴근 관리', '무상지원금', '세액감면', '인증대행', '장애인 표준사업장'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '이루빛터',
    title: '이루빛터 - 장애인 근로자와 기업이 함께 빛나는 일터',
    description: '장애인 근로자와 기업을 위한, 일자리 매칭, 장애인 표준사업장, 장애인 고용부담금, 인증대행',
  },
  twitter: {
    card: 'summary_large_image',
    title: '이루빛터 - 장애인 근로자와 기업이 함께 빛나는 일터',
    description: '장애인 근로자와 기업을 위한, 일자리 매칭, 장애인 표준사업장, 장애인 고용부담금, 인증대행',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
        <ToastContainer />
        <GoogleAnalytics />
        <NaverAnalytics />
      </body>
    </html>
  );
}
