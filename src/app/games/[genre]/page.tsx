'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { GameCard } from '@/components/GameCard';
import { getGamesByFilters } from '@/services/game';
import { getOriginalGenreName } from '@/utils/format-genre-path';
import { GamesFilters } from '@/types/games-filters';
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
    const data = await getGamesByFilters(filter);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Game[];
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
          <li key={i}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </section>
  );
}
