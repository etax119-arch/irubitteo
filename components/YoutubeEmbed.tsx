'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import {
  extractYoutubeId,
  getYoutubeEmbedUrl,
  getYoutubeThumbnail,
} from '@/lib/youtube';

interface YoutubeEmbedProps {
  url: string;
  title: string;
}

/**
 * 유튜브 파사드(facade) 임베드.
 * 처음에는 썸네일만 그리고, 클릭하면 그 자리에서 플레이어로 교체한다.
 */
export default function YoutubeEmbed({ url, title }: YoutubeEmbedProps) {
  const videoId = extractYoutubeId(url);
  const [playing, setPlaying] = useState(false);
  // maxresdefault가 없는 영상은 hqdefault로 폴백
  const [quality, setQuality] = useState<'max' | 'hq'>('max');

  if (!videoId) return null;

  if (playing) {
    return (
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-8">
        <iframe
          src={getYoutubeEmbedUrl(videoId)}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`${title} 영상 재생`}
      className="group relative block w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-8 focus:outline-none focus:ring-2 focus:ring-duru-orange-500 focus:ring-offset-2"
    >
      <Image
        src={getYoutubeThumbnail(videoId, quality)}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
        // maxresdefault는 없는 영상이 있어 preload(priority) 대상으로 부적절하다.
        // 404면 hqdefault로 폴백한다.
        onError={() => setQuality('hq')}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-black/60 group-hover:bg-duru-orange-600 transition-colors">
          <Play className="w-7 h-7 text-white fill-white translate-x-0.5" />
        </span>
      </span>
    </button>
  );
}
