import React from 'react';
import * as Pages from 'src/Pages';
import {
  DefaultLayout,
  NavOnlyLayout,
  NoContainerLayout
} from 'src/Components/Layouts';

interface Route {
  key: string;
  path: string;
  element: React.ReactElement;
}

export const PublicRoute: Route[] = [
  {
    key: 'HomePage',
    path: '/',
    element: DefaultLayout(Pages.Home),
  },
  {
    key: 'TutorialPage',
    path: '/how-to-play',
    element: DefaultLayout(Pages.Tutorial),
  },
  {
    key: 'PlayPage',
    path: '/play',
    element: NoContainerLayout(Pages.Play),
  },
  {
    key: 'PracticePage',
    path: '/practice',
    element: NoContainerLayout(Pages.Practice),
  },
  {
    key: 'ShopPage',
    path: '/shop',
    element: DefaultLayout(Pages.Shop),
  },
  {
    key: 'AboutPage',
    path: '/about',
    element: DefaultLayout(Pages.About),
  },
  {
    key: 'SearchPage',
    path: '/search',
    element: DefaultLayout(Pages.Search),
  },
  {
    key: 'ForumHub',
    path: '/forum',
    element: DefaultLayout(Pages.ForumHub),
  },
  {
    key: 'ForumCategory',
    path: '/forum/:category',
    element: DefaultLayout(Pages.Category),
  },
  {
    key: 'ForumThread',
    path: '/forum/:category/:thread',
    element: DefaultLayout(Pages.Thread),
  },
  {
    key: 'LoginPage',
    path: '/login',
    element: NavOnlyLayout(Pages.Login),
  },
  {
    key: 'RegisterPage',
    path: '/register',
    element: NavOnlyLayout(Pages.Register),
  },
  {
    key: '404Page',
    path: '*',
    element: DefaultLayout(() => (
      <h1 className="text-center m-3">ERROR 404 NOT FOUND</h1>
    )),
  }
];
