'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: LucideIcon;
  type?: 'default' | 'income' | 'expense';
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  trend,
  icon: Icon,
  type = 'default',
  delay = 0,
}: StatsCardProps) {
  const bgGradients = {
    default: 'from-purple-500/10 to-cyan-500/10',
    income: 'from-green-500/10 to-emerald-500/10',
    expense: 'from-red-500/10 to-orange-500/10',
  };

  const iconColors = {
    default: 'text-purple-400',
    income: 'text-green-400',
    expense: 'text-red-400',
  };

  const valueColors = {
    default: 'text-white',
    income: 'text-green-400',
    expense: 'text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={`glass-card p-6 bg-gradient-to-br ${bgGradients[type]} cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgGradients[type]} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColors[type]}`} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
              trend > 0
                ? 'bg-green-500/10 text-green-400'
                : trend < 0
                ? 'bg-red-500/10 text-red-400'
                : 'bg-gray-500/10 text-gray-400'
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-2xl sm:text-3xl font-bold ${valueColors[type]}`}>
          {formatCurrency(value)}
        </p>
      </div>
    </motion.div>
  );
}
