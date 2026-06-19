export interface Transaction {
  id: string;
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

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: '餐饮', color: '#f97316', icon: 'utensils' },
  { id: 'cat-2', name: '交通', color: '#3b82f6', icon: 'car' },
  { id: 'cat-3', name: '购物', color: '#ec4899', icon: 'shopping-bag' },
  { id: 'cat-4', name: '娱乐', color: '#a855f7', icon: 'gamepad-2' },
  { id: 'cat-5', name: '居住', color: '#14b8a6', icon: 'home' },
  { id: 'cat-6', name: '医疗', color: '#ef4444', icon: 'heart-pulse' },
  { id: 'cat-7', name: '教育', color: '#22c55e', icon: 'book-open' },
  { id: 'cat-8', name: '其他', color: '#6b7280', icon: 'package' },
];
