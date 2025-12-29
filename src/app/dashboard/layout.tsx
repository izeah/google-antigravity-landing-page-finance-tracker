'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { getCurrentUser } from '@/lib/auth';
import { initializeSampleData } from '@/lib/storage';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={`pt-16 lg:pt-0 min-h-screen transition-all duration-300 ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}
    >
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </main>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else {
      // Initialize sample data for demo
      initializeSampleData(user.id);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 animate-pulse" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Sidebar />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
}
