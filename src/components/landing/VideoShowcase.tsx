'use client';

import { useState, useCallback } from 'react';
import { Play, ExternalLink } from 'lucide-react';

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube video ID
  const videoId = 'HQzoZfc3GwQ';

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background - simplified */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header - no animation */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Pelajari <span className="gradient-text">Cara Penggunaan</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Lihat bagaimana FinTrack dapat membantu mengatur keuanganmu dengan mudah
          </p>
        </div>

        {/* Video Container - lightweight */}
        <div className="glass-card p-3 sm:p-4">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
            {!isPlaying ? (
              /* Thumbnail with Play Button - using lite approach */
              <button
                onClick={handlePlay}
                className="absolute inset-0 w-full h-full cursor-pointer group"
                aria-label="Play video"
              >
                {/* Thumbnail - using smaller resolution for faster load */}
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                {/* Play Button - simple CSS animation instead of Framer */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 transform group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/70 text-sm text-white">
                  5:32
                </div>
              </button>
            ) : (
              /* Embedded YouTube Video with loading="lazy" */
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="FinTrack Tutorial Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </div>

        {/* Video Features - static, no animations */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h4 className="font-semibold">Input Transaksi</h4>
              <p className="text-sm text-gray-400">Catat pengeluaran dengan mudah</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h4 className="font-semibold">Analisis Data</h4>
              <p className="text-sm text-gray-400">Lihat laporan keuangan visual</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h4 className="font-semibold">Tips Keuangan</h4>
              <p className="text-sm text-gray-400">Dapatkan insight bermanfaat</p>
            </div>
          </div>
        </div>

        {/* CTA Link */}
        <div className="mt-8 text-center">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            Tonton di YouTube
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
