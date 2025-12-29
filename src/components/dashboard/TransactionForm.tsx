'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Tag, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';
import { saveTransaction } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransactionForm({ isOpen, onClose, onSuccess }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = type === 'income'
    ? TRANSACTION_CATEGORIES.income
    : TRANSACTION_CATEGORIES.expense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = getCurrentUser();
    if (!user) return;

    // Parse amount (handle Indonesian format)
    let parsedAmount = amount.replace(/\./g, '').replace(/,/g, '.');
    parsedAmount = parsedAmount.replace(/[^0-9.]/g, '');

    saveTransaction({
      type,
      amount: parseFloat(parsedAmount),
      category: category || (type === 'income' ? 'other_income' : 'other_expense'),
      description: description || `Transaksi ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`,
      date,
      userId: user.id,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsSubmitting(false);
    
    onSuccess();
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-50 glass-card overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-semibold">Tambah Transaksi</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Type Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setType('income'); setCategory(''); }}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    type === 'income'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => { setType('expense'); setCategory(''); }}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    type === 'expense'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
                  }`}
                >
                  <TrendingDown className="w-5 h-5" />
                  Pengeluaran
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Jumlah</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="100.000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field input-with-icon"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field input-with-icon appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contoh: Makan siang"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field input-with-icon"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Tanggal</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field input-with-icon date-input"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
