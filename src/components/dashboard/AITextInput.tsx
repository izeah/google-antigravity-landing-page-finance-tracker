'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Loader2, Check, AlertCircle } from 'lucide-react';
import { parseTransactionText } from '@/lib/ai-parser';
import { saveTransaction } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';

interface AITextInputProps {
  onSuccess: () => void;
}

export default function AITextInput({ onSuccess }: AITextInputProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setResult(null);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const parsed = parseTransactionText(input);

    if (parsed) {
      const user = getCurrentUser();
      if (!user) {
        setResult({ success: false, message: 'Anda harus login terlebih dahulu' });
        setIsProcessing(false);
        return;
      }

      // Find category name
      const allCategories = [...TRANSACTION_CATEGORIES.income, ...TRANSACTION_CATEGORIES.expense];
      const categoryInfo = allCategories.find((c) => c.id === parsed.category);
      const categoryName = categoryInfo?.name || parsed.category;

      saveTransaction({
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        date: new Date().toISOString().split('T')[0],
        userId: user.id,
      });

      setResult({
        success: true,
        message: `${parsed.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ${formatCurrency(parsed.amount)} (${categoryName}) berhasil dicatat!`,
      });
      setInput('');
      onSuccess();
    } else {
      setResult({
        success: false,
        message: 'Tidak bisa memahami input. Coba format seperti "Beli kopi 25rb" atau "Gaji bulan ini 15jt"',
      });
    }

    setIsProcessing(false);

    // Clear result after 5 seconds
    setTimeout(() => setResult(null), 5000);
  };

  const examples = [
    'Beli kopi 25rb',
    'Makan siang 50000',
    'Gaji bulan ini 15jt',
    'Bayar listrik 500rb',
    'Freelance project 3jt',
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold">Input dengan AI</h3>
          <p className="text-sm text-gray-400">Ketik transaksi dengan bahasa natural</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder='Contoh: "Beli kopi 25rb" atau "Gaji 15jt"'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field pr-14"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Result Message */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 p-4 rounded-xl ${
              result.success
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            {result.success ? (
              <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </p>
          </motion.div>
        )}

        {/* Examples */}
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setInput(example)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-sm hover:bg-gray-700 hover:text-white transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
