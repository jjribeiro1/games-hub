import React from 'react';
import Logo from '../ui/logo';
import { NavBar } from './index';

export default function Header() {
  return (
    <header className="bg-mine-shaft-900 flex items-center gap-6 px-4">
      <Logo />
      <NavBar />
    </header>
  );
}
