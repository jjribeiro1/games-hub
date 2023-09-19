import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { createReview } from '@/services/review';
import { CreateReviewInput, Review } from '@/types/review';
import { toast } from 'react-toastify';

interface MutationProps extends CreateReviewInput {}

export function useCreateReviewWithoutComment() {
  return useMutation({
    mutationFn: ({ userId, username, gameId, rating, comment }: MutationProps) =>
      createReview({ userId, username, gameId, rating, comment }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', variables.userId] });
      toast.success('your review has been successfully submitted');
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
