'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BiCheckboxChecked } from 'react-icons/bi';
import { FiChevronDown } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import useVerifyGamesPageUrlfrom from '@/hooks/useVerifyGamesPageUrl';
import { Genre } from '@/types/genre';
import { Platform } from '@/types/platform';

interface FilterBarProps {
  genres: Genre[];
  mappedGenres: Map<string, string>;
  platforms: Platform[];
  mappedPlatforms: Map<string, string>;
}

export default function FilterBar({ genres, mappedGenres, platforms, mappedPlatforms }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { platformSlug, genreSlug, activeSortBy, searchParams } = useVerifyGamesPageUrlfrom();

  const sortByQueryStringMap = new Map<string, { name: string; slug: string }>([
    ['relevance', { name: 'Relevance', slug: 'relevance' }],
    ['release_date', { name: 'Release Date', slug: 'release_date' }],
    ['alphabetical', { name: 'Alphabetical', slug: 'alphabetical' }],
  ]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleSortByClick = (option: string) => {
    router.push(pathname + '?' + createQueryString('sort_by', option));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-inherit hover:bg-inherit ring-mine-shaft-300/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mine-shaft-300/50 focus-visible:ring-offset-1">
            <span className="text-mine-shaft-400 text-xs sm:text-sm md:text-base font-semibold flex items-center">
              Platform: <BiCheckboxChecked className="text-cyan-700 w-5 h-5 sm:w-6 sm:h-6" />
            </span>

            <span className="text-mine-shaft-200 text-xs md:text-base flex items-center ml-1">
              {platformSlug ? mappedPlatforms.get(platformSlug) : 'All Platforms'}
              <FiChevronDown className="text-cyan-700 w-5 h-5 sm:w-6 sm:h-6" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="w-48 bg-mine-shaft-100">
            {platforms?.map((platform) => (
              <DropdownMenuItem
                key={platform.id}
                asChild
                className="text-mine-shaft-950 font-medium focus:bg-mine-shaft-800 focus:text-mine-shaft-100 rounded cursor-pointer"
              >
                <Link
                  href={genreSlug ? `/games/${platform.slug}/${genreSlug}` : `/games/${platform.slug}`}
                  className="w-full"
                >
                  {platform.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              asChild
              className="text-mine-shaft-950 font-medium focus:bg-mine-shaft-800 focus:text-mine-shaft-100 rounded cursor-pointer"
            >
              <Link href={`/games/${genreSlug ?? ''}`}>All platforms</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-inherit hover:bg-inherit ring-mine-shaft-300/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mine-shaft-300/50 focus-visible:ring-offset-1">
            <span className="text-mine-shaft-400 text-xs sm:text-sm md:text-base font-semibold flex items-center">
              Genre: <BiCheckboxChecked className="text-cyan-700 w-5 h-5 sm:w-6 sm:h-6" />
            </span>

            <span className="text-mine-shaft-200 text-xs md:text-base flex items-center ml-1">
              {genreSlug ? mappedGenres.get(genreSlug) : 'All genres'}
              <FiChevronDown className="text-cyan-700 w-5 h-5 sm:w-6 sm:h-6" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="w-48 bg-mine-shaft-100">
            {genres?.map((genre) => (
              <DropdownMenuItem
                key={genre.id}
                asChild
                className="text-mine-shaft-950 font-medium focus:bg-mine-shaft-800 focus:text-mine-shaft-100 rounded cursor-pointer"
              >
                <Link
                  href={platformSlug ? `/games/${platformSlug}/${genre.slug}` : `/games/${genre.slug}`}
                  className="w-full"
                >
                  {genre.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              asChild
              className="text-mine-shaft-950 font-medium focus:bg-mine-shaft-800 focus:text-mine-shaft-100 rounded cursor-pointer"
            >
              <Link href={`/games/${platformSlug ?? ''}`}>All genres</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-inherit hover:bg-inherit ring-mine-shaft-300/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mine-shaft-300/50 focus-visible:ring-offset-1">
            <span className="text-mine-shaft-400 text-xs sm:text-sm md:text-base font-semibold flex items-center">
              Sort By: <BiCheckboxChecked className="text-cyan-700 w-5 h-5 sm:w-6 sm:h-6" />
            </span>

            <span className="text-mine-shaft-200 text-xs md:text-base flex items-center ml-1">
              {activeSortBy ? sortByQueryStringMap.get(activeSortBy)?.name : 'Relevance'}
              <FiChevronDown className="text-cyan-700 w-5 h-5 sm:w-6 sm:h-6" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="w-48 bg-mine-shaft-100">
            {Array.from(sortByQueryStringMap.values()).map((option) => (
              <DropdownMenuItem
                key={option.name}
                className="text-mine-shaft-950 font-medium focus:bg-mine-shaft-800 focus:text-mine-shaft-100 rounded cursor-pointer"
                onClick={() => handleSortByClick(option.slug)}
              >
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
}
