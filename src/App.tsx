import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Categories from '@/pages/Categories';
import Budget from '@/pages/Budget';
import Settings from '@/pages/Settings';
import { useTransactionStore } from '@/store/useTransactionStore';
import { generateMockTransactions } from '@/utils/seed';

function App() {
  const hydrated = useTransactionStore((s) => s.hydrated);
  const hasSeeded = useTransactionStore((s) => s.hasSeeded);
  const transactions = useTransactionStore((s) => s.transactions);
  const setState = useTransactionStore.setState;

  useEffect(() => {
    if (hydrated && !hasSeeded && transactions.length === 0) {
      setState({
        transactions: generateMockTransactions(),
        hasSeeded: true,
      });
    }
  }, [hydrated, hasSeeded, transactions.length, setState]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="budget" element={<Budget />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
