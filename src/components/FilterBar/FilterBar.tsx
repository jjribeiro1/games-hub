'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import useFetchGenres from '@/hooks/useFetchGenres';
import { useParams, useRouter } from 'next/navigation';
import { formatGenrePath, getOriginalGenreName } from '@/utils/format-genre-path';
import { Button } from '../ui/button';
import { BiCheckboxChecked } from 'react-icons/bi';
import { FiChevronDown } from 'react-icons/fi';

export default function FilterBar() {
  const { platforms } = useFetchPlatforms();
  const { genres } = useFetchGenres();
  const params = useParams();
  const router = useRouter();

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
                All Platforms
                <FiChevronDown className="text-cyan-700 w-6 h-6" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="w-48">
              {platforms?.map((platform) => (
                <DropdownMenuItem key={platform.id}>{platform.name}</DropdownMenuItem>
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
                {getOriginalGenreName(params.genre as string)}{' '}
                <FiChevronDown className="text-cyan-700 w-6 h-6" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="w-48">
              {genres?.map((genre) => (
                <DropdownMenuItem
                  key={genre.id}
                  onClick={() => router.push(`/games/${formatGenrePath(genre.name)}`)}
                >
                  {genre.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </div>
  );
}
