"use client"
import { FilterBar } from '@/components/FilterBar';
import { GameCard } from '@/components/GameCard';
import { GameCardSkeleton } from '@/components/GameCardSkeleton';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import useFetchAllGames from '@/hooks/useFetchAllGames';
import useFetchGenres from '@/hooks/useFetchGenres';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import useFetchReviewsFromUser from '@/hooks/useFetchReviewsFromUser';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';
import { Genre } from '@/types/genre';
import { Platform } from '@/types/platform';
import { Review } from '@/types/review';

export default function Home() {
  const { genres, mappedGenres } = useFetchGenres();
  const { platforms, mappedPlatforms } = useFetchPlatforms();
  const { loggedUserInfo } = useLoggedUserInfo();
  const { reviews } = useFetchReviewsFromUser();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useFetchAllGames();

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
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-x-4 gap-y-6">
          {isLoading ? (
            <GameCardSkeleton quantity={8} />
          ) : (
            data?.pages.map((games) =>
              games.games.map((game) => (
                <li key={game.id}>
                  <GameCard
                    game={game}
                    loggedUserInfo={loggedUserInfo}
                    reviewsFromUser={reviews as Review[]}
                  />
                </li>
              )),
            )
          )}
        </ul>
      </section>
      <section>
        {data ? (
          <Button
            className="self-center bg-cyan-700 text-mine-shaft-100 hover:bg-cyan-800 text-lg font-semibold"
            size={'lg'}
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
          </Button>
        ) : null}

        {isFetching && !isFetchingNextPage ? <Spinner /> : null}
      </section>
    </main>
  );
}
