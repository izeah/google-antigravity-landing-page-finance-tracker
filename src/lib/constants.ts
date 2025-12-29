export const TRANSACTION_CATEGORIES = {
  income: [
    { id: 'salary', name: 'Gaji', icon: 'Briefcase', color: '#22c55e' },
    { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: '#10b981' },
    { id: 'investment', name: 'Investasi', icon: 'TrendingUp', color: '#14b8a6' },
    { id: 'gift', name: 'Hadiah', icon: 'Gift', color: '#06b6d4' },
    { id: 'other_income', name: 'Lainnya', icon: 'Plus', color: '#0ea5e9' },
  ],
  expense: [
    { id: 'food', name: 'Makanan', icon: 'UtensilsCrossed', color: '#f97316' },
    { id: 'transport', name: 'Transportasi', icon: 'Car', color: '#eab308' },
    { id: 'shopping', name: 'Belanja', icon: 'ShoppingBag', color: '#ec4899' },
    { id: 'bills', name: 'Tagihan', icon: 'Receipt', color: '#8b5cf6' },
    { id: 'entertainment', name: 'Hiburan', icon: 'Gamepad2', color: '#a855f7' },
    { id: 'health', name: 'Kesehatan', icon: 'Heart', color: '#ef4444' },
    { id: 'education', name: 'Pendidikan', icon: 'GraduationCap', color: '#3b82f6' },
    { id: 'other_expense', name: 'Lainnya', icon: 'Minus', color: '#6b7280' },
  ],
};

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: ['makan', 'makanan', 'kopi', 'coffee', 'restoran', 'restaurant', 'nasi', 'rice', 'minum', 'drink', 'snack', 'jajan', 'bakso', 'sate', 'ayam', 'soto', 'gorengan', 'indomie', 'sarapan', 'makan siang', 'makan malam', 'lunch', 'dinner', 'breakfast'],
  transport: ['transport', 'transportasi', 'bensin', 'fuel', 'gas', 'ojek', 'gojek', 'grab', 'taxi', 'taksi', 'bus', 'kereta', 'train', 'parkir', 'parking', 'tol', 'toll'],
  shopping: ['belanja', 'shopping', 'beli', 'buy', 'toko', 'store', 'mall', 'online shop', 'marketplace', 'tokopedia', 'shopee'],
  bills: ['tagihan', 'bill', 'listrik', 'electric', 'air', 'water', 'internet', 'pulsa', 'token', 'sewa', 'rent', 'cicilan', 'kredit'],
  entertainment: ['hiburan', 'entertainment', 'game', 'film', 'movie', 'bioskop', 'cinema', 'netflix', 'spotify', 'youtube', 'nonton', 'karaoke', 'concert', 'konser'],
  health: ['kesehatan', 'health', 'obat', 'medicine', 'dokter', 'doctor', 'rumah sakit', 'hospital', 'apotek', 'pharmacy', 'vitamin', 'gym', 'fitness'],
  education: ['pendidikan', 'education', 'buku', 'book', 'kursus', 'course', 'les', 'training', 'sekolah', 'school', 'kuliah', 'college', 'udemy'],
  salary: ['gaji', 'salary', 'upah', 'wage', 'payroll'],
  freelance: ['freelance', 'project', 'proyek', 'client', 'klien', 'jasa'],
  investment: ['investasi', 'investment', 'dividen', 'dividend', 'saham', 'stock', 'crypto', 'bunga', 'interest'],
  gift: ['hadiah', 'gift', 'bonus', 'cashback', 'reward', 'THR'],
};

export const CHART_COLORS = {
  income: '#22c55e',
  expense: '#ef4444',
  primary: '#8b5cf6',
  secondary: '#06b6d4',
};

export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
