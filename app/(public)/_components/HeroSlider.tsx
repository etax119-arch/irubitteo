'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const heroImages = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
];

export default function HeroSlider() {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-[4/3]">
      {heroImages.map((image, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            idx === currentImageIdx ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`히어로 이미지 ${idx + 1}`}
            fill
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIdx(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentImageIdx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
