'use client'
import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { FiChevronDown } from 'react-icons/fi';
import useFetchGames from '@/hooks/useFetchGames';

export default function NavBar() {
  const { genres } = useFetchGames();

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex p-1">
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger
            className="text-mine-shaft-200 text-base sm:text-lg group flex items-center gap-2 "
            onPointerMove={(e) => e.preventDefault()}
            onPointerLeave={(e) => e.preventDefault()}
          >
            Free Games
            <FiChevronDown className="group-data-[state=open]:-rotate-180 transition-transform" />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content
            className="w-40 z-20 absolute top-10 left-2/3 -translate-x-1/2 -translate-y-1-2"
            onPointerEnter={(e) => e.preventDefault()}
            onPointerLeave={(e) => e.preventDefault()}
          >
            <ul className=" text-sm sm:text-base flex flex-col divide-y divide-mine-shaft-500">
              {Array.from(genres).map((genre, i) => (
                <li
                  key={i}
                  className="
              bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100
               pl-4 py-2 cursor-pointer"
                >
                  {genre}
                </li>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
