'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const subTabs = [
  { id: 'newsletter', label: '소식지', href: '/admin/content/newsletter' },
  { id: 'gallery', label: '갤러리', href: '/admin/content/gallery' },
];

export default function AdminContentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeSubTab = pathname.includes('/gallery') ? 'gallery' : 'newsletter';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">콘텐츠 관리</h2>
      </div>

      {/* Sub-tab navigation */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {subTabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeSubTab === tab.id
                  ? 'border-duru-orange-500 text-duru-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
