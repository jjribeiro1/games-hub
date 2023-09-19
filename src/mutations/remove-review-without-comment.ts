import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { deleteReview } from '@/services/review';
import { toast } from 'react-toastify';

interface MutationProps {
  userId: string;
  gameId: string;
}

export function useRemoveReviewWithoutComment() {
  return useMutation({
    mutationFn: ({ userId, gameId }: MutationProps) => deleteReview(userId, gameId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', variables.userId] });
      toast.success('Your review has been removed');
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
