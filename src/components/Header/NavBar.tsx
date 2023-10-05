'use client';
import React from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { RxHamburgerMenu } from 'react-icons/rx';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import useFetchGenres from '@/hooks/useFetchGenres';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import { useAuthContext } from '@/context/auth-context';
import { logout } from '@/services/authentication';

export default function NavBar() {
  const { genres } = useFetchGenres();
  const { platforms } = useFetchPlatforms();
  const { currentUser } = useAuthContext();

  return (
    <NavigationMenu.Root className="w-full flex items-center justify-between pb-2">
      <NavigationMenu.List className="flex items-center gap-3 sm:gap-5 md:gap-10">
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger
            className="text-mine-shaft-200 text-sm sm:text-base md:text-lg group flex items-center gap-2 "
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
                  <NavigationMenu.Link asChild>
                    <Link href={`/games/${genre.slug}`} className="w-full p-2 inline-block">
                      {genre.name}
                    </Link>
                  </NavigationMenu.Link>
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
            className="text-mine-shaft-200 text-sm sm:text-base md:text-lg group flex items-center gap-2 "
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
                  <NavigationMenu.Link asChild>
                    <Link href={`/games/${platform.slug}`} className="w-full p-2 inline-block">
                      {platform.name}
                    </Link>
                  </NavigationMenu.Link>
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

      <div className="sm:flex sm:items-center sm:gap-2">
        {currentUser ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className="mr-5" asChild>
                <Avatar className="h-7 w-7 sm:w-9 sm:h-9">
                  <AvatarFallback
                    className="bg-mine-shaft-100 hover:bg-mine-shaft-200 text-mine-shaft-900 sm:text-lg font-semibold capitalize 
              cursor-pointer"
                  >
                    {currentUser.displayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="border border-mine-shaft-500 divide-y divide-mine-shaft-500 p-0">
                <DropdownMenuItem className="p-0 bg-mine-shaft-700 hover:bg-mine-shaft-800" asChild>
                  <Link
                    href={`/my-library`}
                    className="bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100 justify-center 
                    text-xs py-2 w-full cursor-pointer"
                  >
                    My Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100 justify-center 
                    text-xs py-2 w-full cursor-pointer"
                >
                  logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant={'link'}
              asChild
              className="hidden sm:inline-flex text-mine-shaft-200 hover:text-mine-shaft-300 text-sm sm:text-base md:text-lg"
            >
              <Link href={'/login'}>Login</Link>
            </Button>

            <Button
              type="button"
              variant={'link'}
              asChild
              className="hidden sm:inline-flex text-mine-shaft-200 hover:text-mine-shaft-300 text-sm sm:text-base md:text-lg"
            >
              <Link href={'/register'}>Register</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="sm:hidden">
                <RxHamburgerMenu className="text-mine-shaft-200 h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border border-mine-shaft-500 divide-y divide-mine-shaft-500 p-0 rounded">
                <DropdownMenuItem className="p-0 bg-mine-shaft-700 hover:bg-mine-shaft-800" asChild>
                  <Link
                    href={'/login'}
                    className="bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100 justify-center 
                    text-xs py-2 w-full cursor-pointer"
                  >
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0 bg-mine-shaft-700 hover:bg-mine-shaft-800" asChild>
                  <Link
                    href={'/register'}
                    className="bg-mine-shaft-700 hover:bg-mine-shaft-800 text-mine-shaft-50 hover:text-mine-shaft-100 justify-center 
                    text-xs py-2 w-full cursor-pointer"
                  >
                    Register
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </NavigationMenu.Root>
  );
}
