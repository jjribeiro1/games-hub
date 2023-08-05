'use client';
import React from 'react';
import Image from 'next/image';
import { BsWindows } from 'react-icons/bs';
import { usePathname } from 'next/navigation';
import { getOriginalGenreName } from '@/utils/format-genre-path';
import { GamesFilters } from '@/types/games-filters';
import { useQuery } from '@tanstack/react-query';
import { getGamesByFilters } from '@/services/game';
import { Game } from '@/types/game';

export default function GamesGenrePage() {
  const pathname = usePathname();
  const originalGenre = getOriginalGenreName(pathname.split('games/')[1]) as string;

  const filters: GamesFilters = {
    fieldPath: 'genre',
    operator: '==',
    value: originalGenre,
  };

  const fetcher = async (filter: GamesFilters) => {
    const games = await getGamesByFilters(filter);
    return games.docs.map((doc) => doc.data()) as Game[];
  };

  const { data } = useQuery({
    queryKey: ['fetch-games', filters],
    queryFn: () => fetcher(filters),
  });

  return (
    <section className="flex flex-col gap-8 mt-6">
      <h1 className="text-mine-shaft-200 text-center">Top Free MMORPG Games for PC and Browser In 2023!</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-y-4 gap-x-2 px-1 sm:px-4">
        {data?.map((game, i) => (
          <li
            key={i}
            className="bg-mine-shaft-900 w-60 h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-md cursor-pointer"
          >
            <Image
              className="aspect-video rounded-t-md"
              src={game.thumbnail}
              alt={`imagem do jogo ${game.title}`}
              width={320}
              height={180}
              priority
            />

            <div className="flex flex-col gap-2 p-2">
              <p className="text-mine-shaft-200">{game.title}</p>
              <p className="text-mine-shaft-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
                {game.short_description}
              </p>

              <div className="text-mine-shaft-200 flex items-center gap-2 self-end lg:mt-3">
                <span className="text-xs lg:text-sm bg-mine-shaft-600 px-1 rounded">{game.genre}</span>
                <span>
                  {game.platform === 'Windows' ? (
                    <BsWindows className="text-mine-shaft-400 w-5 h-5" />
                  ) : (
                    'Windows'
                  )}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
