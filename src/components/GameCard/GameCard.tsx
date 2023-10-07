'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import { BsCheck2 } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import { WriteReviewDialog } from '@/components/WriteReviewDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RequireSignInAlert } from '@/components/RequireSignInAlert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useGameIcons from './useGameIcons';
import { useAddGameToUserLibrary } from '@/mutations/add-game-to-user-library';
import { useUpdateGameTypeFromUserLibrary } from '@/mutations/update-game-library-type';
import { useRemoveGameFromUserLibrary } from '@/mutations/remove-game-from-user-library';
import { useCreateReview } from '@/mutations/create-review';
import { useDeleteReview } from '@/mutations/delete-review';
import { Game } from '@/types/game';
import { GameInLibrary, GameTypeInLibraryOption, UserInfo } from '@/types/user-info';
import { RatingOptions, Review } from '@/types/review';
import { toast } from 'react-toastify';

interface GameCardProps {
  game: Game;
  loggedUserInfo: UserInfo | null | undefined;
  reviewsFromUser: Review[];
}

export default function GameCard({ game, loggedUserInfo, reviewsFromUser }: GameCardProps) {
  const [openGameInLibraryPopover, setOpenGameInLibraryPopover] = useState(false)
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openRequireSignInAlert, setOpenRequireSignInAlert] = useState(false);
  const [signInAlertMessage, setSignInAlertMessage] = useState('');
  const { gameIcons } = useGameIcons(game);
  const gameIsInUserLibrary =
    loggedUserInfo?.library?.find((gameInLibrary) => gameInLibrary.id === game.id) || null;
  const gameInLibraryType = gameIsInUserLibrary?.type || null;
  const gameHasBeenReviewedByUser = reviewsFromUser?.some((review) => review.gameId === game.id);
  const oldReviewData = reviewsFromUser?.find((review) => review.gameId === game.id);
  const popoverGameTypeOptions: GameTypeInLibraryOption[] = [
    'Uncategorized',
    'Currently Playing',
    'Completed',
    'Played',
    'Not Played',
  ];
  const reviewRatingOptions: RatingOptions[] = ['Exceptional', 'Recommended', 'Meh', 'Bad'];
  const addGameToUserLibraryMutation = useAddGameToUserLibrary();
  const updateGameTypeFromUserLibraryMutation = useUpdateGameTypeFromUserLibrary();
  const removeGameFromUserLibraryMutation = useRemoveGameFromUserLibrary();
  const createReviewWithoutCommentMutation = useCreateReview();
  const deleteReviewWithoutCommentMutation = useDeleteReview();

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
    setOpenGameInLibraryPopover(false)
  };

  const handleRemoveGameFromUserLibrary = () => {
    if (!loggedUserInfo) {
      toast.error('You must be logged in to remove a game from your library');
      return;
    }
    removeGameFromUserLibraryMutation.mutate({ loggedUserInfo, gameId: game.id });
  };

  const handleCreateReviewWithoutComment = (rating: RatingOptions) => {
    if (!loggedUserInfo) {
      setSignInAlertMessage('You must be logged in to make a review');
      setOpenRequireSignInAlert(true);
      return;
    }
    createReviewWithoutCommentMutation.mutate({
      userId: loggedUserInfo.id,
      username: loggedUserInfo.username,
      gameId: game.id,
      rating,
    });
  };

  const handleDeleteReviewWithoutComment = () => {
    if (!loggedUserInfo || !gameHasBeenReviewedByUser) {
      toast.error('You do not have permission to complete this action');
      return;
    }
    deleteReviewWithoutCommentMutation.mutate({
      userId: loggedUserInfo.id,
      gameId: oldReviewData?.gameId as string,
    });
  };

  return (
    <div className="bg-mine-shaft-900 w-72 h-72 sm:w-64 sm:h-64 md:w-60 lg:w-72 lg:h-72 min-[1440px]:w-80 min-[1440px]:h-80 rounded-md hover:scale-105 transition-transform">
      <Link href={`/game/${game.id}`}>
        <div className="flex flex-col gap-2">
          <Image
            className="aspect-video rounded-t-md"
            src={game.thumbnail}
            alt={`${game.title} image`}
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
              <Popover open={openGameInLibraryPopover} onOpenChange={setOpenGameInLibraryPopover}>
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
                          src={`/images/${oldReviewData?.rating}.svg`}
                          width={40}
                          height={40}
                          alt="target"
                        />
                        <p className="text-sm text-mine-shaft-950 font-medium">{oldReviewData?.rating}</p>
                        {oldReviewData?.comment ? (
                          <p
                            onClick={() => setOpenReviewModal(true)}
                            className="text-sm text-mine-shaft-500 font-medium cursor-pointer"
                          >
                            Edit review
                          </p>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <p className="text-sm text-red-500 font-medium cursor-pointer">Delete</p>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-mine-shaft-950 max-w-[350px] sm:max-w-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl text-mine-shaft-100 font-semibold">
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-mine-shaft-200">
                                  This action cannot be undone. This will permanently delete your review
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteReviewWithoutComment}
                                  type="button"
                                  className="bg-red-500 hover:bg-red-500 text-mine-shaft-50"
                                >
                                  Yes, delete my review
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-mine-shaft-950">Rate in one click</p>
                      <div className="grid grid-cols-2">
                        {reviewRatingOptions.map((rating) => (
                          <div
                            key={rating}
                            onClick={() => handleCreateReviewWithoutComment(rating)}
                            className="flex flex-col items-center gap-1 border border-mine-shaft-300/50 p-2 hover:bg-mine-shaft-200/30 transition-colors cursor-pointer"
                          >
                            <Image src={`/images/${rating}.svg`} width={40} height={40} alt="target" />
                            <p className="text-sm text-mine-shaft-950 font-medium">{rating}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {oldReviewData?.comment ? null : (
                    <Button
                      onClick={
                        loggedUserInfo
                          ? () => setOpenReviewModal(true)
                          : () => {
                              setSignInAlertMessage('You must be logged in to make a review');
                              setOpenRequireSignInAlert(true);
                            }
                      }
                      variant={'outline'}
                      className="border border-mine-shaft-300/50 hover:bg-mine-shaft-200/30 transition-colors"
                    >
                      Write a review
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <span className="flex items-center gap-2">{gameIcons()}</span>
        </div>
      </div>
      {openReviewModal ? (
        <WriteReviewDialog
          open={openReviewModal}
          onOpenChange={setOpenReviewModal}
          userId={loggedUserInfo?.id as string}
          username={loggedUserInfo?.username as string}
          game={game}
          gameHasBeenReviewedByUser={gameHasBeenReviewedByUser as boolean}
          oldReviewData={oldReviewData}
        />
      ) : null}

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
