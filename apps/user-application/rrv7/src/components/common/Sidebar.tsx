import { Separator } from '@/components/ui/separator';
import React from 'react';
import { NavLink } from 'react-router';
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
        {links.map((link) => (
          <React.Fragment key={link.href}>
            <NavLink
              to={link.href}
              end={link.href === '/app'}
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-400 font-medium border-l-2 border-blue-400 pl-2'
                  : 'text-gray-600/90 hover:text-black'
              }
            >
              {link.name}
            </NavLink>
            <span className="text-xs flex text-gray-600/90 select-none">
              {link.description}
            </span>
            <Separator orientation="horizontal" className="bg-gray-200/40" />
          </React.Fragment>
        ))}
      </nav>
    </>
  );
}
