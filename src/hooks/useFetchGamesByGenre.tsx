import { useQuery } from '@tanstack/react-query';
import { getGamesByGenre } from '@/services/game';

export default function useFetchGamesByGenre(genre: string) {
  const { data } = useQuery({
    queryKey: ['fetch-games-by-genre', genre],
    queryFn: () => getGamesByGenre(genre),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    games: data,
  };
}
