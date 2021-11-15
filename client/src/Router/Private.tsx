import React from 'react';
import * as Pages from 'src/Pages';
import { DefaultLayout } from 'src/Layouts';

interface ProtectedRoute {
  key: string;
  path: string;
  redirect: string;
  element: React.ReactElement;
}

export const PrivateRoutes: ProtectedRoute[] = [
  {
    key: 'FriendsPage',
    path: '/friends',
    redirect: '/login',
    element: DefaultLayout(Pages.Friends),
  },
  {
    key: 'SettingsPage',
    path: '/settings',
    redirect: '/login',
    element: DefaultLayout(Pages.Settings),
  },
  {
    key: 'ProfilePage',
    path: '/profile/:username',
    redirect: '/login',
    element: DefaultLayout(Pages.Profile),
  },
];
