'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Trash2, Download, AlertTriangle, Check } from 'lucide-react';
import { getCurrentUser, User as UserType } from '@/lib/auth';
import { getTransactions } from '@/lib/storage';

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleExport = () => {
    if (!user) return;

    const transactions = getTransactions(user.id);
    const exportData = {
      user: { name: user.name, email: user.email },
      transactions,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: 'Data berhasil di-export!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearData = () => {
    if (!user) return;

    // Clear transactions for current user
    const allTransactions = JSON.parse(localStorage.getItem('fintrack_transactions') || '[]');
    const filteredTransactions = allTransactions.filter((t: { userId: string }) => t.userId !== user.id);
    localStorage.setItem('fintrack_transactions', JSON.stringify(filteredTransactions));

    setShowClearConfirm(false);
    setMessage({ type: 'success', text: 'Semua data transaksi berhasil dihapus!' });
    setTimeout(() => setMessage(null), 3000);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Pengaturan</h1>
        <p className="text-gray-400 mt-1">Kelola akun dan preferensi Anda</p>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          <Check className="w-5 h-5" />
          <span>{message.text}</span>
        </motion.div>
      )}

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-6">Profil</h2>
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nama</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="input-field input-with-icon opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-field input-with-icon opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-6">Manajemen Data</h2>
        <div className="space-y-4">
          {/* Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-800/50">
            <div>
              <h3 className="font-medium">Export Data</h3>
              <p className="text-sm text-gray-400">Download semua data transaksi dalam format JSON</p>
            </div>
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>

          {/* Clear Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div>
              <h3 className="font-medium text-red-400">Hapus Semua Data</h3>
              <p className="text-sm text-gray-400">Hapus semua data transaksi. Aksi ini tidak dapat dibatalkan.</p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium w-full sm:w-auto justify-center"
            >
              <Trash2 className="w-5 h-5" />
              Hapus
            </button>
          </div>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Tentang Aplikasi</h2>
        <div className="space-y-2 text-gray-400 text-sm">
          <p><strong className="text-white">FinTrack</strong> - Personal Finance Tracker</p>
          <p>Version 1.0.0</p>
          <p>Built with Next.js, Tailwind CSS, and Framer Motion</p>
          <p className="pt-2">© 2024 FinTrack. All rights reserved.</p>
        </div>
      </motion.div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowClearConfirm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 glass-card p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Hapus Semua Data?</h3>
                <p className="text-sm text-gray-400">Aksi ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Semua data transaksi Anda akan dihapus secara permanen. Pastikan Anda sudah meng-export data jika diperlukan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
              >
                Ya, Hapus
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
