import React from 'react';
import Logo from '../ui/logo';
import { NavBar } from './index';

export default function Header() {
  return (
    <header className="bg-mine-shaft-900 flex items-center px-4 py-2">
      <Logo />
      <NavBar />
    </header>
  );
}
