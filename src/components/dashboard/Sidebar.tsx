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

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`p-4 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {isCollapsed ? (
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
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold"
              >
                FinTrack
              </motion.span>
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
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
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              data-tooltip={isCollapsed ? item.name : undefined}
              data-tooltip-position="right"
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-800">
        {user && !isCollapsed && (
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
            isCollapsed ? 'justify-center' : ''
          }`}
          data-tooltip={isCollapsed ? 'Keluar' : undefined}
          data-tooltip-position="right"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium">Keluar</span>}
        </button>
      </div>
    </>
  );

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
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
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
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-[#0a0a0f] border-r border-gray-800 z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
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
