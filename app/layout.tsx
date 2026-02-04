import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "두루빛터 - 장애인 근로자와 기업이 함께 빛나는 일터",
  description: "장애인 근로자를 위한 맞춤형 일자리 매칭부터 편리한 출퇴근 관리까지, 든든한 다리가 되어드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
