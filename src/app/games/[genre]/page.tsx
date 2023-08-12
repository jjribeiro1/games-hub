'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { GameCard } from '@/components/GameCard';
import useFetchGamesByGenre from '@/hooks/useFetchGamesByGenre';
import { getOriginalGenreName } from '@/utils/format-genre-path';
import { FilterBar } from '@/components/FilterBar';

export default function GamesGenrePage() {
  const params = useParams();
  const originalGenre = getOriginalGenreName(params.genre as string) as string;
  const { games } = useFetchGamesByGenre(originalGenre);

  const headingText = () => {
    return `Top Free ${originalGenre} ${
      originalGenre.includes(' Game') ? '' : 'games'
    } for Pc and Browser in ${new Date().getFullYear()}`;
  };

  return (
    <main className="flex flex-col items-center gap-8 mt-6 px-4 w-full">
      <h1 className="text-mine-shaft-200 text-xl">{headingText()}</h1>

      <section className="">
        <FilterBar />
      </section>

      <section className="w-full px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-4">
          {games?.map((game, i) => (
            <li key={i}>
              <GameCard game={game} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
