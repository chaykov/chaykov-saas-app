import { Outlet } from 'react-router';

import Sidebar from '@/components/common/Sidebar';
import Navbar from '@/components/common/Navbar';
import React from 'react';

export default function AppLayout() {
  return (
    <div className="bg-gray-100 h-screen flex p-2">
      {/* Change background, text and sizing for sidebar */}
      <div className="custom-app-layout w-64 sticky top-2 h-[calc(100vh-1rem)] p-6">
        <Sidebar />
      </div>

      {/* Full width for navbar and outlet */}
      <div className="flex flex-col flex-1 ml-2">
        {/* Change background, text and sizing for Navbar */}
        <div className="custom-app-layout h-12 p-2 mb-2 shrink-0">
          <Navbar />
        </div>

        {/* Change background, text and sizing for Outlet */}
        <div className="custom-app-layout overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 p-2 flex-1">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
