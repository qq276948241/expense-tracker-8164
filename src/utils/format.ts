import { Currency, CURRENCY_SYMBOLS } from '@/types';

export function formatCurrency(amount: number, currency: Currency = 'CNY'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const sign = amount < 0 ? '-' : '';
  const formatted = new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return `${sign}${symbol}${formatted}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function getMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function generateMonthDays(monthKey: string): string[] {
  const [year, month] = monthKey.split('-').map(Number);
  const days = getDaysInMonth(year, month - 1);
  const result: string[] = [];
  for (let d = 1; d <= days; d++) {
    result.push(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  return result;
}

export function getPreviousMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 2, 1);
  return getMonthKey(date);
}

export function calcChangePercent(current: number, previous: number): number {
  if (previous === 0) return NaN;
  return ((current - previous) / previous) * 100;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
