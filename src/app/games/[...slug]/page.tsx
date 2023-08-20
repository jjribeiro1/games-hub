'use client';
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { GameCard } from '@/components/GameCard';
import { FilterBar } from '@/components/FilterBar';
import useFetchGenres from '@/hooks/useFetchGenres';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import useFetchGamesBySlug from '@/hooks/useFetchGamesBySlug';
import { Genre } from '@/types/genre';
import { Platform } from '@/types/platform';

export default function GamesSlugPage() {
  const { genres, mappedGenres } = useFetchGenres();
  const { platforms, mappedPlatforms } = useFetchPlatforms();
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const selectedSortBy = searchParams.get('sort_by') as string;
  const selectedSortByMap = new Map<string, { fieldPath: string; value: 'asc' | 'desc' }>();
  selectedSortByMap.set('release_date', { fieldPath: 'release_date', value: 'desc' });
  selectedSortByMap.set('alphabetical', { fieldPath: 'title', value: 'asc' });

  let platformSlug = null;
  let genreSlug = null;

  if (slug.length === 1) {
    mappedPlatforms.has(slug[0]) ? (platformSlug = slug[0]) : (genreSlug = slug[0]);
  }
  if (slug.length > 1) {
    genreSlug = slug[1];
    platformSlug = slug[0];
  }

  const { games } = useFetchGamesBySlug({
    platformSlug,
    genreSlug,
    sortBy: selectedSortByMap.get(selectedSortBy),
  });

  return (
    <main className="flex flex-col items-center gap-8 mt-6 px-4 w-full">
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
