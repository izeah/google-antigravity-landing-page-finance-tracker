'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import * as XLSX from 'xlsx';
import { getCurrentUser } from '@/lib/auth';
import {
  getTransactionsByMonth,
  getTransactionsByYear,
  calculateTotals,
  getCategoryBreakdown,
  getMonthlyData,
  getTransactions,
} from '@/lib/storage';
import { formatCurrency, getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';

const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7'];

export default function ReportsPage() {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [expenseBreakdown, setExpenseBreakdown] = useState<{ category: string; amount: number; percentage: number }[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<{ category: string; amount: number; percentage: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expense: number }[]>([]);

  const loadData = useCallback(() => {
    const user = getCurrentUser();
    if (!user) return;

    const transactions =
      viewMode === 'monthly'
        ? getTransactionsByMonth(user.id, selectedYear, selectedMonth)
        : getTransactionsByYear(user.id, selectedYear);

    const calculatedTotals = calculateTotals(transactions);
    setTotals(calculatedTotals);

    const expenseData = getCategoryBreakdown(transactions, 'expense');
    const incomeData = getCategoryBreakdown(transactions, 'income');

    setExpenseBreakdown(expenseData);
    setIncomeBreakdown(incomeData);

    const monthlyChartData = getMonthlyData(user.id, selectedYear);
    setMonthlyData(monthlyChartData);
  }, [viewMode, selectedMonth, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCategoryName = (categoryId: string): string => {
    const allCategories = [...TRANSACTION_CATEGORIES.income, ...TRANSACTION_CATEGORIES.expense];
    const category = allCategories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const handleExport = () => {
    const user = getCurrentUser();
    if (!user) return;

    const transactions = getTransactions(user.id);
    
    // Get all categories for lookup
    const allCategories = [...TRANSACTION_CATEGORIES.income, ...TRANSACTION_CATEGORIES.expense];
    
    // Transform transactions to Excel-friendly format
    const excelData = transactions.map((transaction) => {
      const category = allCategories.find((c) => c.id === transaction.category);
      return {
        'Tanggal': new Date(transaction.date).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        'Deskripsi': transaction.description,
        'Kategori': category?.name || transaction.category,
        'Tipe': transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        'Jumlah': transaction.amount,
      };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 20 }, // Tanggal
      { wch: 40 }, // Deskripsi
      { wch: 20 }, // Kategori
      { wch: 15 }, // Tipe
      { wch: 20 }, // Jumlah
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi');

    // Generate filename with current date
    const filename = `fintrack-export-${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: getMonthName(i),
  }));

  const years = Array.from({ length: 5 }, (_, i) => getCurrentYear() - 2 + i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Laporan</h1>
          <p className="text-gray-400 mt-1">Analisis keuangan Anda</p>
        </div>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Download className="w-5 h-5" />
          Export Data
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                viewMode === 'monthly'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setViewMode('yearly')}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                viewMode === 'yearly'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
              }`}
            >
              Tahunan
            </button>
          </div>

          {/* Date Selectors */}
          <div className="flex gap-3 flex-1">
            {viewMode === 'monthly' && (
              <div className="relative flex-1">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="input-field input-with-icon appearance-none cursor-pointer"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="relative flex-1">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="input-field input-with-icon appearance-none cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-gray-400 text-sm">Total Pemasukan</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totals.income)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-gray-400 text-sm">Total Pengeluaran</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totals.expense)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 bg-gradient-to-br from-purple-500/10 to-cyan-500/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">Saldo</span>
          </div>
          <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(totals.balance)}
          </p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Perbandingan Bulanan {selectedYear}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${value / 1000000}jt`;
                    if (value >= 1000) return `${value / 1000}rb`;
                    return value;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid #2a2a35',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  formatter={(value, name) => [
                    formatCurrency(value as number),
                    name === 'income' ? 'Pemasukan' : 'Pengeluaran',
                  ]}
                />
                <Legend
                  formatter={(value) => (value === 'income' ? 'Pemasukan' : 'Pengeluaran')}
                />
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Breakdown Pengeluaran</h3>
          {expenseBreakdown.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Tidak ada data pengeluaran
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-[200px] h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="amount"
                      nameKey="category"
                    >
                      {expenseBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121a',
                        border: '1px solid #2a2a35',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                      itemStyle={{ color: '#f0f0f5' }}
                      formatter={(value, name) => [
                        formatCurrency(value as number),
                        getCategoryName(name as string)
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {expenseBreakdown.slice(0, 5).map((item, index) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="flex-1 text-sm truncate">{getCategoryName(item.category)}</span>
                    <span className="text-sm text-gray-400">{item.percentage.toFixed(1)}%</span>
                    <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Income Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-6">Breakdown Pemasukan</h3>
        {incomeBreakdown.length === 0 ? (
          <div className="py-12 text-center text-gray-400">Tidak ada data pemasukan</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {incomeBreakdown.map((item, index) => (
              <div
                key={item.category}
                className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-400">{getCategoryName(item.category)}</span>
                </div>
                <p className="text-xl font-bold text-green-400">{formatCurrency(item.amount)}</p>
                <p className="text-sm text-gray-400 mt-1">{item.percentage.toFixed(1)}% dari total</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
