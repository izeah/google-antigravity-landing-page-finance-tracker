'use client';

import { motion } from 'framer-motion';
import { UserPlus, MessageSquare, PieChart } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Buat Akun',
    description: 'Daftar gratis dalam hitungan detik. Tidak perlu kartu kredit atau pembayaran apapun.',
    color: 'purple',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Input Transaksi',
    description: 'Ketik transaksi dengan bahasa natural atau gunakan form. AI akan mengkategorikan otomatis.',
    color: 'cyan',
  },
  {
    number: '03',
    icon: PieChart,
    title: 'Lihat Laporan',
    description: 'Dapatkan insight dari laporan visual tentang kebiasaan finansial Anda.',
    color: 'pink',
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  pink: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Cara <span className="gradient-text">Kerjanya</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Tiga langkah mudah untuk mulai mengelola keuanganmu
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/50 via-cyan-500/50 to-pink-500/50 hidden lg:block" style={{ transform: 'translateY(-50%)' }} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Card */}
                <div className={`glass-card p-6 sm:p-8 relative border ${colorClasses[step.color].border}`}>
                  {/* Number Badge */}
                  <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl ${colorClasses[step.color].bg} ${colorClasses[step.color].text} flex items-center justify-center font-bold text-lg border ${colorClasses[step.color].border}`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${colorClasses[step.color].bg} flex items-center justify-center mb-6 mt-4`}>
                    <step.icon className={`w-8 h-8 ${colorClasses[step.color].text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-6 lg:hidden">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
