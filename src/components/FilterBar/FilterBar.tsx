'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { BiCheckboxChecked } from 'react-icons/bi';
import { FiChevronDown } from 'react-icons/fi';
import { Genre } from '@/types/genre';
import { Platform } from '@/types/platform';

interface FilterBarProps {
  genres: Genre[];
  genreSlug: string;
  mappedGenres: Map<string, string>;
  platforms: Platform[];
  platformSlug: string | null;
  mappedPlatforms: Map<string, string>;
}

export default function FilterBar({
  genres,
  genreSlug,
  mappedGenres,
  platforms,
  platformSlug,
  mappedPlatforms,
}: FilterBarProps) {
  const [activeSortOption, setActiveSortOption] = useState('Relevance');
  const sortOptions = ['Relevance', 'Release Date', 'Alphabetical'];

  return (
    <div className="w-full flex items-center gap-4">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-inherit hover:bg-inherit ring-mine-shaft-300/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mine-shaft-300/50 focus-visible:ring-offset-1">
              <span className="text-mine-shaft-400 font-semibold flex items-center">
                Platform: <BiCheckboxChecked className="text-cyan-700 w-6 h-6" />
              </span>

              <span className="text-mine-shaft-200 flex items-center ml-1">
                {platformSlug ? mappedPlatforms.get(platformSlug) : 'All Platforms'}
                <FiChevronDown className="text-cyan-700 w-6 h-6" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="w-48 bg-mine-shaft-100">
              {platforms?.map((platform) => (
                <DropdownMenuItem
                  key={platform.id}
                  className="text-mine-shaft-950 font-medium focus:bg-mine-shaft-800 focus:text-mine-shaft-100 rounded"
                >
                  <Link href={`/games/${platform.slug}/${genreSlug}`} className="w-full">
                    {platform.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-inherit hover:bg-inherit ring-mine-shaft-300/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mine-shaft-300/50 focus-visible:ring-offset-1">
              <span className="text-mine-shaft-400 font-semibold flex items-center">
                Genre: <BiCheckboxChecked className="text-cyan-700 w-6 h-6" />
              </span>

              <span className="text-mine-shaft-200 flex items-center ml-1">
                {mappedGenres.get(genreSlug)}
                <FiChevronDown className="text-cyan-700 w-6 h-6" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="w-48 bg-mine-shaft-100">
              {genres?.map((genre) => (
                <DropdownMenuItem
                  key={genre.id}
                  className="text-mine-shaft-950 font-medium focus:bg-mine-shaft-800 focus:text-mine-shaft-100 rounded"
                >
                  <Link
                    href={platformSlug ? `/games/${platformSlug}/${genre.slug}` : `/games/${genre.slug}`}
                    className="w-full"
                  >
                    {genre.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-inherit hover:bg-inherit ring-mine-shaft-300/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mine-shaft-300/50 focus-visible:ring-offset-1">
              <span className="text-mine-shaft-400 font-semibold flex items-center">
                Sort By: <BiCheckboxChecked className="text-cyan-700 w-6 h-6" />
              </span>

              <span className="text-mine-shaft-200 flex items-center ml-1">
                {activeSortOption}
                <FiChevronDown className="text-cyan-700 w-6 h-6" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="w-48 bg-mine-shaft-100">
              {sortOptions?.map((option) => (
                <DropdownMenuItem
                  key={option}
                  className="text-mine-shaft-950 font-medium focus:bg-mine-shaft-800 focus:text-mine-shaft-100 rounded"
                  onClick={() => setActiveSortOption(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </div>
  );
}
