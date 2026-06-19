import { Transaction, Category } from '@/types';
import { formatDate } from './format';

export function exportTransactionsToCSV(
  transactions: Transaction[],
  categories: Category[],
): void {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const headers = ['日期', '类型', '分类', '金额', '备注'];
  const rows = transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) => [
      formatDate(t.date),
      t.type === 'income' ? '收入' : '支出',
      categoryMap.get(t.categoryId) || '未知',
      t.amount.toFixed(2),
      t.note.replace(/"/g, '""'),
    ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `记账数据_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
