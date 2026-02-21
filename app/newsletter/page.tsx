import Header from '@/app/_components/Header';
import Footer from '@/app/_components/Footer';

export default function NewsletterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">빛터 소식지</h1>
          <p className="text-xl text-gray-600">준비 중입니다.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
