import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Budget } from '@/types';

interface BudgetState {
  budget: Budget;
  setBudgetLimit: (monthKey: string, limit: number) => void;
  getBudgetLimit: (monthKey: string) => number;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budget: {},

      setBudgetLimit: (monthKey, limit) =>
        set((state) => ({
          budget: { ...state.budget, [monthKey]: limit },
        })),

      getBudgetLimit: (monthKey) => get().budget[monthKey] || 0,
    }),
    {
      name: 'finance-tracker-budget',
    },
  ),
);
