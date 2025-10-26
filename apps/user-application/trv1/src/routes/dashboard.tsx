import { useState } from "react";
import {
  createFileRoute,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";

import {
  Home,
  MessageSquare,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
} from "@/components/icons";

import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newNotification] = useState(true);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/", replace: true });
  };

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Posts", icon: MessageSquare, path: "/dashboard/posts" },
    { label: "Users", icon: Users, path: "/dashboard/users" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0"} bg-white text-gray-800 transition-all duration-300 overflow-hidden`}
      >
        <div className="h-full flex flex-col border-r border-gray-200">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Polytalko</h1>
            <p className="text-gray-400 text-sm mt-1">Mini Social Media</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition text-left ${location.pathname === item.path ? "bg-gray-600 text-gray-50" : "hover:bg-gray-200"}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User profile mini */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user?.username}
                </p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 text-white py-2 bg-gray-800 hover:bg-gray-600 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Header actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <Bell size={20} />
              <span
                className={`absolute top-1 right-1 w-2 h-2 rounded-full ${newNotification ? "bg-green-500" : "bg-red-500"}`}
              ></span>
            </button>

            {/* Theme toggle */}
            {/* <div className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer transition"></div> */}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
