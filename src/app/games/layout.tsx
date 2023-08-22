'use client'
import React from 'react';
import { FilterBar } from '@/components/FilterBar';
import useFetchGenres from '@/hooks/useFetchGenres';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import { Genre } from '@/types/genre';
import { Platform } from '@/types/platform';

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  const { genres, mappedGenres } = useFetchGenres();
  const { platforms, mappedPlatforms } = useFetchPlatforms();

  return (
    <main className="flex flex-col items-center gap-8 mt-6 px-4 w-full">
      <section>
        <FilterBar
          genres={genres as Genre[]}
          mappedGenres={mappedGenres}
          platforms={platforms as Platform[]}
          mappedPlatforms={mappedPlatforms}
        />
      </section>
      {children}
    </main>
  );
}
