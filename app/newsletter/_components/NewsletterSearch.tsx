'use client';

import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface NewsletterSearchProps {
  onSearch: (term: string) => void;
}

export default function NewsletterSearch({ onSearch }: NewsletterSearchProps) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(next.trim()), 300);
  };

  const handleClear = () => {
    setValue('');
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch('');
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="소식지 검색..."
          className="w-full pl-11 pr-10 py-3 text-base border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-duru-orange-400 focus:border-duru-orange-400 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="검색어 지우기"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
