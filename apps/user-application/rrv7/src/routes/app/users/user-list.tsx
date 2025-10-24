import { NavLink, useLoaderData } from 'react-router';

import type { loadAllUsers } from '@/services/loaders';

export default function UserList() {
  const users = useLoaderData<typeof loadAllUsers>();

  if (users.length === 0) {
    return (
      <div className="border rounded-md h-full p-4 flex items-center justify-center">
        <p className="text-gray-500">No users</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md h-full p-2 overflow-y-auto">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {users.map((user) => (
          <li key={user.id}>
            <NavLink
              viewTransition
              to={`${user.id}`}
              aria-label={`View ${user.name} profile`}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-sm border transition-colors ${
                  isActive
                    ? 'bg-indigo-300 text-white shadow-xs'
                    : 'hover:bg-gray-100 border-transparent'
                }`
              }
            >
              {/* Avatar placeholder - w przyszłości <img src={user.avatar} /> */}
              {user.name && (
                <div
                  className="size-12 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold"
                  aria-label={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
