import { getCommentsFromGame } from '@/services/comment';
import { useQuery } from '@tanstack/react-query';

export default function useFetchCommentsFromGame(gameId: string) {
  const { data } = useQuery({
    queryKey: ['get-comments-from-game', gameId],
    queryFn: () => getCommentsFromGame(gameId),
    cacheTime: 1000 * 60 * 2,
    staleTime: 1000 * 60 * 2,
    enabled: !!gameId,
  });

  return {
    commentsFromGame: data,
  };
}
