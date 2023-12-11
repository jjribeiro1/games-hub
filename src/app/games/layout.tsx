'use client';
import React from 'react';
import { FilterBar } from '@/components/FilterBar';
import useFetchGenres from '@/hooks/useFetchGenres';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import { Genre } from '@/types/genre';
import { Platform } from '@/types/platform';
import useVerifyGamesPageUrl from '@/hooks/useVerifyGamesPageUrl';

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  const { genres, mappedGenres } = useFetchGenres();
  const { platforms, mappedPlatforms } = useFetchPlatforms();
  const { platformSlug, genreSlug } = useVerifyGamesPageUrl();

  return (
    <div className="flex flex-col items-center gap-8 mt-6 px-2 lg:px-4 pt-10 pb-16 w-full">
      <section>
        {platformSlug || genreSlug ? (
          <FilterBar
            genres={genres as Genre[]}
            mappedGenres={mappedGenres}
            platforms={platforms as Platform[]}
            mappedPlatforms={mappedPlatforms}
          />
        ) : (
          <h2 className="text-3xl sm:text-4xl text-mine-shaft-200 font-semibold">All Games</h2>
        )}
      </section>
      {children}
    </div>
  );
}
