import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { updateReviewById } from '@/services/review';
import { Review } from '@/types/review';
import { toast } from 'react-toastify';

interface MutationProps {
  userId: string;
  gameId: string;
  data: Partial<Review>;
}

export function useUpdateReview() {
  return useMutation({
    mutationFn: ({ userId, gameId, data }: MutationProps) => updateReviewById(userId, gameId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-game', variables.gameId] });
      toast.success('your updated review has been successfully submitted');
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
