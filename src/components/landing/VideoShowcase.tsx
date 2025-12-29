'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Play, X, Maximize2, GripHorizontal } from 'lucide-react';

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const sectionRef = useRef<HTMLElement>(null);
  const miniPlayerRef = useRef<HTMLDivElement>(null);

  // YouTube video ID
  const videoId = 'HQzoZfc3GwQ';

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleCloseMiniPlayer = useCallback(() => {
    setIsPlaying(false);
    setIsMiniPlayer(false);
  }, []);

  const handleRestorePlayer = useCallback(() => {
    setIsMiniPlayer(false);
    // Scroll to the section
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // Detect when section is out of viewport
  useEffect(() => {
    if (!isPlaying) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // If less than 10% of section is visible and video is playing, show mini player
        if (entry.intersectionRatio < 0.1 && isPlaying) {
          setIsMiniPlayer(true);
        } else if (entry.intersectionRatio > 0.3) {
          setIsMiniPlayer(false);
        }
      },
      {
        threshold: [0, 0.1, 0.3, 0.5],
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isPlaying]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = miniPlayerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }
  }, []);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const miniPlayer = miniPlayerRef.current;
      if (!miniPlayer) return;

      const maxX = window.innerWidth - miniPlayer.offsetWidth;
      const maxY = window.innerHeight - miniPlayer.offsetHeight;

      setMiniPlayerPosition({
        x: Math.max(0, Math.min(maxX, clientX - dragOffset.x)),
        y: Math.max(0, Math.min(maxY, clientY - dragOffset.y)),
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  // Reset mini player position when window resizes
  useEffect(() => {
    const handleResize = () => {
      setMiniPlayerPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 320),
        y: Math.min(prev.y, window.innerHeight - 180),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <section 
        ref={sectionRef}
        className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
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
              ) : !isMiniPlayer ? (
                /* Embedded YouTube Video - shown when not in mini player mode */
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="FinTrack Tutorial Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                /* Placeholder when mini player is active */
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Play className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Video sedang diputar di mini player</p>
                  <button
                    onClick={handleRestorePlayer}
                    className="mt-3 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm"
                  >
                    Kembali ke sini
                  </button>
                </div>
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
        </div>
      </section>

      {/* Mini Player - Fixed Position */}
      {isPlaying && isMiniPlayer && (
        <div
          ref={miniPlayerRef}
          style={{
            left: miniPlayerPosition.x,
            top: miniPlayerPosition.y,
          }}
          className={`fixed z-50 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-700/50 transition-shadow ${
            isDragging ? 'shadow-purple-500/20' : ''
          }`}
        >
          {/* Drag Handle */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-center cursor-move"
          >
            <GripHorizontal className="w-5 h-5 text-gray-400" />
          </div>

          {/* Control Buttons */}
          <div className="absolute top-1 right-1 z-20 flex gap-1">
            <button
              onClick={handleRestorePlayer}
              className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              title="Kembali ke video utama"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCloseMiniPlayer}
              className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              title="Tutup video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mini Player Video */}
          <div className="w-80 aspect-video bg-gray-900">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="FinTrack Tutorial Video (Mini Player)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
