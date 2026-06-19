import { Transaction } from '@/types';
import { DEFAULT_CATEGORIES } from '@/types';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const NOTES_POOL: Record<string, string[]> = {
  'cat-1': ['午餐', '早餐', '外卖', '晚餐', '星巴克', '奶茶', '火锅', '烧烤'],
  'cat-2': ['地铁', '打车', '加油', '停车', '公交', '高铁票'],
  'cat-3': ['衣服', '日用品', '淘宝', '京东', '超市', '化妆品'],
  'cat-4': ['电影票', '游戏充值', 'KTV', '演唱会', '会员订阅'],
  'cat-5': ['房租', '水电', '物业', '网费', '清洁'],
  'cat-6': ['感冒药', '体检', '挂号', '维生素'],
  'cat-7': ['书籍', '网课', '考试费', '文具'],
  'cat-8': ['快递费', '小费', '送礼', '杂项'],
};

const AMOUNT_RANGES: Record<string, [number, number]> = {
  'cat-1': [15, 200],
  'cat-2': [5, 350],
  'cat-3': [30, 800],
  'cat-4': [20, 500],
  'cat-5': [100, 3000],
  'cat-6': [30, 400],
  'cat-7': [40, 600],
  'cat-8': [10, 200],
};

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
      const cat = DEFAULT_CATEGORIES[Math.floor(Math.random() * DEFAULT_CATEGORIES.length)];
      const range = AMOUNT_RANGES[cat.id];
      const notes = NOTES_POOL[cat.id];
      const amount = Math.round(randomBetween(range[0], range[1]) * 100) / 100;
      const note = notes[Math.floor(Math.random() * notes.length)];

      transactions.push({
        id: `txn-${String(idCounter++).padStart(4, '0')}`,
        amount,
        categoryId: cat.id,
        date: dateKey,
        note,
        createdAt: Date.now() - dayOffset * 86400000 - i * 3600000,
      });
    }
  }

  return transactions.sort((a, b) => b.createdAt - a.createdAt);
}
