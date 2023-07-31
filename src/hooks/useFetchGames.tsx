import { useQuery } from '@tanstack/react-query';
import { getAllGames } from '@/services/game';
import { Game } from '@/types/game';

export default function useFetchGames() {
  const games = [] as Game[];
  const genres = new Set<string>();

  const { data } = useQuery({
    queryKey: ['fetch-games'],
    queryFn: getAllGames,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  data?.forEach((result) => {
    games.push(result.data() as Game);
  });

  data?.forEach((result) => {
    genres.add(result.data().genre);
  });

  return {
    games,
    genres,
  };
}
