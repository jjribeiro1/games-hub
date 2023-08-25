'use client';
import React from 'react';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { FiChevronDown } from 'react-icons/fi';
import useFetchGenres from '@/hooks/useFetchGenres';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import { Button } from '../ui/button';

export default function NavBar() {
  const { genres } = useFetchGenres();
  const { platforms } = useFetchPlatforms();

  return (
    <NavigationMenu.Root className="w-full flex items-center justify-between pb-1">
      <NavigationMenu.List className="flex items-center gap-10">
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger
            className="text-mine-shaft-200 text-base sm:text-lg group flex items-center gap-2 "
            onPointerMove={(e) => e.preventDefault()}
            onPointerLeave={(e) => e.preventDefault()}
          >
            Genres
            <FiChevronDown className="group-data-[state=open]:-rotate-180 transition-transform" />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content
            className="bg-mine-shaft-700 w-40 z-20 absolute top-10 left-1/2 -translate-x-1/2"
            onPointerEnter={(e) => e.preventDefault()}
            onPointerLeave={(e) => e.preventDefault()}
          >
            <ul className=" text-sm sm:text-base flex flex-col divide-y divide-mine-shaft-500">
              {genres?.map((genre) => (
                <li
                  key={genre.slug}
                  className="
              bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-sm
                flex items-center cursor-pointer"
                >
                  <Link href={`/games/${genre.slug}`} className="w-full p-2 inline-block">
                    {genre.name}
                  </Link>
                </li>
              ))}
              <li
                className='bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-sm
                flex items-center cursor-pointer"'
              >
                <Link href={'/genres'} className="w-full p-2 inline-block">
                  Show all genres
                </Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger
            className="text-mine-shaft-200 text-base sm:text-lg group flex items-center gap-2 "
            onPointerMove={(e) => e.preventDefault()}
            onPointerLeave={(e) => e.preventDefault()}
          >
            Platforms
            <FiChevronDown className="group-data-[state=open]:-rotate-180 transition-transform" />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content
            className="w-40 z-20 absolute top-10 left-1/2 -translate-x-1/2"
            onPointerEnter={(e) => e.preventDefault()}
            onPointerLeave={(e) => e.preventDefault()}
          >
            <ul className=" text-sm sm:text-base flex flex-col divide-y divide-mine-shaft-500">
              {platforms?.map((platform) => (
                <li
                  key={platform.slug}
                  className="
              bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-sm
               flex items-center cursor-pointer"
                >
                  <Link href={`/games/${platform.slug}`} className="w-full p-2 inline-block">
                    {platform.name}
                  </Link>
                </li>
              ))}
              <li
                className="
              bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-sm
               flex items-center cursor-pointer"
              >
                <Link href={'/platforms'} className="w-full p-2 inline-block">
                  Show all platforms
                </Link>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div>
        <ul className="flex gap-2">
          <li>
            <Button type="button" variant={'link'} asChild className='text-mine-shaft-200 hover:text-mine-shaft-300 text-base sm:text-lg'>
              <Link href={'/login'}>Login</Link>
            </Button>
          </li>
          <li>
            <Button type="button" variant={'link'} asChild className='text-mine-shaft-200 hover:text-mine-shaft-300 text-base sm:text-lg'>
              <Link href={'/register'}>Register</Link>
            </Button>
          </li>
        </ul>
      </div>
    </NavigationMenu.Root>
  );
}
