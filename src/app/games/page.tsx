'use client';
import React from 'react';
import { GameCard } from '@/components/GameCard';
import { GameCardSkeleton } from '@/components/GameCardSkeleton';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import useFetchAllGames from '@/hooks/useFetchAllGames';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';

export default function GamesPage() {
  const { loggedUserInfo } = useLoggedUserInfo()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useFetchAllGames();

  return (
    <>
      <section>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-x-4 gap-y-6">
          {isLoading ? (
            <GameCardSkeleton quantity={8} />
          ) : (
            data?.pages.map((games) =>
              games.games.map((game) => (
                <li key={game.id}>
                  <GameCard game={game} loggedUserInfo={loggedUserInfo} />
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
    </>
  );
}
