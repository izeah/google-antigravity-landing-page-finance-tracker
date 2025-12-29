'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-purple w-[500px] h-[500px] -top-40 -left-40 animate-pulse-glow" />
      <div className="bg-orb bg-orb-cyan w-[400px] h-[400px] top-1/2 -right-40 animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="bg-orb bg-orb-pink w-[300px] h-[300px] bottom-20 left-1/4 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="badge-text text-gray-300">Powered by AI</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          Kelola Keuanganmu{' '}
          <span className="hero-gradient-text">Lebih Cerdas</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-subtitle text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Track pengeluaran dan pemasukan dengan mudah menggunakan AI. 
          Cukup ketik seperti &quot;Beli kopi 25rb&quot; dan biarkan AI yang mengurus sisanya.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup" className="btn-primary flex items-center gap-2 text-lg">
            Mulai Gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="btn-secondary flex items-center gap-2 text-lg">
            Sudah Punya Akun
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '10K+', label: 'Pengguna Aktif' },
            { value: 'Rp 50M+', label: 'Transaksi Tercatat' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.9★', label: 'Rating' },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-4 sm:p-6">
              <div className="stats-number text-2xl sm:text-3xl">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-10 hidden lg:block"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <span className="text-2xl">💰</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/3 right-20 hidden lg:block"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <span className="text-3xl">📊</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/3 left-20 hidden lg:block"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <span className="text-xl">🎯</span>
        </div>
      </motion.div>
    </section>
  );
}
