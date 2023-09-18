import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers';
import { addGameToUserLibrary } from '@/services/user';
import { GameInLibrary, UserInfo } from '@/types/user-info';
import { toast } from 'react-toastify';

interface MutationProps {
  loggedUserInfo: UserInfo;
  game: GameInLibrary;
}

export function useAddGameToUserLibrary() {
  return useMutation({
    mutationFn: ({ loggedUserInfo, game }: MutationProps) => addGameToUserLibrary(loggedUserInfo.id, game),

    onSuccess: (_, variables) => {
      const { loggedUserInfo, game } = variables;
      const newLibrary = loggedUserInfo.library
        ? [...loggedUserInfo.library.map((game) => game), game]
        : [game];

      queryClient.setQueryData<UserInfo>(['logged-user-info', loggedUserInfo.id], {
        ...loggedUserInfo,
        library: newLibrary,
      });
      toast.success('Game added to your library');
    },

    onError: () => {
      toast.error('An unexpected error happened');
    },
  });
}
