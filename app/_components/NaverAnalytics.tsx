import Script from 'next/script';

const NAVER_ID = process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID;

export default function NaverAnalytics() {
  if (!NAVER_ID) return null;

  return (
    <>
      <Script
        src="https://wcs.naver.net/wcslog.js"
        strategy="afterInteractive"
      />
      <Script id="naver-analytics" strategy="afterInteractive">
        {`
          if (!window.wcs_add) window.wcs_add = {};
          window.wcs_add["wa"] = "${NAVER_ID}";
          if (window.wcs) wcs_do();
        `}
      </Script>
    </>
  );
}
