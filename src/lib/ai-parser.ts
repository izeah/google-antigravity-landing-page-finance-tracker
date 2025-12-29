import { CATEGORY_KEYWORDS, TRANSACTION_CATEGORIES } from './constants';

export interface ParsedTransaction {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  confidence: number;
}

// Keywords that indicate income
const INCOME_KEYWORDS = [
  'gaji', 'salary', 'dapat', 'dapet', 'terima', 'masuk', 'income', 'bonus', 
  'cashback', 'dividen', 'transfer masuk', 'freelance', 'project', 'proyek',
  'pendapatan', 'penghasilan', 'hadiah', 'THR', 'reward', 'refund'
];

// Keywords that indicate expense
const EXPENSE_KEYWORDS = [
  'beli', 'bayar', 'biaya', 'buat', 'untuk', 'expense', 'spend', 'keluar',
  'byr', 'order', 'langganan', 'sewa', 'cicilan', 'angsuran', 'tagihan'
];

// Relative date patterns
const DATE_PATTERNS = {
  today: ['hari ini', 'today', 'sekarang', 'barusan', 'tadi'],
  yesterday: ['kemarin', 'kemaren', 'yesterday'],
  twoDaysAgo: ['2 hari lalu', 'dua hari lalu', '2 hari yang lalu', 'kemarin lusa', 'lusa'],
  threeDaysAgo: ['3 hari lalu', 'tiga hari lalu', '3 hari yang lalu'],
  lastWeek: ['minggu lalu', 'seminggu lalu', 'seminggu yang lalu', '1 minggu lalu'],
  lastMonth: ['bulan lalu', 'sebulan lalu', 'sebulan yang lalu', '1 bulan lalu'],
};

/**
 * Parse natural language transaction text into structured data
 */
export function parseTransactionText(text: string): ParsedTransaction | null {
  const lowerText = text.toLowerCase().trim();
  
  if (!lowerText) return null;
  
  // Extract amount - must have an amount to be valid
  const amount = extractAmount(lowerText);
  if (!amount || amount <= 0) return null;
  
  // Determine type (income or expense)
  const type = determineType(lowerText);
  
  // Detect category
  const category = detectCategory(lowerText, type);
  
  // Parse date from text or use today
  const date = parseDate(lowerText);
  
  // Generate description
  const description = generateDescription(lowerText, amount);
  
  // Calculate confidence based on how well we could parse
  const confidence = calculateConfidence(lowerText, amount, category, date);
  
  return {
    type,
    amount,
    category,
    description,
    date,
    confidence,
  };
}

/**
 * Get current date info for context-aware parsing
 */
function getCurrentDateInfo(): { today: Date; year: number; month: number; day: number } {
  const today = new Date();
  return {
    today,
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  };
}

/**
 * Parse relative date expressions
 */
function parseDate(text: string): string {
  const { today } = getCurrentDateInfo();
  
  // Check for specific date patterns (e.g., "tanggal 25", "tgl 25")
  const specificDateMatch = text.match(/(?:tanggal|tgl|tg)\s*(\d{1,2})/i);
  if (specificDateMatch) {
    const day = parseInt(specificDateMatch[1]);
    const result = new Date(today);
    result.setDate(day);
    // If the specified day is in the future, assume last month
    if (result > today) {
      result.setMonth(result.getMonth() - 1);
    }
    return result.toISOString().split('T')[0];
  }
  
  // Check for "X hari lalu" pattern
  const daysAgoMatch = text.match(/(\d+)\s*hari\s*(?:yang\s*)?lalu/i);
  if (daysAgoMatch) {
    const daysAgo = parseInt(daysAgoMatch[1]);
    const result = new Date(today);
    result.setDate(result.getDate() - daysAgo);
    return result.toISOString().split('T')[0];
  }
  
  // Check for "X minggu lalu" pattern
  const weeksAgoMatch = text.match(/(\d+)\s*minggu\s*(?:yang\s*)?lalu/i);
  if (weeksAgoMatch) {
    const weeksAgo = parseInt(weeksAgoMatch[1]);
    const result = new Date(today);
    result.setDate(result.getDate() - (weeksAgo * 7));
    return result.toISOString().split('T')[0];
  }
  
  // Check for "X bulan lalu" pattern  
  const monthsAgoMatch = text.match(/(\d+)\s*bulan\s*(?:yang\s*)?lalu/i);
  if (monthsAgoMatch) {
    const monthsAgo = parseInt(monthsAgoMatch[1]);
    const result = new Date(today);
    result.setMonth(result.getMonth() - monthsAgo);
    return result.toISOString().split('T')[0];
  }
  
  // Check for predefined relative date patterns
  for (const [key, patterns] of Object.entries(DATE_PATTERNS)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        const result = new Date(today);
        switch (key) {
          case 'yesterday':
            result.setDate(result.getDate() - 1);
            break;
          case 'twoDaysAgo':
            result.setDate(result.getDate() - 2);
            break;
          case 'threeDaysAgo':
            result.setDate(result.getDate() - 3);
            break;
          case 'lastWeek':
            result.setDate(result.getDate() - 7);
            break;
          case 'lastMonth':
            result.setMonth(result.getMonth() - 1);
            break;
          // 'today' - no change needed
        }
        return result.toISOString().split('T')[0];
      }
    }
  }
  
  // Default to today
  return today.toISOString().split('T')[0];
}

/**
 * Extract amount from various formats
 * Supports: 25000, 25.000, 25rb, 25k, 2.5jt, 140k, etc.
 */
function extractAmount(text: string): number | null {
  // Order matters - check more specific patterns first
  
  // Pattern: "2.5jt", "2,5jt", "2.5 juta", "1jt", "15juta"
  const jutaMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/i);
  if (jutaMatch) {
    let numStr = jutaMatch[1].replace(',', '.');
    return Math.round(parseFloat(numStr) * 1000000);
  }
  
  // Pattern: "140k", "25K", "1.5k"
  const kMatch = text.match(/(\d+(?:[.,]\d+)?)\s*k\b/i);
  if (kMatch) {
    let numStr = kMatch[1].replace(',', '.');
    return Math.round(parseFloat(numStr) * 1000);
  }
  
  // Pattern: "25rb", "25ribu", "25 rb", "1.5rb"
  const ribuMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:rb|ribu)/i);
  if (ribuMatch) {
    let numStr = ribuMatch[1].replace(',', '.');
    return Math.round(parseFloat(numStr) * 1000);
  }
  
  // Pattern: Indonesian format "25.000" or "25.000.000"
  const indonesianFormatMatch = text.match(/(\d{1,3}(?:\.\d{3})+)/);
  if (indonesianFormatMatch) {
    const numStr = indonesianFormatMatch[1].replace(/\./g, '');
    return parseInt(numStr);
  }
  
  // Pattern: Just plain numbers like "25000", "150000"
  const plainNumberMatch = text.match(/\b(\d{4,})\b/);
  if (plainNumberMatch) {
    return parseInt(plainNumberMatch[1]);
  }
  
  // Pattern: Small numbers (might be in thousands), like "25" meaning 25000
  // Only use this if the number is reasonable for currency
  const smallNumberMatch = text.match(/\b(\d{1,3})\b/);
  if (smallNumberMatch) {
    const num = parseInt(smallNumberMatch[1]);
    // If it's a small number and no other amount indicator, assume it's in thousands
    // But only if context suggests it's an amount (near keywords like "beli", "bayar", etc.)
    if (num >= 1 && num <= 999) {
      // Check if there's currency context
      const hasCurrencyContext = /(?:rp\.?|rupiah|idr|\$)/i.test(text);
      if (!hasCurrencyContext) {
        // Small numbers without currency symbol, might be in thousands for Indonesian context
        // But let's be conservative and return the actual number
        return num;
      }
      return num;
    }
  }
  
  return null;
}

/**
 * Determine if transaction is income or expense
 */
function determineType(text: string): 'income' | 'expense' {
  // Check for income keywords first (usually more specific)
  for (const keyword of INCOME_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'income';
    }
  }
  
  // Check for expense keywords
  for (const keyword of EXPENSE_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'expense';
    }
  }
  
  // Default to expense (most common use case for expense tracking)
  return 'expense';
}

/**
 * Detect the most appropriate category based on keywords
 */
function detectCategory(text: string, type: 'income' | 'expense'): string {
  // Get relevant categories based on type
  const categories = type === 'income' 
    ? Object.keys(CATEGORY_KEYWORDS).filter(k => 
        TRANSACTION_CATEGORIES.income.some(c => c.id === k)
      )
    : Object.keys(CATEGORY_KEYWORDS).filter(k => 
        TRANSACTION_CATEGORIES.expense.some(c => c.id === k)
      );
  
  // Find best matching category
  let bestMatch = '';
  let maxMatches = 0;
  
  for (const categoryId of categories) {
    const keywords = CATEGORY_KEYWORDS[categoryId] || [];
    let matches = 0;
    
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        // Weight exact matches higher
        matches += keyword.length > 3 ? 2 : 1;
      }
    }
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = categoryId;
    }
  }
  
  // Return best match or default
  if (bestMatch) return bestMatch;
  
  return type === 'income' ? 'other_income' : 'other_expense';
}

/**
 * Generate a clean description from the input text
 */
function generateDescription(text: string, amount: number): string {
  // Remove amount patterns
  let desc = text
    // Remove juta/jt patterns
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/gi, '')
    // Remove ribu/rb patterns
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:rb|ribu)/gi, '')
    // Remove k patterns
    .replace(/(\d+(?:[.,]\d+)?)\s*k\b/gi, '')
    // Remove Indonesian formatted numbers
    .replace(/(\d{1,3}(?:\.\d{3})+)/g, '')
    // Remove remaining plain numbers
    .replace(/\b\d+\b/g, '')
    // Remove date expressions
    .replace(/(\d+)\s*(?:hari|minggu|bulan)\s*(?:yang\s*)?lalu/gi, '')
    .replace(/(?:kemarin|kemaren|hari ini|today|yesterday)/gi, '')
    .replace(/(?:tanggal|tgl|tg)\s*\d+/gi, '')
    // Remove currency symbols
    .replace(/(?:rp\.?|rupiah|idr)/gi, '')
    .trim();
  
  // Clean up extra spaces and punctuation
  desc = desc.replace(/\s+/g, ' ').replace(/^[,.\s]+|[,.\s]+$/g, '').trim();
  
  // Capitalize first letter
  if (desc) {
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  }
  
  return desc || `Transaksi Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Calculate confidence score for the parsed transaction
 */
function calculateConfidence(
  text: string, 
  amount: number | null, 
  category: string,
  date: string
): number {
  let confidence = 0.4; // Base confidence
  
  // Amount found clearly (higher bonus for larger amounts that are clearly intentional)
  if (amount && amount > 0) {
    confidence += 0.2;
    if (amount >= 1000) confidence += 0.1; // More confident with realistic amounts
  }
  
  // Category is not "other" - we correctly identified it
  if (!category.includes('other')) {
    confidence += 0.15;
  }
  
  // Date was explicitly mentioned
  const today = new Date().toISOString().split('T')[0];
  if (date !== today) {
    confidence += 0.1; // User specified a date
  }
  
  // Text has reasonable length (not too short, not too long)
  if (text.length > 8 && text.length < 150) {
    confidence += 0.05;
  }
  
  return Math.min(confidence, 1);
}

// ============================================
// Example usage:
// ============================================
// parseTransactionText("beli kopi 25rb")
// -> { type: 'expense', amount: 25000, category: 'food', description: 'Beli kopi', date: '2024-12-29' }
//
// parseTransactionText("dapet cashback 2 hari lalu 15rb")
// -> { type: 'income', amount: 15000, category: 'gift', description: 'Dapet cashback', date: '2024-12-27' }
//
// parseTransactionText("gaji bulan ini 15jt")
// -> { type: 'income', amount: 15000000, category: 'salary', description: 'Gaji bulan ini', date: '2024-12-29' }
//
// parseTransactionText("beli makan 140k")
// -> { type: 'expense', amount: 140000, category: 'food', description: 'Beli makan', date: '2024-12-29' }
//
// parseTransactionText("bayar listrik kemarin 500rb")
// -> { type: 'expense', amount: 500000, category: 'bills', description: 'Bayar listrik', date: '2024-12-28' }
