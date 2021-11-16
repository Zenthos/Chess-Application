import React from 'react';
import { SvgIcon, ButtonProps } from '@mui/material';
import { Store, LibraryBooks, Info, Extension, Login, GroupAdd, Forum } from '@mui/icons-material';

interface OptionType {
  path: string;
  text: string;
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  Icon?: typeof SvgIcon;
}

export const navOptions: OptionType[] = [
  {
    path: '/shop',
    text: 'Shop',
    Icon: Store,
  },
  {
    path: '/how-to-play',
    text: 'How To Play',
    Icon: LibraryBooks,
  },
  {
    path: '/about',
    text: 'About',
    Icon: Info,
  },
  {
    path: '/forum',
    text: 'Forum',
    Icon: Forum,
  },
  {
    path: '/play',
    text: 'Play Chess',
    Icon: Extension,
  },
  {
    path: '/login',
    text: 'Login',
    Icon: Login,
  },
  {
    path: '/register',
    text: 'Sign Up',
    variant: 'contained',
    color: 'secondary',
    Icon: GroupAdd,
  }
];
