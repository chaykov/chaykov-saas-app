import { NavLink } from 'react-router';

import { Separator } from '@/components/ui/separator';
import Reordering from './Reordering';

export default function Sidebar() {
  const links = [
    { name: 'App', description: 'Your main overview', href: '/app' },
    {
      name: 'Profile',
      description: 'View and edit your profile',
      href: '/app/profile',
    },
    {
      name: 'Users',
      description: 'Find and connect with users',
      href: '/app/users',
    },
    {
      name: 'Forum',
      description: 'Join the community discussions',
      href: '/app/forum',
    },
    {
      name: 'Settings',
      description: 'Adjust your preferences',
      href: '/app/settings',
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Polytalko
        </h2>
        <Reordering />
      </div>
      <Separator className="my-4" />
      <nav className="flex flex-col space-y-2">
        {links.map((link, index) => (
          <div key={link.href}>
            <NavLink
              to={link.href}
              end={link.href === '/app'}
              aria-label={`You see ${link.href} is ${link.name}`}
              className={({ isActive }) =>
                isActive
                  ? 'text-indigo-600 font-medium border-l-2 border-indigo-400 pl-2 block'
                  : 'text-slate-600 hover:text-indigo-600 block'
              }
            >
              <span className="block">{link.name}</span>
              <span className="text-xs text-gray-600/90 block mt-0.5">
                {link.description}
              </span>
            </NavLink>
            {index < links.length - 1 && (
              <Separator orientation="horizontal" className="bg-gray-200/40" />
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
