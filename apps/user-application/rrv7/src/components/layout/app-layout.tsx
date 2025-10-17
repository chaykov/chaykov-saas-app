import { Suspense } from 'react';
import { Outlet } from 'react-router';

import Sidebar from '@/components/common/Sidebar';
import Navbar from '@/components/common/Navbar';

export default function AppLayout() {
  return (
    <div className="bg-indigo-100 min-h-screen flex p-2 gap-2">
      {/* Change background, text and sizing for sidebar */}
      <aside className="hidden md:block w-64 sticky top-2 h-[calc(100vh-1rem)] shrink-0">
        <div className="custom-app-layout h-full p-6 overflow-y-auto">
          <Sidebar />
        </div>
      </aside>

      {/* Full width for navbar and outlet */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Change background, text and sizing for Navbar */}
        <header className="custom-app-layout p-2 mb-2 shrink-0">
          <Navbar />
        </header>

        {/* Change background, text and sizing for Outlet */}
        <main className="custom-app-layout p-2 flex-1 overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-full">
                <div className="text-gray-600 animate-pulse">Loading...</div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
