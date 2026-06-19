import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency, Settings } from '@/types';

interface SettingsState extends Settings {
  setCurrency: (currency: Currency) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'CNY',

      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'finance-tracker-settings',
    },
  ),
);
