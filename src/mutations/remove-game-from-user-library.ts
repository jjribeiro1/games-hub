import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { removeGameFromUserLibrary } from '@/services/user';
import { UserInfo } from '@/types/user-info';
import { toast } from 'react-toastify';

interface MutationProps {
  loggedUserInfo: UserInfo;
  gameId: string;
}

export function useRemoveGameFromUserLibrary() {
  return useMutation({
    mutationFn: ({ loggedUserInfo, gameId }: MutationProps) =>
      removeGameFromUserLibrary(loggedUserInfo.id, gameId),

    onSuccess: (_, variables) => {
      const { loggedUserInfo, gameId } = variables;
      const newLibrary = loggedUserInfo?.library.filter((game) => game.id !== gameId);
      queryClient.setQueryData<UserInfo>(['logged-user-info', loggedUserInfo?.id], {
        ...loggedUserInfo,
        library: newLibrary,
      });
      toast.success('Game removed from your library');
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
