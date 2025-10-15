import React from 'react';
import { createBrowserRouter } from 'react-router';

import { protectedLoader } from '../hooks/useProtectedLoader';
import { loadAllUsers } from '@/services/loaders/loadAllUsers';
import { loadUserById } from '@/services/loaders';

// Layout
const AppLayout = React.lazy(() => import('@/components/layout/app-layout'));

// Pages
const LandingPage = React.lazy(() => import('@/routes/landing-page'));
const AppPage = React.lazy(() => import('@/routes/app/app-page'));
const ForumPage = React.lazy(() => import('@/routes/app/forum-page'));
const ProfilePage = React.lazy(() => import('@/routes/app/profile-page'));
const SettingsPage = React.lazy(() => import('@/routes/app/settings-page'));
const UpdatesPage = React.lazy(() => import('@/routes/app/updates-page'));

const UsersPage = React.lazy(() => import('@/routes/app/users/users-page'));
const UserDetail = React.lazy(() => import('@/routes/app/users/user-detail'));

const RegisterPage = React.lazy(() => import('@/routes/auth/register'));
const LoginPage = React.lazy(() => import('@/routes/auth/login'));

// Error
const NotFound = React.lazy(() => import('@/routes/not-found'));

const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/auth/register',
    Component: RegisterPage,
  },
  {
    path: '/auth/login',
    Component: LoginPage,
  },

  {
    path: 'app',
    loader: protectedLoader,
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: AppPage,
      },
      {
        path: 'settings',
        Component: SettingsPage,
      },
      {
        path: 'updates',
        Component: UpdatesPage,
      },
      {
        path: 'profile',
        Component: ProfilePage,
      },
      {
        path: 'forum',
        Component: ForumPage,
      },
      {
        path: 'users',
        Component: UsersPage,
        loader: loadAllUsers,
        children: [
          {
            path: ':id',
            Component: UserDetail,
            loader: loadUserById,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    Component: NotFound,
  },
]);

export default router;
