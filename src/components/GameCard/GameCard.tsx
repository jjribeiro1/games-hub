'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { HiPlus } from 'react-icons/hi';
import { BsCheck2 } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import WriteReviewDialog from './WriteReviewDialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import useGameIcons from './useGameIcons';
import {
  addGameToUserLibrary,
  removeGameFromUserLibrary,
  updateGameTypeFromUserLibrary,
} from '@/services/user';
import { deleteReview, createReview } from '@/services/review';
import { Game } from '@/types/game';
import { GameInLibrary, GameTypeInLibraryOption, UserInfo } from '@/types/user-info';
import { RateOptions, Review } from '@/types/review';
import { queryClient } from '@/providers';
import { toast } from 'react-toastify';

interface GameCardProps {
  game: Game;
  loggedUserInfo: UserInfo | null | undefined;
  reviewsFromUser?: Review[];
}

export default function GameCard({ game, loggedUserInfo, reviewsFromUser }: GameCardProps) {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const { gameIcons } = useGameIcons(game);
  const gameIsInUserLibrary =
    loggedUserInfo?.library?.find((gameInLibrary) => gameInLibrary.id === game.id) || null;
  const gameInLibraryType = gameIsInUserLibrary?.type || null;
  const gameHasBeenReviewedByUser = reviewsFromUser?.find((review) => review.gameId === game.id);

  const popoverGameTypeOptions: GameTypeInLibraryOption[] = [
    'Uncategorized',
    'Currently Playing',
    'Completed',
    'Played',
    'Not Played',
  ];

  const reviewRateOptions: RateOptions[] = ['Exceptional', 'Recommended', 'Meh', 'Bad'];

  const addGameToUserLibraryMutation = useMutation({
    mutationFn: (game: GameInLibrary) => addGameToUserLibrary(loggedUserInfo?.id as string, game),
    onSuccess: (_, variables) => {
      const newLibrary = loggedUserInfo?.library
        ? [...(loggedUserInfo?.library?.map((game) => game) as GameInLibrary[]), variables]
        : [variables];

      queryClient.setQueryData<UserInfo>(['logged-user-info', loggedUserInfo?.id], {
        ...(loggedUserInfo as UserInfo),
        library: newLibrary,
      });
    },
  });

  const handleAddGameToUserLibrary = async (type: GameTypeInLibraryOption) => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to add a game to your library');
      return;
    }
    try {
      const gameData: GameInLibrary = { ...game, type };
      addGameToUserLibraryMutation.mutate(gameData);
      toast.success('Game added to your library');
    } catch (error) {
      toast.error('An unexpected error happened');
    }
  };

  const updateGameTypeFromUserLibraryMutation = useMutation({
    mutationFn: (updatedGame: GameInLibrary) =>
      updateGameTypeFromUserLibrary(loggedUserInfo?.id as string, updatedGame),
    onSuccess: (_, variables) => {
      const newLibrary = loggedUserInfo?.library.map((game) =>
        game.id === variables.id ? variables : game,
      ) as GameInLibrary[];
      queryClient.setQueryData<UserInfo>(['logged-user-info', loggedUserInfo?.id], {
        ...(loggedUserInfo as UserInfo),
        library: newLibrary,
      });
    },
  });

  const handleUpdateGameTypeFromUserLibrary = async (type: GameTypeInLibraryOption) => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to make this action');
      return;
    }
    try {
      const updatedGame: GameInLibrary = { ...game, type };
      updateGameTypeFromUserLibraryMutation.mutate(updatedGame);
      toast.success('game category updated');
    } catch (error) {
      toast.error('An unexpected error happened');
    }
  };

  const removeGameFromUserLibraryMutation = useMutation({
    mutationFn: (gameId: string) => removeGameFromUserLibrary(loggedUserInfo?.id as string, gameId),
    onSuccess: (_, variables) => {
      const newLibrary = loggedUserInfo?.library.filter((game) => game.id !== variables) as GameInLibrary[];
      queryClient.setQueryData<UserInfo>(['logged-user-info', loggedUserInfo?.id], {
        ...(loggedUserInfo as UserInfo),
        library: newLibrary,
      });
    },
  });

  const handleRemoveGameFromUserLibrary = async () => {
    if (!loggedUserInfo) {
      toast.error('You have to be logged in to remove a game from your library');
      return;
    }

    try {
      removeGameFromUserLibraryMutation.mutate(game.id);
      toast.success('Game removed from your library');
    } catch (error) {
      toast.error('An unexpected error happened');
    }
  };

  const handleAddReviewWithoutCommentInOneClick = async (rate: RateOptions) => {
    try {
      await createReview(loggedUserInfo?.id as string, game.id, rate);
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', loggedUserInfo?.id] });
      toast.success('your review has been successfully submitted');
    } catch (error) {
      toast.error('unexpected error');
    }
  };

  const handleDeleteReviewWithoutComment = async () => {
    try {
      await deleteReview(loggedUserInfo?.id as string, gameHasBeenReviewedByUser?.gameId as string);
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', loggedUserInfo?.id] });
      toast.success('Your review has been removed');
    } catch (error) {
      toast.error('unexpected error');
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
          <div className="flex items-center gap-2">
            {!gameIsInUserLibrary || !loggedUserInfo ? (
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
                            <span>{value}</span>{' '}
                            <BsCheck2 className="w-4 h-4 text-green-600" strokeWidth={1} />
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  className="bg-mine-shaft-600 hover:bg-mine-shaft-700 h-min w-min py-0.5 px-2"
                >
                  <BsThreeDots className="w-4 h-4 text-mine-shaft-100 hover:text-mine-shaft-200" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-mine-shaft-50 p-1 w-64" side="top">
                <div className="flex flex-col gap-2 p-2">
                  {gameHasBeenReviewedByUser ? (
                    <>
                      <p className="text-mine-shaft-950">Your review</p>
                      <div className="flex flex-col items-center gap-1 border border-mine-shaft-300/50 p-2 bg-mine-shaft-200/30">
                        <Image
                          src={`/images/${gameHasBeenReviewedByUser.rate}.svg`}
                          width={40}
                          height={40}
                          alt="target"
                        />
                        <p className="text-sm text-mine-shaft-950 font-medium">
                          {gameHasBeenReviewedByUser.rate}
                        </p>
                        {gameHasBeenReviewedByUser.comment ? (
                          <p
                            onClick={() => setOpenReviewModal(true)}
                            className="text-sm text-mine-shaft-500 font-medium cursor-pointer"
                          >
                            Edit review
                          </p>
                        ) : (
                          <p
                            onClick={handleDeleteReviewWithoutComment}
                            className="text-sm text-red-500 font-medium cursor-pointer"
                          >
                            Delete
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-mine-shaft-950">Rate in one click</p>
                      <div className="grid grid-cols-2">
                        {reviewRateOptions.map((rate) => (
                          <div
                            key={rate}
                            onClick={() => handleAddReviewWithoutCommentInOneClick(rate)}
                            className="flex flex-col items-center gap-1 border border-mine-shaft-300/50 p-2 hover:bg-mine-shaft-200/30 transition-colors cursor-pointer"
                          >
                            <Image src={`/images/${rate}.svg`} width={40} height={40} alt="target" />
                            <p className="text-sm text-mine-shaft-950 font-medium">{rate}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {gameHasBeenReviewedByUser?.comment ? null : (
                    <Button
                      onClick={() => setOpenReviewModal(true)}
                      variant={'outline'}
                      className="border border-mine-shaft-300/50 hover:bg-mine-shaft-200/30 transition-colors"
                    >
                      Write a review
                    </Button>
                  )}

                  {openReviewModal ? (
                    <WriteReviewDialog
                      open={openReviewModal}
                      onOpenChange={setOpenReviewModal}
                      userId={loggedUserInfo?.id as string}
                      game={game}
                      gameReviewedByUser={gameHasBeenReviewedByUser}
                    />
                  ) : null}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <span className="flex items-center gap-2">{gameIcons()}</span>
        </div>
      </div>
    </div>
  );
}
