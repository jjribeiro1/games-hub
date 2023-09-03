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
import { GameInLibraryOptions, UserInfo } from '@/types/user-info';
import { toast } from 'react-toastify';
import { queryClient } from '@/providers';

interface GameCardProps {
  game: Game;
  loggedUserInfo: UserInfo | null | undefined;
}

export default function GameCard({ game, loggedUserInfo }: GameCardProps) {
  const [gameIsInUserLibrary, setGameIsInUserLibrary] = useState(
    loggedUserInfo?.library?.some((gameInLibrary) => gameInLibrary.id === game.id),
  );
  const [gameInLibraryType, setGameInLibraryType] = useState<GameInLibraryOptions>(
    gameIsInUserLibrary
      ? (loggedUserInfo?.library?.find((gameInLibrary) => gameInLibrary.id === game.id)
          ?.type as GameInLibraryOptions)
      : 'Uncategorized',
  );
  const { gameIcons } = useGameIcons(game);

  const handleAddGameToLibrary = async (type: GameInLibraryOptions) => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to add a game to your library');
      return;
    }
    try {
      const gameData = { ...game, type };
      await addGameToUserLibrary(loggedUserInfo?.id as string, gameData);
      queryClient.invalidateQueries({ queryKey: ['logged-user-info', loggedUserInfo?.id] });
      setGameIsInUserLibrary(true);
      setGameInLibraryType('Uncategorized');
      toast.success('Game added to your library');
    } catch (error) {
      toast.error('An unexpected error happened');
    }
  };

  const handleUpdateGameTypeFromUserLibrary = async (type: GameInLibraryOptions) => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to make this action');
      return;
    }
    try {
      const updatedGame = { ...game, type };
      await updateGameTypeFromUserLibrary(loggedUserInfo?.id as string, updatedGame);
      queryClient.invalidateQueries({ queryKey: ['logged-user-info', loggedUserInfo?.id] });
      setGameInLibraryType(type);
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
      setGameIsInUserLibrary(false);
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
                  <li
                    onClick={() => handleUpdateGameTypeFromUserLibrary('Uncategorized')}
                    className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer"
                  >
                    {gameInLibraryType === 'Uncategorized' ? (
                      <div className="flex items-center justify-center space-x-1">
                        <span>Uncategorized</span>{' '}
                        <BsCheck2 className="w-4 h-4 text-green-600" strokeWidth={1} />
                      </div>
                    ) : (
                      'Uncategorized'
                    )}
                  </li>

                  <li
                    onClick={() => handleUpdateGameTypeFromUserLibrary('Currently Playing')}
                    className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer"
                  >
                    {gameInLibraryType === 'Currently Playing' ? (
                      <div className="flex items-center justify-center space-x-1">
                        <span>Currently Playing</span>{' '}
                        <BsCheck2 className="w-4 h-4 text-green-600" strokeWidth={1} />
                      </div>
                    ) : (
                      'Currently Playing'
                    )}
                  </li>

                  <li
                    onClick={() => handleUpdateGameTypeFromUserLibrary('Completed')}
                    className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer"
                  >
                    {gameInLibraryType === 'Completed' ? (
                      <div className="flex items-center justify-center space-x-1">
                        <span>Completed</span> <BsCheck2 className="w-4 h-4 text-green-600" strokeWidth={1} />
                      </div>
                    ) : (
                      'Completed'
                    )}
                  </li>

                  <li
                    onClick={() => handleUpdateGameTypeFromUserLibrary('Played')}
                    className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer"
                  >
                    {gameInLibraryType === 'Played' ? (
                      <div className="flex items-center justify-center space-x-1">
                        <span>Played</span> <BsCheck2 className="w-4 h-4 text-green-600" strokeWidth={1} />
                      </div>
                    ) : (
                      'Played'
                    )}
                  </li>

                  <li
                    onClick={() => handleUpdateGameTypeFromUserLibrary('Not Played')}
                    className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer"
                  >
                    {gameInLibraryType === 'Not Played' ? (
                      <div className="flex items-center justify-center space-x-1">
                        <span>Not Played</span>{' '}
                        <BsCheck2 className="w-4 h-4 text-green-600" strokeWidth={1} />
                      </div>
                    ) : (
                      'Not Played'
                    )}
                  </li>

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
