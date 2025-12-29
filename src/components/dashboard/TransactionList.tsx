'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Plus,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  Heart,
  GraduationCap,
  Minus,
} from 'lucide-react';
import { Transaction } from '@/lib/storage';
import { formatCurrency, formatDateShort } from '@/lib/utils';

const categoryIcons: Record<string, React.ElementType> = {
  salary: Briefcase,
  freelance: Laptop,
  investment: TrendingUp,
  gift: Gift,
  other_income: Plus,
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

const categoryNames: Record<string, string> = {
  salary: 'Gaji',
  freelance: 'Freelance',
  investment: 'Investasi',
  gift: 'Hadiah',
  other_income: 'Lainnya',
  food: 'Makanan',
  transport: 'Transportasi',
  shopping: 'Belanja',
  bills: 'Tagihan',
  entertainment: 'Hiburan',
  health: 'Kesehatan',
  education: 'Pendidikan',
  other_expense: 'Lainnya',
};

interface TransactionListProps {
  transactions: Transaction[];
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function TransactionList({
  transactions,
  maxItems,
  showViewAll = false,
  onViewAll,
}: TransactionListProps) {
  const displayTransactions = maxItems
    ? transactions.slice(0, maxItems)
    : transactions;

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Belum ada transaksi</h3>
        <p className="text-gray-400 text-sm">
          Mulai catat keuangan dengan menambah transaksi pertamamu
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaksi Terbaru</h3>
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-purple-400 hover:text-purple-300 font-medium"
          >
            Lihat Semua
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-800">
        {displayTransactions.map((transaction, index) => {
          const Icon = categoryIcons[transaction.category] || Minus;
          const colorClass = categoryColors[transaction.category] || 'bg-gray-500/20 text-gray-400';
          const categoryName = categoryNames[transaction.category] || transaction.category;

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{transaction.description}</p>
                <p className="text-sm text-gray-400">
                  {categoryName} • {formatDateShort(transaction.date)}
                </p>
              </div>
              <div className={`text-right shrink-0 ${
                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
              }`}>
                <p className="font-semibold">
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
