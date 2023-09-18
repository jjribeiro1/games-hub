import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { updateGameTypeFromUserLibrary } from '@/services/user';
import { GameInLibrary, UserInfo } from '@/types/user-info';
import { toast } from 'react-toastify';

interface MutationProps {
  loggedUserInfo: UserInfo;
  updatedGame: GameInLibrary;
}
export function useUpdateGameTypeFromUserLibrary() {
  return useMutation({
    mutationFn: ({ loggedUserInfo, updatedGame }: MutationProps) =>
      updateGameTypeFromUserLibrary(loggedUserInfo.id, updatedGame),

    onSuccess: (_, variables) => {
      const { loggedUserInfo, updatedGame } = variables;
      const newLibrary = loggedUserInfo.library.map((game) =>
        game.id === updatedGame.id ? updatedGame : game,
      );
      queryClient.setQueryData<UserInfo>(['logged-user-info', loggedUserInfo.id], {
        ...loggedUserInfo,
        library: newLibrary,
      });
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
