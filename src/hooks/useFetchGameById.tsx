import { useQuery } from '@tanstack/react-query';
import { getGameById } from '@/services/game';
import { Game } from '@/types/game';

export default function useFetchGameById(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['getGameById', id],
    queryFn: () => getGameById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    game: data as Game,
    isLoading,
  };
}
