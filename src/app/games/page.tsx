'use client';
import React from 'react';
import useFetchAllGames from '@/hooks/useFetchAllGames';
import { GameCard } from '@/components/GameCard';

export default function GamesPage() {
  const { games } = useFetchAllGames();

  return (
    <section className="w-full px-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-x-4 gap-y-6">
        {games?.map((game) => (
          <li key={game.id}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </section>
  );
}
