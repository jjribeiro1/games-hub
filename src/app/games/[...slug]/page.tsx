'use client';
import React from 'react';
import { GameCard } from '@/components/GameCard';
import Spinner from '@/components/ui/spinner';
import useFetchGamesBySlug from '@/hooks/useFetchGamesBySlug';
import useVerifyGamesPageUrl from '@/hooks/useVerifyGamesPageUrl';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';
import useFetchReviewsFromUser from '@/hooks/useFetchReviewsFromUser';
import { Review } from '@/types/review';
import { Genre } from '@/types/genre';
import { Platform } from '@/types/platform';

export default function GamesSlugPage() {
  const { genres, mappedGenres } = useFetchGenres();
  const { platforms, mappedPlatforms } = useFetchPlatforms();
  const { loggedUserInfo } = useLoggedUserInfo();
  const { reviews } = useFetchReviewsFromUser();
  const { platformSlug, genreSlug, activeSortBy } = useVerifyGamesPageUrl();

  const sortByMap = new Map<string, { fieldPath: string; value: 'asc' | 'desc' }>([
    ['release_date', { fieldPath: 'release_date', value: 'desc' }],
    ['alphabetical', { fieldPath: 'title', value: 'asc' }],
  ]);

  const { games, isLoading } = useFetchGamesBySlug({
    platformSlug,
    genreSlug,
    sortBy: activeSortBy !== 'relevance' ? sortByMap.get(activeSortBy) : undefined,
  });

  return (
    <main className="flex flex-col items-center gap-8 mt-6 px-2 lg:px-4 py-8 w-full min-h-screen">
      <section>
        <FilterBar
          genres={genres as Genre[]}
          mappedGenres={mappedGenres}
          platforms={platforms as Platform[]}
          mappedPlatforms={mappedPlatforms}
        />
      </section>
      <section>
        {isLoading ? (
          <Spinner />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-x-4 gap-y-6">
            {games?.map((game) => (
              <li key={game.id}>
                <GameCard game={game} loggedUserInfo={loggedUserInfo} reviewsFromUser={reviews as Review[]} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
