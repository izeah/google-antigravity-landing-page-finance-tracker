'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import DemoChart from '@/components/landing/DemoChart';
import VideoShowcase from '@/components/landing/VideoShowcase';
import AppPreview from '@/components/landing/AppPreview';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

const ParticleBackground = dynamic(() => import('@/components/ui/ParticleBackground'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <Features />
      <DemoChart />
      <AppPreview />
      <VideoShowcase />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
