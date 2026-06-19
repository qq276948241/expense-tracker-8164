import { Transaction, DEFAULT_EXPENSE_CATEGORIES } from '@/types';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const EXPENSE_NOTES: Record<string, string[]> = {
  'cat-1': ['午餐', '早餐', '外卖', '晚餐', '星巴克', '奶茶', '火锅', '烧烤'],
  'cat-2': ['地铁', '打车', '加油', '停车', '公交', '高铁票'],
  'cat-3': ['衣服', '日用品', '淘宝', '京东', '超市', '化妆品'],
  'cat-4': ['电影票', '游戏充值', 'KTV', '演唱会', '会员订阅'],
  'cat-5': ['房租', '水电', '物业', '网费', '清洁'],
  'cat-6': ['感冒药', '体检', '挂号', '维生素'],
  'cat-7': ['书籍', '网课', '考试费', '文具'],
  'cat-8': ['快递费', '小费', '送礼', '杂项'],
};

const EXPENSE_RANGES: Record<string, [number, number]> = {
  'cat-1': [15, 200],
  'cat-2': [5, 350],
  'cat-3': [30, 800],
  'cat-4': [20, 500],
  'cat-5': [100, 3000],
  'cat-6': [30, 400],
  'cat-7': [40, 600],
  'cat-8': [10, 200],
};

const INCOME_CATS = [
  { id: 'cat-salary', name: '工资', color: '#10b981', icon: 'wallet' },
  { id: 'cat-bonus', name: '奖金', color: '#06b6d4', icon: 'gift' },
  { id: 'cat-invest', name: '理财收益', color: '#8b5cf6', icon: 'trending-up' },
  { id: 'cat-other-in', name: '其他收入', color: '#6b7280', icon: 'plus-circle' },
];

const INCOME_NOTES: Record<string, string[]> = {
  'cat-salary': ['月薪', '工资', '发薪日'],
  'cat-bonus': ['年终奖', '项目奖金', '绩效奖金'],
  'cat-invest': ['基金收益', '股票分红', '存款利息'],
  'cat-other-in': ['兼职', '红包', '退款'],
};

const INCOME_RANGES: Record<string, [number, number]> = {
  'cat-salary': [8000, 15000],
  'cat-bonus': [500, 5000],
  'cat-invest': [50, 2000],
  'cat-other-in': [20, 1000],
};

export const INCOME_CATEGORIES = INCOME_CATS;
export const INCOME_CAT_IDS = INCOME_CATS.map((c) => c.id);

export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();
  let idCounter = 1;

  for (let dayOffset = 0; dayOffset < 45; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateKey = formatDateKey(date);

    const txnCount = Math.random() < 0.2 ? 0 : Math.floor(randomBetween(1, 5));
    for (let i = 0; i < txnCount; i++) {
      const cat = DEFAULT_EXPENSE_CATEGORIES[Math.floor(Math.random() * DEFAULT_EXPENSE_CATEGORIES.length)];
      const range = EXPENSE_RANGES[cat.id];
      const notes = EXPENSE_NOTES[cat.id];
      const amount = Math.round(randomBetween(range[0], range[1]) * 100) / 100;
      const note = notes[Math.floor(Math.random() * notes.length)];

      transactions.push({
        id: `txn-${String(idCounter++).padStart(4, '0')}`,
        type: 'expense',
        amount,
        categoryId: cat.id,
        date: dateKey,
        note,
        createdAt: Date.now() - dayOffset * 86400000 - i * 3600000,
      });
    }

    if (date.getDate() === 5) {
      const amount = Math.round(randomBetween(8000, 15000) * 100) / 100;
      transactions.push({
        id: `txn-${String(idCounter++).padStart(4, '0')}`,
        type: 'income',
        amount,
        categoryId: 'cat-salary',
        date: dateKey,
        note: '月薪',
        createdAt: Date.now() - dayOffset * 86400000 + 3600000,
      });
    }

    if (date.getDate() === 15 && Math.random() < 0.4) {
      const catIdx = Math.floor(Math.random() * INCOME_CATS.length);
      const cat = INCOME_CATS[catIdx];
      const range = INCOME_RANGES[cat.id];
      const notes = INCOME_NOTES[cat.id];
      const amount = Math.round(randomBetween(range[0], range[1]) * 100) / 100;
      const note = notes[Math.floor(Math.random() * notes.length)];

      transactions.push({
        id: `txn-${String(idCounter++).padStart(4, '0')}`,
        type: 'income',
        amount,
        categoryId: cat.id,
        date: dateKey,
        note,
        createdAt: Date.now() - dayOffset * 86400000 + 7200000,
      });
    }
  }

  return transactions.sort((a, b) => b.createdAt - a.createdAt);
}
