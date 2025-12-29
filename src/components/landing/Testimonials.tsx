'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Wijaya',
    role: 'Freelance Designer',
    avatar: '👩‍🎨',
    content: 'Akhirnya ada apps yang ngerti bahasa Indonesia! Tinggal ketik "beli kopi 25rb" langsung masuk. Super praktis!',
    rating: 5,
  },
  {
    name: 'Budi Santoso',
    role: 'Software Engineer',
    avatar: '👨‍💻',
    content: 'UI-nya clean banget dan fitur AI-nya beneran works. Sekarang jadi lebih aware sama spending habits.',
    rating: 5,
  },
  {
    name: 'Rina Kusuma',
    role: 'Small Business Owner',
    avatar: '👩‍💼',
    content: 'Sangat membantu untuk tracking pengeluaran bisnis. Laporannya lengkap dan mudah dipahami.',
    rating: 5,
  },
  {
    name: 'Ahmad Fauzi',
    role: 'Fresh Graduate',
    avatar: '👨‍🎓',
    content: 'Sebagai fresh grad, app ini membantu saya belajar mengelola keuangan dengan lebih baik.',
    rating: 5,
  },
  {
    name: 'Maya Putri',
    role: 'Content Creator',
    avatar: '👩‍🦰',
    content: 'Love the dark theme! Plus fitur reminder-nya bikin gak lupa bayar tagihan. Recommended!',
    rating: 5,
  },
  {
    name: 'David Halim',
    role: 'Financial Analyst',
    avatar: '👨‍💻',
    content: 'Chart dan reportingnya professional. Perfect untuk yang serius manage keuangan.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Kata <span className="gradient-text">Mereka</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Ribuan pengguna sudah merasakan manfaatnya
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setActiveIndex(index)}
              className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                activeIndex === index ? 'border-purple-500/50' : ''
              }`}
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-purple-500/30 mb-4" />

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.content}</p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50"
        >
          <span className="text-gray-400 text-sm">Trusted by teams at</span>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {['Tokopedia', 'Gojek', 'Bukalapak', 'Traveloka', 'OVO'].map((company) => (
              <span key={company} className="text-lg font-semibold text-gray-500">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
