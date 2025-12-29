'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Sample demo data for the charts
const monthlyData = [
  { month: 'Jan', income: 15000000, expense: 8500000 },
  { month: 'Feb', income: 14500000, expense: 9200000 },
  { month: 'Mar', income: 16000000, expense: 7800000 },
  { month: 'Apr', income: 15500000, expense: 8100000 },
  { month: 'Mei', income: 17000000, expense: 9500000 },
  { month: 'Jun', income: 16500000, expense: 8800000 },
];

const expenseBreakdown = [
  { name: 'Makanan', value: 2500000, color: '#f97316' },
  { name: 'Transport', value: 1500000, color: '#eab308' },
  { name: 'Belanja', value: 2000000, color: '#ec4899' },
  { name: 'Tagihan', value: 3000000, color: '#8b5cf6' },
  { name: 'Hiburan', value: 1000000, color: '#06b6d4' },
  { name: 'Lainnya', value: 800000, color: '#6b7280' },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
  return value.toString();
};

export default function DemoChart() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Visualisasi <span className="gradient-text">Data Keuangan</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Lihat gambaran keuanganmu dengan grafik yang jelas dan mudah dipahami
          </p>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart - Monthly Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Perbandingan Bulanan</h3>
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
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid #2a2a35',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                    formatter={(value) => [formatCurrency(value as number), '']}
                    labelStyle={{ color: '#f0f0f5' }}
                  />
                  <Legend
                    formatter={(value) => (value === 'income' ? 'Pemasukan' : 'Pengeluaran')}
                  />
                  <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="income" />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart - Expense Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Breakdown Pengeluaran</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
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
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121a',
                        border: '1px solid #2a2a35',
                        borderRadius: '12px',
                      }}
                      formatter={(value) => [formatCurrency(value as number), '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {expenseBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1 text-sm">{item.name}</span>
                    <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">Rp 94.5jt</div>
            <div className="text-sm text-gray-400">Total Pemasukan 6 Bulan</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">Rp 51.9jt</div>
            <div className="text-sm text-gray-400">Total Pengeluaran 6 Bulan</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">Rp 42.6jt</div>
            <div className="text-sm text-gray-400">Total Tabungan</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
