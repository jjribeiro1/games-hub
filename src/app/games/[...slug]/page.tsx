'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { GameCard } from '@/components/GameCard';
import { FilterBar } from '@/components/FilterBar';
import useFetchGenres from '@/hooks/useFetchGenres';
import useFetchGamesByGenre from '@/hooks/useFetchGamesByGenre';
import { Genre } from '@/types/genre';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import { Platform } from '@/types/platform';

export default function GamesSlugPage() {
  const { genres, mappedGenres } = useFetchGenres();
  const { platforms, mappedPlatforms } = useFetchPlatforms();
  const { slug } = useParams();
  const genreSlug = slug.length > 1 ? slug[1] : slug[0];
  const platformSlug = slug.length > 1 ? slug[0] : null;
  const originalGenre = mappedGenres.get(genreSlug) as string;

  const { games } = useFetchGamesByGenre(originalGenre);

  const headingText = () => {
    return `Top Free ${originalGenre} ${
      originalGenre?.includes(' Game') ? '' : 'games'
    }  in ${new Date().getFullYear()}`;
  };

  return (
    <main className="flex flex-col items-center gap-8 mt-6 px-4 w-full">
      <h1 className="text-mine-shaft-200 text-xl">{headingText()}</h1>

      <section className="">
        <FilterBar
          genres={genres as Genre[]}
          genreSlug={genreSlug}
          mappedGenres={mappedGenres}
          platforms={platforms as Platform[]}
          platformSlug={platformSlug}
          mappedPlatforms={mappedPlatforms}
        />
      </section>

      <section className="w-full px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-x-4 gap-y-6">
          {games?.map((game, i) => (
            <li key={i}>
              <GameCard game={game} mappedGenres={mappedGenres} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
