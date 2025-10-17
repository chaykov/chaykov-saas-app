import { Outlet } from 'react-router';

import UserList from './user-list';

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full space-y-2">
      <title>PolyTalko - Users</title>
      <div className="flex flex-1 gap-2">
        {/* Section main users on the left */}
        <div className="flex">
          <UserList />
        </div>
        {/* Section main user detail on the right */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
