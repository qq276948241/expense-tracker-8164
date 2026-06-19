import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="p-8 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
