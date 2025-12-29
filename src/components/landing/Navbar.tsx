'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { getCurrentUser, logout, User } from '@/lib/auth';
import { LogoutDialog } from '@/components/ui/ConfirmDialog';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Testimonials', href: '#testimonials' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLogoutOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-800/50' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">FinTrack</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop CTA - Conditional based on login state */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                /* Logged In State */
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl glass-card group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-sm max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <button
                      onClick={() => setIsLogoutOpen(true)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      data-tooltip="Logout"
                      data-tooltip-position="bottom"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest State */
                <>
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link href="/signup" className="btn-primary !py-2 !px-5 text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 glass-card !rounded-t-none border-t-0 border-x-0 md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-gray-700" />
              
              {user ? (
                /* Mobile Logged In State */
                <div className="space-y-3 pt-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50">
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
                  
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary text-center flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Go to Dashboard
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLogoutOpen(true);
                    }}
                    className="btn-secondary text-center w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                /* Mobile Guest State */
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-secondary text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
