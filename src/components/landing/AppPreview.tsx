'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Image from 'next/image';

const appScreens = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Lihat ringkasan keuanganmu dalam satu tampilan',
    image: '/images/app-dashboard.png',
  },
  {
    id: 'transactions',
    title: 'Transaksi',
    description: 'Kelola semua transaksi dengan mudah',
    image: '/images/app-transactions.png',
  },
  {
    id: 'reports',
    title: 'Laporan',
    description: 'Analisis keuangan dengan grafik visual',
    image: '/images/app-reports.png',
  },
];

export default function AppPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % appScreens.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + appScreens.length) % appScreens.length);
  };

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Lihat <span className="gradient-text">Tampilan Aplikasi</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Desain modern dan intuitif untuk pengalaman terbaik
          </p>
        </motion.div>

        {/* Main Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          {/* Main Preview Card */}
          <div className="glass-card p-4 sm:p-6">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={appScreens[activeIndex].image}
                    alt={appScreens[activeIndex].title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {appScreens[activeIndex].title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {appScreens[activeIndex].description}
                </p>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {appScreens.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  index === activeIndex
                    ? 'w-8 bg-purple-500'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Floating Decorations */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-10 -left-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent blur-xl hidden lg:block"
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-transparent blur-xl hidden lg:block"
          />
        </motion.div>

        {/* Thumbnail Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {appScreens.map((screen, index) => (
            <button
              key={screen.id}
              onClick={() => setActiveIndex(index)}
              className={`glass-card p-3 transition-all cursor-pointer ${
                index === activeIndex
                  ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0a0a0f]'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                <Image
                  src={screen.image}
                  alt={screen.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-center">{screen.title}</p>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={appScreens[activeIndex].image}
                alt={appScreens[activeIndex].title}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
