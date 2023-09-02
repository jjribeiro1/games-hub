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
import { addGameToUserLibrary } from '@/services/user';
import { Game } from '@/types/game';
import { GameInLibraryOptions, UserInfo } from '@/types/user-info';
import { toast } from 'react-toastify';
import { queryClient } from '@/providers';

interface GameCardProps {
  game: Game;
  loggedUserInfo: UserInfo | null | undefined;
}

export default function GameCard({ game, loggedUserInfo }: GameCardProps) {
  const [gameInUserLibrary, setGameInUserLibrary] = useState(
    loggedUserInfo?.library?.some((value) => value.game.id === game.id),
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
      setGameInUserLibrary(true);
      toast.success('Game added to your library');
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
          {!gameInUserLibrary || !loggedUserInfo ? (
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
              <PopoverContent className="bg-mine-shaft-100 p-1 w-40" side="top">
                <ul className="flex flex-col">
                  <li className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer">
                    Uncategorized
                  </li>
                  <li className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer">
                    Currently Playing
                  </li>
                  <li className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer">
                    Completed
                  </li>
                  <li className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer">
                    Played
                  </li>
                  <li className="text-mine-shaft-950 font-medium hover:bg-mine-shaft-800 hover:text-mine-shaft-100 text-center text-sm p-2 rounded cursor-pointer">
                    Not Played
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
