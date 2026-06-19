import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '@/types';
import { generateMockTransactions } from '@/utils/seed';

interface TransactionState {
  transactions: Transaction[];
  hydrated: boolean;
  setHydrated: () => void;
  addTransaction: (txn: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByMonth: (monthKey: string) => Transaction[];
  getTotalByMonth: (monthKey: string) => number;
  getTotalByCategory: (monthKey: string) => Map<string, number>;
  getDailyTotals: (monthKey: string) => { date: string; total: number }[];
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

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

      getTransactionsByMonth: (monthKey) =>
        get().transactions.filter((t) => t.date.startsWith(monthKey)),

      getTotalByMonth: (monthKey) =>
        get()
          .transactions.filter((t) => t.date.startsWith(monthKey))
          .reduce((sum, t) => sum + t.amount, 0),

      getTotalByCategory: (monthKey) => {
        const map = new Map<string, number>();
        get()
          .transactions.filter((t) => t.date.startsWith(monthKey))
          .forEach((t) => {
            map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
          });
        return map;
      },

      getDailyTotals: (monthKey) => {
        const map = new Map<string, number>();
        const prefix = monthKey;
        get()
          .transactions.filter((t) => t.date.startsWith(prefix))
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
    }),
    {
      name: 'finance-tracker-transactions',
      onRehydrateStorage: () => (state) => {
        if (state && state.transactions.length === 0) {
          state.transactions = generateMockTransactions();
        }
        state.hydrated = true;
      },
    },
  ),
);
