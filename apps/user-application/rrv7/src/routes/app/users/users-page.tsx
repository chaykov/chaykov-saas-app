import { NavLink, useLoaderData } from 'react-router';

import type { loadAllUsers } from '@/services/loaders';

export default function UsersPage() {
  const users = useLoaderData<typeof loadAllUsers>();

  return (
    // <div className="flex flex-col bg-red-200">
    //   {/* Search filter */}
    //   <div className="bg-green-200 flex-1">X</div>

    //   <div>
    //     {/* Section left */}
    //     <ul className="flex flex-row flex-1">
    //       {users.map((user) => (
    //         <li key={user.id} className="bg-blue-200">
    //           <NavLink
    //             to={`${user.id}`}
    //             className={({ isActive }) =>
    //               `block px-3 py-2 rounded-md transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
    //             }
    //           >
    //             {user.name} - {user.country}
    //           </NavLink>
    //         </li>
    //       ))}
    //     </ul>

    //     {/* Section right */}
    //     <div className="flex flex-row flex-1">{<Outlet />}</div>
    //   </div>
    // </div>

    // <div className="flex flex-col h-full space-y-2">
    //   {/* Section filter */}
    //   <div className="bg-red-200 p-2">section filter</div>

    //   <div className="flex flex-1 space-x-2">
    //     {/* Section main users on the left */}
    //     <div className="w-1/3 bg-green-200 p-2">
    //       <ul className="flex gap-2 flex-wrap">
    //         {users.map((user) => (
    //           <li key={user.id} className="bg-yellow-200">
    //             <NavLink
    //               to={`${user.id}`}
    //               className={({ isActive }) =>
    //                 `block px-3 py-2 transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
    //               }
    //             >
    //               {user.name}
    //             </NavLink>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //     {/* Section main user detail on the right */}
    //     <div className="flex-1 bg-blue-200 p-2">main user detail</div>
    //   </div>
    // </div>

    <div className="flex flex-col h-full space-y-2">
      {/* Section filter */}
      <div className="bg-red-200 p-2">section filter test</div>

      <div className="flex flex-1 space-x-2">
        {/* Section main users on the left */}
        <div className="w-1/3 bg-green-200 p-2">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 place-items-stretch">
            {users.map((user) => (
              <li
                key={user.id}
                className="bg-yellow-200 shadow-sm hover:shadow-md transition aspect-square"
              >
                <NavLink
                  to={`${user.id}`}
                  className={({ isActive }) =>
                    `flex h-full w-full items-center justify-center text-center transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
                  }
                >
                  {user.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        {/* Section main user detail on the right */}
        <div className="flex-1 bg-blue-200 p-2">main user detail</div>
      </div>
    </div>
  );
}
