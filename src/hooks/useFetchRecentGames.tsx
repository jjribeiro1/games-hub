import { useQuery } from '@tanstack/react-query';
import { getRecentGames } from '@/services/game';

export default function useFetchRecentGames() {
  const { data } = useQuery({
    queryKey: ['get-recent-games'],
    queryFn: getRecentGames,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });
  return {
    games: data,
  };
}
