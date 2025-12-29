'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getCurrentUser, logout, User } from '@/lib/auth';
import { LogoutDialog } from '@/components/ui/ConfirmDialog';
import { useSidebar } from '@/contexts/SidebarContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transaksi', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Laporan', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    router.push('/login');
  };

  // Generate sidebar content - forMobile param forces expanded view
  const getSidebarContent = (forMobile: boolean = false) => {
    // Use expanded view for mobile, respect isCollapsed for desktop
    const collapsed = forMobile ? false : isCollapsed;

    return (
      <>
        {/* Logo */}
        <div className={`p-4 border-b border-gray-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {collapsed ? (
            /* Collapsed: Logo with hover expand overlay */
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              onClick={() => setIsCollapsed(false)}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0 transition-all ${isLogoHovered ? 'opacity-30' : ''}`}>
                <span className="text-white font-bold text-xl">F</span>
              </div>
              {/* Expand overlay on hover */}
              <AnimatePresence>
                {isLogoHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Expanded: Normal logo with text */
            <>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2"
                onClick={() => forMobile && setIsMobileOpen(false)}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-xl font-bold">FinTrack</span>
              </Link>
              {/* Only show collapse button on desktop */}
              {!forMobile && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="w-10 h-10 items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer hidden lg:flex"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => forMobile && setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                data-tooltip={collapsed ? item.name : undefined}
                data-tooltip-position="right"
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-800">
          {user && !collapsed && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
                <span className="text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-sm text-gray-400 truncate">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogoutClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            data-tooltip={collapsed ? 'Keluar' : undefined}
            data-tooltip-position="right"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-card !rounded-none border-x-0 border-t-0 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-lg font-bold">FinTrack</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300 cursor-pointer"
          data-tooltip={isMobileOpen ? 'Tutup Menu' : 'Buka Menu'}
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay - Always expanded */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-[#0a0a0f] border-r border-gray-800 z-50 flex flex-col"
            >
              {/* Mobile always gets expanded content */}
              {getSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Uses collapse state */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-[#0a0a0f] border-r border-gray-800 z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Desktop uses actual collapse state */}
        {getSidebarContent(false)}
      </aside>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
