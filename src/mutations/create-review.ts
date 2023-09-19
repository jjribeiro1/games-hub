import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { createReview } from '@/services/review';
import { CreateReviewInput } from '@/types/review';
import { toast } from 'react-toastify';

interface MutationProps extends CreateReviewInput {}

export function useCreateReview() {
  return useMutation({
    mutationFn: ({ userId, username, gameId, rating, comment }: MutationProps) =>
      createReview({ userId, username, gameId, rating, comment }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-game', variables.gameId] });
      toast.success('your review has been successfully submitted');
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
