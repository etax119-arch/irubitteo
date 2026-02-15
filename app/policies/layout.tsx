import Link from 'next/link';

export default function PoliciesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white px-6 py-10 shadow-sm sm:px-10">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">정책 안내</h1>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            랜딩으로 돌아가기
          </Link>
        </div>
        {children}
      </div>
    </main>
  );
}
