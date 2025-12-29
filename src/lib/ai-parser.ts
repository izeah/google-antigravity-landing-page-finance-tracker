import { CATEGORY_KEYWORDS, TRANSACTION_CATEGORIES } from './constants';

export interface ParsedTransaction {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  confidence: number;
}

// Keywords that indicate income
const INCOME_KEYWORDS = ['gaji', 'salary', 'dapat', 'terima', 'masuk', 'income', 'bonus', 'cashback', 'dividen', 'transfer masuk', 'freelance', 'project'];

// Keywords that indicate expense
const EXPENSE_KEYWORDS = ['beli', 'bayar', 'biaya', 'buat', 'untuk', 'expense', 'spend', 'keluar'];

export function parseTransactionText(text: string): ParsedTransaction | null {
  const lowerText = text.toLowerCase().trim();
  
  if (!lowerText) return null;
  
  // Extract amount
  const amount = extractAmount(lowerText);
  if (!amount) return null;
  
  // Determine type (income or expense)
  const type = determineType(lowerText);
  
  // Detect category
  const category = detectCategory(lowerText, type);
  
  // Generate description
  const description = generateDescription(lowerText, amount);
  
  // Calculate confidence based on how well we could parse
  const confidence = calculateConfidence(lowerText, amount, category);
  
  return {
    type,
    amount,
    category,
    description,
    confidence,
  };
}

function extractAmount(text: string): number | null {
  // Pattern untuk berbagai format angka Indonesia
  const patterns = [
    // "25000", "25.000", "25,000"
    /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/,
    // "25rb", "25ribu", "25 rb", "25 ribu"
    /(\d+)\s*(?:rb|ribu)/i,
    // "25k", "25 k"
    /(\d+)\s*k\b/i,
    // "2.5jt", "2,5 juta", "2jt"
    /(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/i,
    // Just numbers
    /(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let numStr = match[1];
      
      // Clean up the number string
      numStr = numStr.replace(/\./g, '').replace(/,/g, '.');
      
      let amount = parseFloat(numStr);
      
      // Check for multipliers
      if (/\d+\s*(?:rb|ribu)/i.test(text)) {
        amount *= 1000;
      } else if (/\d+\s*k\b/i.test(text)) {
        amount *= 1000;
      } else if (/\d+(?:[.,]\d+)?\s*(?:jt|juta)/i.test(text)) {
        amount *= 1000000;
      }
      
      return Math.round(amount);
    }
  }
  
  return null;
}

function determineType(text: string): 'income' | 'expense' {
  // Check for income keywords
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
  
  // Default to expense (most common use case)
  return 'expense';
}

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
        matches++;
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

function generateDescription(text: string, amount: number): string {
  // Remove the amount patterns from text to get description
  let desc = text
    .replace(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/g, '')
    .replace(/(\d+)\s*(?:rb|ribu|k|jt|juta)/gi, '')
    .replace(/(\d+)/g, '')
    .trim();
  
  // Clean up extra spaces
  desc = desc.replace(/\s+/g, ' ').trim();
  
  // Capitalize first letter
  if (desc) {
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  }
  
  return desc || `Transaksi Rp ${amount.toLocaleString('id-ID')}`;
}

function calculateConfidence(text: string, amount: number | null, category: string): number {
  let confidence = 0.5; // Base confidence
  
  // Amount found clearly
  if (amount && amount > 0) {
    confidence += 0.2;
  }
  
  // Category is not "other"
  if (!category.includes('other')) {
    confidence += 0.2;
  }
  
  // Text has reasonable length
  if (text.length > 10 && text.length < 100) {
    confidence += 0.1;
  }
  
  return Math.min(confidence, 1);
}

// Example usage:
// parseTransactionText("beli kopi 25rb") -> { type: 'expense', amount: 25000, category: 'food', description: 'Beli kopi' }
// parseTransactionText("gaji bulan ini 15jt") -> { type: 'income', amount: 15000000, category: 'salary', description: 'Gaji bulan ini' }
// parseTransactionText("bayar listrik 500000") -> { type: 'expense', amount: 500000, category: 'bills', description: 'Bayar listrik' }
