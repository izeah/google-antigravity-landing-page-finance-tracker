'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface TransactionChartProps {
  data: { month: string; income: number; expense: number }[];
}

export default function TransactionChart({ data }: TransactionChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      incomeDisplay: item.income,
      expenseDisplay: item.expense,
    }));
  }, [data]);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6">Grafik Keuangan</h3>
      <div className="h-[300px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              labelStyle={{ color: '#f0f0f5', marginBottom: '8px' }}
              formatter={(value, name) => [
                formatCurrency(value as number),
                name === 'income' ? 'Pemasukan' : 'Pengeluaran',
              ]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              formatter={(value) =>
                value === 'income' ? 'Pemasukan' : 'Pengeluaran'
              }
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
