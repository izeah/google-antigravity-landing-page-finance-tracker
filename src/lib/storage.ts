import { generateId } from './utils';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  userId: string;
}

const TRANSACTIONS_KEY = 'fintrack_transactions';

export function getTransactions(userId: string): Transaction[] {
  if (typeof window === 'undefined') return [];
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  const allTransactions: Transaction[] = transactions ? JSON.parse(transactions) : [];
  return allTransactions.filter(t => t.userId === userId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function saveTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  const allTransactions: Transaction[] = transactions ? JSON.parse(transactions) : [];
  
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  allTransactions.push(newTransaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
  
  return newTransaction;
}

export function updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  const allTransactions: Transaction[] = transactions ? JSON.parse(transactions) : [];
  
  const index = allTransactions.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  allTransactions[index] = { ...allTransactions[index], ...updates };
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
  
  return allTransactions[index];
}

export function deleteTransaction(id: string): boolean {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  const allTransactions: Transaction[] = transactions ? JSON.parse(transactions) : [];
  
  const index = allTransactions.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  allTransactions.splice(index, 1);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
  
  return true;
}

export function getTransactionsByMonth(userId: string, year: number, month: number): Transaction[] {
  const transactions = getTransactions(userId);
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

export function getTransactionsByYear(userId: string, year: number): Transaction[] {
  const transactions = getTransactions(userId);
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year;
  });
}

export function calculateTotals(transactions: Transaction[]): { income: number; expense: number; balance: number } {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function getCategoryBreakdown(transactions: Transaction[], type: 'income' | 'expense'): { category: string; amount: number; percentage: number }[] {
  const filtered = transactions.filter(t => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  
  const byCategory: Record<string, number> = {};
  filtered.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });
  
  return Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getMonthlyData(userId: string, year: number): { month: string; income: number; expense: number }[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  return months.map((month, index) => {
    const transactions = getTransactionsByMonth(userId, year, index);
    const totals = calculateTotals(transactions);
    return {
      month,
      income: totals.income,
      expense: totals.expense,
    };
  });
}

// Initialize with sample data
export function initializeSampleData(userId: string): void {
  const existing = getTransactions(userId);
  if (existing.length > 0) return;
  
  const sampleTransactions = [
    { type: 'income' as const, amount: 15000000, category: 'salary', description: 'Gaji Desember', date: '2024-12-01' },
    { type: 'expense' as const, amount: 2500000, category: 'bills', description: 'Sewa Apartemen', date: '2024-12-02' },
    { type: 'expense' as const, amount: 500000, category: 'food', description: 'Belanja Bulanan', date: '2024-12-05' },
    { type: 'expense' as const, amount: 350000, category: 'transport', description: 'Bensin', date: '2024-12-08' },
    { type: 'expense' as const, amount: 150000, category: 'entertainment', description: 'Netflix & Spotify', date: '2024-12-10' },
    { type: 'income' as const, amount: 3000000, category: 'freelance', description: 'Project Website', date: '2024-12-12' },
    { type: 'expense' as const, amount: 250000, category: 'food', description: 'Makan di Luar', date: '2024-12-15' },
    { type: 'expense' as const, amount: 1000000, category: 'shopping', description: 'Beli Baju', date: '2024-12-18' },
    { type: 'expense' as const, amount: 200000, category: 'health', description: 'Vitamin', date: '2024-12-20' },
    { type: 'income' as const, amount: 500000, category: 'gift', description: 'Cashback', date: '2024-12-22' },
    { type: 'expense' as const, amount: 75000, category: 'food', description: 'Kopi Starbucks', date: '2024-12-25' },
    { type: 'expense' as const, amount: 100000, category: 'transport', description: 'Gojek', date: '2024-12-26' },
  ];
  
  sampleTransactions.forEach(t => {
    saveTransaction({ ...t, userId });
  });
}
