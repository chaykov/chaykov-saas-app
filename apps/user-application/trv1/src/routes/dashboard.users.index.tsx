import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import { formatDate } from "@/lib/formatters";

export const Route = createFileRoute("/dashboard/users/")({
  component: UsersIndex,
});

function UsersIndex() {
  const navigate = useNavigate();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: apiClient.getUsers,
  });

  if (isLoading) return <div className="p-4">Loading users...</div>;
  if (error)
    return (
      <div className="p-4 text-red-600">
        Error loading users: {error.message}
      </div>
    );
  if (!users || users.length === 0)
    return <div className="p-4">No users found</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      {/* Users list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user: any) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-md shadow-xs hover:shadow-md cursor-pointer transition"
            onClick={() => navigate({ to: `/dashboard/users/${user.id}` })}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.username}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {user.bio && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {user.bio}
              </p>
            )}

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Joined {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
