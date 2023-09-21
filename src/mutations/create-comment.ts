import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { createComment } from '@/services/comment';
import { CreateCommentInput } from '@/types/comment';
import { toast } from 'react-toastify';

interface MutationProps extends CreateCommentInput {}

export default function useCreateComment() {
  return useMutation({
    mutationFn: ({ userId, username, gameId, text, createdAt }: MutationProps) =>
      createComment({ userId, username, gameId, text, createdAt }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-comments-from-game'] });
      toast.success('your comment has been successfully submited');
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
