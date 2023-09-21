import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { deleteComment } from '@/services/comment';
import { toast } from 'react-toastify';

interface MutationProps {
  commentId: string;
}
export default function useDeleteComment() {
  return useMutation({
    mutationFn: ({ commentId }: MutationProps) => deleteComment(commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-comments-from-game'] });
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
