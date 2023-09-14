import { useQuery } from '@tanstack/react-query';
import { Game } from '@/types/game';
import { getAllReviewsFromGame } from '@/services/review';

export default function useFetchReviewsFromGame(game: Game) {
  const { data, isLoading } = useQuery({
    queryKey: ['get-reviews-from-game', game?.id],
    queryFn: () => getAllReviewsFromGame(game),
  });

  return {
    reviewsFromGame: data,
    isLoadingReviewsFromGame: isLoading,
  };
}
