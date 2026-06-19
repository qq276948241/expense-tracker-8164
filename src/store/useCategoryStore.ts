import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, DEFAULT_CATEGORIES } from '@/types';

interface CategoryState {
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (cat) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...cat, id: `cat-${Date.now()}` },
          ],
        })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      getCategoryById: (id) => get().categories.find((c) => c.id === id),
    }),
    {
      name: 'finance-tracker-categories',
    },
  ),
);
