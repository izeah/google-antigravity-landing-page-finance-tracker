'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Trash2 } from 'lucide-react';
import TransactionForm from '@/components/dashboard/TransactionForm';
import { getCurrentUser } from '@/lib/auth';
import { getTransactions, deleteTransaction, Transaction } from '@/lib/storage';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Plus as PlusIcon,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  Heart,
  GraduationCap,
  Minus,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  salary: Briefcase,
  freelance: Laptop,
  investment: TrendingUp,
  gift: Gift,
  other_income: PlusIcon,
  food: UtensilsCrossed,
  transport: Car,
  shopping: ShoppingBag,
  bills: Receipt,
  entertainment: Gamepad2,
  health: Heart,
  education: GraduationCap,
  other_expense: Minus,
};

const categoryColors: Record<string, string> = {
  salary: 'bg-green-500/20 text-green-400',
  freelance: 'bg-emerald-500/20 text-emerald-400',
  investment: 'bg-teal-500/20 text-teal-400',
  gift: 'bg-cyan-500/20 text-cyan-400',
  other_income: 'bg-blue-500/20 text-blue-400',
  food: 'bg-orange-500/20 text-orange-400',
  transport: 'bg-yellow-500/20 text-yellow-400',
  shopping: 'bg-pink-500/20 text-pink-400',
  bills: 'bg-purple-500/20 text-purple-400',
  entertainment: 'bg-violet-500/20 text-violet-400',
  health: 'bg-red-500/20 text-red-400',
  education: 'bg-blue-500/20 text-blue-400',
  other_expense: 'bg-gray-500/20 text-gray-400',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const loadData = useCallback(() => {
    const user = getCurrentUser();
    if (!user) return;

    const allTransactions = getTransactions(user.id);
    setTransactions(allTransactions);
    setFilteredTransactions(allTransactions);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let result = transactions;

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(result);
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      deleteTransaction(id);
      loadData();
    }
  };

  const allCategories = [
    ...TRANSACTION_CATEGORIES.income,
    ...TRANSACTION_CATEGORIES.expense,
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Transaksi</h1>
          <p className="text-gray-400 mt-1">Kelola semua transaksi keuangan Anda</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Tambah Transaksi
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field input-with-icon"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {(['all', 'income', 'expense'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                  typeFilter === type
                    ? type === 'income'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : type === 'expense'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
                }`}
              >
                {type === 'all' ? 'Semua' : type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field input-with-icon pr-10 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">Semua Kategori</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tidak ada transaksi</h3>
            <p className="text-gray-400 text-sm">
              {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
                ? 'Tidak ada transaksi yang sesuai dengan filter'
                : 'Mulai catat keuangan dengan menambah transaksi pertamamu'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Transaksi</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400 hidden sm:table-cell">Kategori</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400 hidden md:table-cell">Tanggal</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Jumlah</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTransactions.map((transaction, index) => {
                  const Icon = categoryIcons[transaction.category] || Minus;
                  const colorClass = categoryColors[transaction.category] || 'bg-gray-500/20 text-gray-400';
                  const categoryInfo = allCategories.find((c) => c.id === transaction.category);

                  return (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-white/[0.02]"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{transaction.description}</p>
                            <p className="text-sm text-gray-400 sm:hidden">
                              {categoryInfo?.name || transaction.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className={`px-3 py-1 rounded-lg text-sm ${colorClass}`}>
                          {categoryInfo?.name || transaction.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 hidden md:table-cell">
                        {formatDate(transaction.date)}
                      </td>
                      <td className={`p-4 text-right font-semibold ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Summary Footer */}
      {filteredTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-400">
            Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
          </p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-400">Total Pemasukan: </span>
              <span className="text-green-400 font-semibold">
                {formatCurrency(
                  filteredTransactions
                    .filter((t) => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Total Pengeluaran: </span>
              <span className="text-red-400 font-semibold">
                {formatCurrency(
                  filteredTransactions
                    .filter((t) => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
