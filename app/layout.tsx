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
  description: '가능성이 일상의 빛이 되는 곳, 이루빛터에서는 장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여 빛나는 내일을 함께 합니다.',
  keywords: ['이루빛터', 'irubitteo', '장애인 근로자', '장애인 고용', '출퇴근 관리', '무상지원금', '세액감면', '인증대행', '장애인 표준사업장'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: '이루빛터',
    title: '이루빛터 - 장애인 근로자와 기업이 함께 빛나는 일터',
    description: '가능성이 일상의 빛이 되는 곳, 이루빛터에서는 장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여 빛나는 내일을 함께 합니다.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '이루빛터 - 장애인 근로자와 기업이 함께 빛나는 일터',
    description: '가능성이 일상의 빛이 되는 곳, 이루빛터에서는 장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여 빛나는 내일을 함께 합니다.',
  },
  verification: {
    other: {
      'naver-site-verification': 'naver51f03e302574f43f4eed8aeed5fed413',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="이루빛터 RSS"
          href="https://www.irubitteo.com/rss.xml"
        />
      </head>
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
