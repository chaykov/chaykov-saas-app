import { Outlet } from 'react-router';

export const Component = function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1">
        <main className="flex-1 bg-gray-50 p-6">
          <h1>Auth</h1>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
