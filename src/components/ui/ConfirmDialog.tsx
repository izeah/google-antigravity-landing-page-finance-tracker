'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogOut, Trash2, X, HelpCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type ConfirmDialogType = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  icon?: LucideIcon;
}

const typeStyles: Record<ConfirmDialogType, { iconBg: string; iconColor: string; buttonBg: string; buttonHover: string }> = {
  danger: {
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    buttonBg: 'bg-red-500',
    buttonHover: 'hover:bg-red-600',
  },
  warning: {
    iconBg: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400',
    buttonBg: 'bg-yellow-500',
    buttonHover: 'hover:bg-yellow-600',
  },
  info: {
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    buttonBg: 'bg-blue-500',
    buttonHover: 'hover:bg-blue-600',
  },
};

const defaultIcons: Record<ConfirmDialogType, LucideIcon> = {
  danger: Trash2,
  warning: AlertTriangle,
  info: HelpCircle,
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  type = 'warning',
  icon,
}: ConfirmDialogProps) {
  const styles = typeStyles[type];
  const Icon = icon || defaultIcons[type];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-[100]"
          >
            <div className="glass-card p-6 mx-4 relative overflow-hidden">
              {/* Glow Effect */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${styles.iconBg} blur-3xl opacity-50`} />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${styles.iconBg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${styles.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>

                {/* Message */}
                <p className="text-gray-400 text-center text-sm leading-relaxed mb-6">
                  {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 px-4 py-3 rounded-xl text-white transition-colors font-medium ${styles.buttonBg} ${styles.buttonHover}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Specialized dialogs for common use cases
export function LogoutDialog({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Keluar dari Akun?"
      message="Anda akan keluar dari sesi ini. Pastikan semua data sudah tersimpan sebelum keluar."
      confirmText="Ya, Keluar"
      cancelText="Batal"
      type="warning"
      icon={LogOut}
    />
  );
}

export function DeleteTransactionDialog({
  isOpen,
  onClose,
  onConfirm,
  transactionName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transactionName?: string;
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Transaksi?"
      message={`Transaksi${transactionName ? ` "${transactionName}"` : ''} akan dihapus secara permanen dan tidak dapat dikembalikan.`}
      confirmText="Ya, Hapus"
      cancelText="Batal"
      type="danger"
      icon={Trash2}
    />
  );
}
