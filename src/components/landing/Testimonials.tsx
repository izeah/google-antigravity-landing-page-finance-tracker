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
          className="mt-16 flex flex-col items-center gap-8"
        >
          <span className="text-gray-400 text-sm">Trusted by teams at</span>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {/* Tokopedia Logo */}
            <motion.div 
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6C11.163 6 4 13.163 4 22C4 30.837 11.163 38 20 38C28.837 38 36 30.837 36 22C36 13.163 28.837 6 20 6ZM20 12C16.568 12 13.522 13.647 11.542 16.18C11.196 16.632 11.285 17.276 11.74 17.618C12.195 17.96 12.838 17.867 13.18 17.412C14.776 15.38 17.228 14 20 14C25.523 14 30 18.477 30 24C30 29.523 25.523 34 20 34C14.477 34 10 29.523 10 24C10 23.447 9.553 23 9 23C8.447 23 8 23.447 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 17.373 26.627 12 20 12Z" fill="#03AC0E"/>
                <circle cx="20" cy="24" r="4" fill="#03AC0E"/>
                <text x="42" y="26" fill="#9CA3AF" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="600">Tokopedia</text>
              </svg>
            </motion.div>

            {/* Gojek Logo */}
            <motion.div 
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="14" fill="#00AA13"/>
                <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM20 26C16.686 26 14 23.314 14 20C14 16.686 16.686 14 20 14C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26Z" fill="white"/>
                <circle cx="20" cy="20" r="3" fill="white"/>
                <text x="40" y="25" fill="#9CA3AF" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="600">Gojek</text>
              </svg>
            </motion.div>

            {/* Bukalapak Logo */}
            <motion.div 
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <svg width="130" height="40" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 28V16C8 14.895 8.895 14 10 14H14C14 11.791 15.791 10 18 10H22C24.209 10 26 11.791 26 14H30C31.105 14 32 14.895 32 16V28C32 29.657 30.657 31 29 31H11C9.343 31 8 29.657 8 28Z" fill="#E31E52"/>
                <circle cx="14" cy="22" r="2.5" fill="white"/>
                <circle cx="26" cy="22" r="2.5" fill="white"/>
                <path d="M17 26H23C23 27.657 21.657 29 20 29C18.343 29 17 27.657 17 26Z" fill="white"/>
                <text x="40" y="25" fill="#9CA3AF" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="600">Bukalapak</text>
              </svg>
            </motion.div>

            {/* Traveloka Logo */}
            <motion.div 
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <svg width="130" height="40" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 20L20 8L34 20L20 32L6 20Z" fill="#0194F3"/>
                <path d="M20 14L12 20L20 26L28 20L20 14Z" fill="white"/>
                <circle cx="20" cy="20" r="3" fill="#0194F3"/>
                <text x="42" y="25" fill="#9CA3AF" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="600">Traveloka</text>
              </svg>
            </motion.div>

            {/* OVO Logo */}
            <motion.div 
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="14" cy="20" rx="10" ry="12" fill="#4C2A86"/>
                <ellipse cx="14" cy="20" rx="5" ry="6" fill="#0a0a0f"/>
                <path d="M28 8L38 32L48 8" stroke="#4C2A86" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                <ellipse cx="62" cy="20" rx="10" ry="12" fill="#4C2A86"/>
                <ellipse cx="62" cy="20" rx="5" ry="6" fill="#0a0a0f"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
