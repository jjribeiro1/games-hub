'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getAllGames } from '@/services/game';

export default function useFetchAllGames() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['get-all-games'],
    queryFn: getAllGames,
    getNextPageParam: (lastPage) => lastPage.lastDocRef,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  };
}
