import { useAuthStore } from "@/store/authStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      {/* Welcome card */}
      <div className="bg-linear-to-r from-indigo-400 to-indigo-600 text-white rounded-lg p-4 shadow-md">
        <h1 className="text-2xl font-bold mb-2">Hello, {user?.username}!</h1>
        <p className="text-indigo-100">
          You are logged in this application. Let's start to explore posts and
          users.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="My posts" value="7" icon="📝" />
        <StatCard label="Followers" value="123" icon="👥" />
        <StatCard label="Following" value="245" icon="⭐" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionCard
          title="See posts"
          description="Explore interesting posts from other users"
          icon="📰"
          onClick={() => navigate({ to: "/dashboard/posts" })}
        />
        <QuickActionCard
          title="Search users"
          description="Find and follow interesting profiles"
          icon="🔍"
          onClick={() => navigate({ to: "/dashboard/users" })}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-md py-2 px-4 shadow-xs border flex items-center justify-between border-gray-200">
      <div className="text-2xl">{icon}</div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-1xl font-bold">{value}</p>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-md p-6 shadow-xs border border-gray-200 hover:border-blue-300 hover:shadow-lg transition text-left"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-4xl mb-3">{icon}</div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        </div>
        <ArrowRight className="text-indigo-600 shrink-0" size={24} />
      </div>
    </button>
  );
}
