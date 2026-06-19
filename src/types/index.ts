export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  [month: string]: number;
}

export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP';

export interface Settings {
  currency: Currency;
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
};

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'cat-1', name: '餐饮', color: '#f97316', icon: 'utensils' },
  { id: 'cat-2', name: '交通', color: '#3b82f6', icon: 'car' },
  { id: 'cat-3', name: '购物', color: '#ec4899', icon: 'shopping-bag' },
  { id: 'cat-4', name: '娱乐', color: '#a855f7', icon: 'gamepad-2' },
  { id: 'cat-5', name: '居住', color: '#14b8a6', icon: 'home' },
  { id: 'cat-6', name: '医疗', color: '#ef4444', icon: 'heart-pulse' },
  { id: 'cat-7', name: '教育', color: '#22c55e', icon: 'book-open' },
  { id: 'cat-8', name: '其他支出', color: '#6b7280', icon: 'package' },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'cat-salary', name: '工资', color: '#10b981', icon: 'wallet' },
  { id: 'cat-bonus', name: '奖金', color: '#06b6d4', icon: 'gift' },
  { id: 'cat-invest', name: '理财收益', color: '#8b5cf6', icon: 'trending-up' },
  { id: 'cat-other-in', name: '其他收入', color: '#64748b', icon: 'plus-circle' },
];

export const DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];
