'use client';
import { getAllGames } from '@/services/game';
import { useQuery } from '@tanstack/react-query';

export default function useFetchAllGames() {
  const { data, isLoading } = useQuery({
    queryKey: ['fetch-all-games'],
    queryFn: getAllGames,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    games: data,
    isLoading
  };
}
