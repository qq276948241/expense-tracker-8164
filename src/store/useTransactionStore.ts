import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, TransactionType } from '@/types';
import { generateMockTransactions } from '@/utils/seed';

interface TransactionState {
  transactions: Transaction[];
  hydrated: boolean;
  hasSeeded: boolean;
  setHydrated: () => void;
  setHasSeeded: (v: boolean) => void;
  addTransaction: (txn: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByMonth: (monthKey: string, type?: TransactionType) => Transaction[];
  getTotalByMonth: (monthKey: string, type?: TransactionType) => number;
  getTotalByCategory: (monthKey: string, type?: TransactionType) => Map<string, number>;
  getDailyTotals: (monthKey: string, type?: TransactionType) => { date: string; total: number }[];
  getBalanceByMonth: (monthKey: string) => number;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      hydrated: false,
      hasSeeded: false,

      setHydrated: () => set({ hydrated: true }),
      setHasSeeded: (v) => set({ hasSeeded: v }),

      addTransaction: (txn) =>
        set((state) => ({
          transactions: [
            {
              ...txn,
              id: `txn-${Date.now()}`,
              createdAt: Date.now(),
            },
            ...state.transactions,
          ],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      getTransactionsByMonth: (monthKey, type) =>
        get().transactions.filter((t) => {
          if (!t.date.startsWith(monthKey)) return false;
          if (type && t.type !== type) return false;
          return true;
        }),

      getTotalByMonth: (monthKey, type) =>
        get()
          .transactions.filter((t) => {
            if (!t.date.startsWith(monthKey)) return false;
            if (type && t.type !== type) return false;
            return true;
          })
          .reduce((sum, t) => sum + t.amount, 0),

      getTotalByCategory: (monthKey, type) => {
        const map = new Map<string, number>();
        get()
          .transactions.filter((t) => {
            if (!t.date.startsWith(monthKey)) return false;
            if (type && t.type !== type) return false;
            return true;
          })
          .forEach((t) => {
            map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
          });
        return map;
      },

      getDailyTotals: (monthKey, type) => {
        const map = new Map<string, number>();
        get()
          .transactions.filter((t) => {
            if (!t.date.startsWith(monthKey)) return false;
            if (type && t.type !== type) return false;
            return true;
          })
          .forEach((t) => {
            map.set(t.date, (map.get(t.date) || 0) + t.amount);
          });
        const [year, month] = monthKey.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        const result: { date: string; total: number }[] = [];
        for (let d = 1; d <= daysInMonth; d++) {
          const ds = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          result.push({ date: ds, total: map.get(ds) || 0 });
        }
        return result;
      },

      getBalanceByMonth: (monthKey) => {
        const income = get().getTotalByMonth(monthKey, 'income');
        const expense = get().getTotalByMonth(monthKey, 'expense');
        return income - expense;
      },
    }),
    {
      name: 'finance-tracker-tx-v2',
      onRehydrateStorage: () => (state) => {
        if (state && state.transactions && state.transactions.length > 0) {
          const needsMigrate = state.transactions.some((t: any) => !t.type);
          if (needsMigrate) {
            state.transactions = state.transactions.map((t: any) => ({
              type: 'expense' as const,
              ...t,
            }));
          }
        }
        state.hydrated = true;
      },
    },
  ),
);
