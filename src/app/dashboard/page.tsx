'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import TransactionChart from '@/components/dashboard/TransactionChart';
import TransactionList from '@/components/dashboard/TransactionList';
import TransactionForm from '@/components/dashboard/TransactionForm';
import AITextInput from '@/components/dashboard/AITextInput';
import { getCurrentUser } from '@/lib/auth';
import {
  getTransactions,
  getTransactionsByMonth,
  calculateTotals,
  getMonthlyData,
  Transaction,
} from '@/lib/storage';
import { getCurrentMonth, getCurrentYear, calculatePercentageChange, getMonthName } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expense: number }[]>([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [previousTotals, setPreviousTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadData = useCallback(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const currentMonth = getCurrentMonth();
    const currentYear = getCurrentYear();

    // Get all transactions
    const allTransactions = getTransactions(user.id);
    setTransactions(allTransactions);

    // Get current month totals
    const currentMonthTransactions = getTransactionsByMonth(user.id, currentYear, currentMonth);
    const currentTotals = calculateTotals(currentMonthTransactions);
    setTotals(currentTotals);

    // Get previous month totals for comparison
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthTransactions = getTransactionsByMonth(user.id, prevYear, prevMonth);
    const prevTotals = calculateTotals(prevMonthTransactions);
    setPreviousTotals(prevTotals);

    // Get monthly chart data
    const monthlyChartData = getMonthlyData(user.id, currentYear);
    setMonthlyData(monthlyChartData);
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const trends = {
    income: calculatePercentageChange(totals.income, previousTotals.income),
    expense: calculatePercentageChange(totals.expense, previousTotals.expense),
    balance: calculatePercentageChange(totals.balance, previousTotals.balance),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Ringkasan keuangan {getMonthName(getCurrentMonth())} {getCurrentYear()}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Tambah Transaksi
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard
          title="Total Pemasukan"
          value={totals.income}
          trend={trends.income}
          icon={TrendingUp}
          type="income"
          delay={0}
        />
        <StatsCard
          title="Total Pengeluaran"
          value={totals.expense}
          trend={trends.expense}
          icon={TrendingDown}
          type="expense"
          delay={0.1}
        />
        <StatsCard
          title="Saldo"
          value={totals.balance}
          trend={trends.balance}
          icon={Wallet}
          type="default"
          delay={0.2}
        />
      </div>

      {/* AI Input */}
      <AITextInput onSuccess={loadData} />

      {/* Chart and Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TransactionChart data={monthlyData} />
        <TransactionList
          transactions={transactions}
          maxItems={5}
          showViewAll
          onViewAll={() => router.push('/dashboard/transactions')}
        />
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
