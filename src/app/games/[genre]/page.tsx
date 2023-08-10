'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { GameCard } from '@/components/GameCard';
import useFetchGamesByGenre from '@/hooks/useFetchGamesByGenre';
import { getOriginalGenreName } from '@/utils/format-genre-path';

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
    <section className="flex flex-col gap-8 mt-6">
      <h1 className="text-mine-shaft-200 text-xl text-center">{headingText()}</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-y-4 gap-x-2 px-1 sm:px-4">
        {games?.map((game, i) => (
          <li key={i}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </section>
  );
}
