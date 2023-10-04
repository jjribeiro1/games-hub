'use client';
import useFetchRecentGames from '@/hooks/useFetchRecentGames';
import RecentCardGames from './RecentCardGame';
import Link from 'next/link';

export default function RecentGames() {
  const { games } = useFetchRecentGames();

  return (
    <section className="flex flex-col gap-4 items-center justify-center px-4">
      <h2 className="text-mine-shaft-100 text-2xl">Recently Added</h2>
      <ul className="flex flex-col gap-4">
        {games?.map((game) => (
          <li key={game.id}>
            <Link href={`/game/${game.id}`}>
              <RecentCardGames key={game.id} game={game} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
