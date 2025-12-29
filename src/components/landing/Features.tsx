'use client';

import { motion } from 'framer-motion';
import { Wallet, Zap, Shield, BarChart3, Bot, Bell } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Input dengan AI',
    description: 'Cukup ketik "Makan siang 50rb" dan AI akan otomatis mengkategorikan transaksi.',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    icon: BarChart3,
    title: 'Laporan Visual',
    description: 'Lihat grafik pengeluaran dan pemasukan dengan visualisasi yang mudah dipahami.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Wallet,
    title: 'Multi Kategori',
    description: 'Kelola berbagai kategori seperti makanan, transportasi, hiburan, dan lainnya.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Zap,
    title: 'Realtime Sync',
    description: 'Data tersimpan langsung dan bisa diakses kapan saja dari perangkat manapun.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Data Aman',
    description: 'Privasi data terjamin dengan enkripsi dan tidak akan dibagikan ke pihak ketiga.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Bell,
    title: 'Reminder Cerdas',
    description: 'Dapatkan pengingat untuk tagihan bulanan dan target keuangan Anda.',
    gradient: 'from-indigo-500 to-purple-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Fitur <span className="gradient-text">Unggulan</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Semua yang kamu butuhkan untuk mengelola keuangan dalam satu aplikasi
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-6 sm:p-8 group cursor-pointer transition-all duration-300 hover:border-purple-500/50"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
