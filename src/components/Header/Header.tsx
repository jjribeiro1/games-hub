import React from 'react';
import Logo from '../ui/logo';
import { NavBar } from './index';

export default function Header() {
  return (
    <header className="bg-mine-shaft-900 px-4">
      <div className="flex items-center gap-6 w-full max-w-[1440px] px-4 my-0 mx-auto">
        <Logo />
        <NavBar />
      </div>
    </header>
  );
}
