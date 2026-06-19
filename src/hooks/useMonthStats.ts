import { useMemo } from 'react';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/types';
import { formatDateShort } from '@/utils/format';

export interface DailyTotal {
  date: string;
  label: string;
  total: number;
}

export interface CategoryTotal {
  id: string;
  name: string;
  color: string;
  value: number;
}

export interface MonthStats {
  monthKey: string;
  expenseTotal: number;
  incomeTotal: number;
  balance: number;
  txnCount: number;
  dailyExpenses: DailyTotal[];
  categoryExpenses: CategoryTotal[];
  topExpenseCategory: CategoryTotal | undefined;
}

function daysInMonth(monthKey: string): number {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function useMonthStats(monthKey: string, includeUpToToday = true): MonthStats {
  const getTransactionsByMonth = useTransactionStore((s) => s.getTransactionsByMonth);
  const categories = useCategoryStore((s) => s.categories);

  const expenseCatIds = useMemo(
    () => new Set(DEFAULT_EXPENSE_CATEGORIES.map((c) => c.id)),
    [],
  );

  return useMemo(() => {
    const allTxns = getTransactionsByMonth(monthKey);

    let expenseTotal = 0;
    let incomeTotal = 0;
    const dailyMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();

    for (const t of allTxns) {
      if (t.type === 'income') {
        incomeTotal += t.amount;
      } else {
        expenseTotal += t.amount;
        dailyMap.set(t.date, (dailyMap.get(t.date) || 0) + t.amount);
        if (expenseCatIds.has(t.categoryId)) {
          categoryMap.set(t.categoryId, (categoryMap.get(t.categoryId) || 0) + t.amount);
        }
      }
    }

    const today = new Date();
    const [year, month] = monthKey.split('-').map(Number);
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month;
    const maxDay = includeUpToToday && isCurrentMonth ? today.getDate() : daysInMonth(monthKey);

    const dailyExpenses: DailyTotal[] = [];
    for (let d = 1; d <= maxDay; d++) {
      const date = `${year}-${pad(month)}-${pad(d)}`;
      dailyExpenses.push({
        date,
        label: formatDateShort(date),
        total: dailyMap.get(date) || 0,
      });
    }

    const categoryExpenses: CategoryTotal[] = [];
    for (const cat of categories) {
      if (!expenseCatIds.has(cat.id)) continue;
      const v = categoryMap.get(cat.id) || 0;
      if (v > 0) {
        categoryExpenses.push({
          id: cat.id,
          name: cat.name,
          color: cat.color,
          value: v,
        });
      }
    }
    categoryExpenses.sort((a, b) => b.value - a.value);

    return {
      monthKey,
      expenseTotal,
      incomeTotal,
      balance: incomeTotal - expenseTotal,
      txnCount: allTxns.length,
      dailyExpenses,
      categoryExpenses,
      topExpenseCategory: categoryExpenses[0],
    };
  }, [monthKey, includeUpToToday, getTransactionsByMonth, categories, expenseCatIds]);
}
