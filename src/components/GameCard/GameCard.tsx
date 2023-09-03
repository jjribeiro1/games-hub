'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import { BsCheck2 } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import useGameIcons from './useGameIcons';
import {
  addGameToUserLibrary,
  removeGameFromUserLibrary,
  updateGameTypeFromUserLibrary,
} from '@/services/user';
import { Game } from '@/types/game';
import { GameInLibrary, GameTypeInLibraryOption, UserInfo } from '@/types/user-info';
import { toast } from 'react-toastify';
import { queryClient } from '@/providers';

interface GameCardProps {
  game: Game;
  loggedUserInfo: UserInfo | null | undefined;
}

export default function GameCard({ game, loggedUserInfo }: GameCardProps) {
  const { gameIcons } = useGameIcons(game);
  const [gameIsInUserLibrary, setGameIsInUserLibrary] = useState<GameInLibrary | null>(
    loggedUserInfo?.library?.find((gameInLibrary) => gameInLibrary.id === game.id) || null,
  );
  const gameInLibraryType = gameIsInUserLibrary?.type || null;
  const popoverGameTypeOptions: GameTypeInLibraryOption[] = [
    'Uncategorized',
    'Currently Playing',
    'Completed',
    'Played',
    'Not Played',
  ];

  const handleAddGameToLibrary = async (type: GameTypeInLibraryOption) => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to add a game to your library');
      return;
    }
    try {
      const gameData: GameInLibrary = { ...game, type };
      await addGameToUserLibrary(loggedUserInfo?.id as string, gameData);
      queryClient.invalidateQueries({ queryKey: ['logged-user-info', loggedUserInfo?.id] });
      setGameIsInUserLibrary(gameData);
      toast.success('Game added to your library');
    } catch (error) {
      toast.error('An unexpected error happened');
    }
  };

  const handleUpdateGameTypeFromUserLibrary = async (type: GameTypeInLibraryOption) => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to make this action');
      return;
    }
    try {
      const updatedGame: GameInLibrary = { ...game, type };
      await updateGameTypeFromUserLibrary(loggedUserInfo?.id as string, updatedGame);
      queryClient.invalidateQueries({ queryKey: ['logged-user-info', loggedUserInfo?.id] });
      setGameIsInUserLibrary(updatedGame);
      toast.success('game category updated');
    } catch (error) {
      toast.error('An unexpected error happened');
    }
  };

  const handleRemoveGameFromLibrary = async () => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to remove a game from your library');
      return;
    }

    try {
      await removeGameFromUserLibrary(loggedUserInfo.id, game.id);
      queryClient.invalidateQueries({ queryKey: ['logged-user-info', loggedUserInfo?.id] });
      setGameIsInUserLibrary(null);
      toast.success('Game removed from your library');
    } catch (error) {
      toast.error('An unexpected error happened');
    }
  };

  return (
    <div className="bg-mine-shaft-900 w-72 h-72 sm:w-64 sm:h-64 md:w-60 lg:w-72 lg:h-72 min-[1440px]:w-80 min-[1440px]:h-80 rounded-md hover:scale-105 transition-transform">
      <Link href={`/game/${game.id}`}>
        <div className="flex flex-col gap-2">
          <Image
            className="aspect-video rounded-t-md"
            src={game.thumbnail}
            alt={`imagem do jogo ${game.title}`}
            width={320}
            height={180}
            priority
          />
          <p className="text-mine-shaft-200 pl-2">{game.title}</p>
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-2">
        <p className="text-mine-shaft-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {game.short_description}
        </p>

        <div className="flex items-center justify-between px-1 lg:mt-3 w-full">
          {!gameIsInUserLibrary || !loggedUserInfo ? (
            <Button
              type="button"
              className="bg-mine-shaft-600 hover:bg-mine-shaft-700 h-min w-min py-0.5 px-2"
              onClick={() => handleAddGameToLibrary('Uncategorized')}
            >
              <HiPlus className="w-4 h-4 text-mine-shaft-100 hover:text-mine-shaft-200" />
            </Button>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  className="bg-green-700 hover:bg-green-800 justify-between h-5 w-16 py-1 px-0 rounded"
                >
                  <BsCheck2 className="w-5 h-4 ml-1 text-mine-shaft-100" strokeWidth="1" />

                  <span className="flex">
                    <Separator orientation="vertical" className="h-4 text-mine-shaft-100 opacity-70" />
                    <FiChevronDown className="w-5 h-4 text-mine-shaft-100" />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-mine-shaft-100 p-1 w-44" side="top">
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
                    onClick={handleRemoveGameFromLibrary}
                    className="text-red-600 font-medium hover:bg-red-600 hover:text-mine-shaft-50 text-center text-sm p-2 rounded cursor-pointer"
                  >
                    Delete from library
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          )}

          <span className="flex items-center gap-2">{gameIcons()}</span>
        </div>
      </div>
    </div>
  );
}
