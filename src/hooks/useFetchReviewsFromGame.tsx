import { useQuery } from '@tanstack/react-query';
import { Game } from '@/types/game';
import { getAllReviewsFromGame } from '@/services/review';

export default function useFetchReviewsFromGame(game: Game) {
  const { data, isLoading } = useQuery({
    queryKey: ['get-reviews-from-game', game?.id],
    queryFn: () => getAllReviewsFromGame(game),
    enabled: !!game,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  const reviewsWithComment = data?.filter((review) => Boolean(review.comment));

  return {
    reviewsFromGame: data,
    isLoadingReviewsFromGame: isLoading,
    reviewsWithComment,
  };
}
