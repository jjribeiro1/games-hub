import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { BsCheck2 } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { RequireSignInAlert } from '@/components/RequireSignInAlert'
import { useAddGameToUserLibrary } from '@/mutations/add-game-to-user-library';
import { useUpdateGameTypeFromUserLibrary } from '@/mutations/update-game-library-type';
import { useRemoveGameFromUserLibrary } from '@/mutations/remove-game-from-user-library';
import { GameInLibrary, GameTypeInLibraryOption, UserInfo } from '@/types/user-info';
import { Game } from '@/types/game';
import { toast } from 'react-toastify';

interface GameInLibraryPopoverProps {
  loggedUserInfo: UserInfo | null | undefined;
  game: Game;
}

export default function GameInLibraryPopover({ loggedUserInfo, game }: GameInLibraryPopoverProps) {
  const [openRequireSignInAlert, setOpenRequireSignInAlert] = useState(false);
  const [signInAlertMessage, setSignInAlertMessage] = useState('');
  const addGameToUserLibraryMutation = useAddGameToUserLibrary();
  const updateGameTypeFromUserLibraryMutation = useUpdateGameTypeFromUserLibrary();
  const removeGameFromUserLibraryMutation = useRemoveGameFromUserLibrary();

  const gameIsInUserLibrary =
    loggedUserInfo?.library?.find((gameInLibrary) => gameInLibrary.id === game.id) || null;
  const gameInLibraryType = gameIsInUserLibrary?.type || null;
  const popoverGameTypeOptions: GameTypeInLibraryOption[] = [
    'Uncategorized',
    'Currently Playing',
    'Completed',
    'Played',
    'Not Played',
  ];

  const handleAddGameToUserLibrary = (type: GameTypeInLibraryOption) => {
    if (!loggedUserInfo) {
      setSignInAlertMessage('You must be logged in to add a game to your library');
      setOpenRequireSignInAlert(true);
      return;
    }
    const gameData: GameInLibrary = { ...game, type };
    addGameToUserLibraryMutation.mutate({ loggedUserInfo, game: gameData });
  };

  const handleUpdateGameTypeFromUserLibrary = (type: GameTypeInLibraryOption) => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to make this action');
      return;
    }
    const updatedGame: GameInLibrary = { ...game, type };
    updateGameTypeFromUserLibraryMutation.mutate({ loggedUserInfo, updatedGame });
  };

  const handleRemoveGameFromUserLibrary = () => {
    if (!loggedUserInfo) {
      toast.error('You must be logged in to remove a game from your library');
      return;
    }
    removeGameFromUserLibraryMutation.mutate({ loggedUserInfo, gameId: game.id });
  };

  return (
    <div>
      {!gameIsInUserLibrary ? (
        <Button
          type="button"
          className="bg-mine-shaft-600 hover:bg-mine-shaft-700 h-min w-min py-0.5 px-2"
          onClick={() => handleAddGameToUserLibrary('Uncategorized')}
        >
          <HiPlus className="w-4 h-4 text-mine-shaft-100 hover:text-mine-shaft-200" />
        </Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              className="bg-green-700 hover:bg-green-800 justify-between h-min w-16 py-0.5 px-0 rounded"
            >
              <BsCheck2 className="w-4 h-4 ml-1 text-mine-shaft-100" strokeWidth="1" />

              <span className="flex">
                <Separator orientation="vertical" className="h-4 text-mine-shaft-100 opacity-70" />
                <FiChevronDown className="w-4 h-4 text-mine-shaft-100" />
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-mine-shaft-50 p-1 w-44" side="top">
            <ul className="flex flex-col">
              {popoverGameTypeOptions.map((value) => (
                <li
                  key={value}
                  onClick={() => handleUpdateGameTypeFromUserLibrary(value)}
                  className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer"
                >
                  {gameInLibraryType === value ? (
                    <div className="flex items-center justify-center space-x-1">
                      <span>{value}</span> <BsCheck2 className="w-4 h-4 text-green-600" strokeWidth={1} />
                    </div>
                  ) : (
                    value
                  )}
                </li>
              ))}
              <li
                onClick={handleRemoveGameFromUserLibrary}
                className="text-red-600 font-medium hover:bg-red-600 hover:text-mine-shaft-50 text-center text-sm p-2 rounded cursor-pointer"
              >
                Delete from library
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      )}

      {openRequireSignInAlert ? (
        <RequireSignInAlert
          open={openRequireSignInAlert}
          onOpenChange={setOpenRequireSignInAlert}
          message={signInAlertMessage}
        />
      ) : null}
    </div>
  );
}
