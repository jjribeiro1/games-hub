import React, { useState } from 'react';
import Image from 'next/image';
import { BsThreeDots } from 'react-icons/bs';
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
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WriteReviewDialog } from '@/components/WriteReviewDialog';
import { useCreateReview } from '@/mutations/create-review';
import { useDeleteReview } from '@/mutations/delete-review';
import { Game } from '@/types/game';
import { UserInfo } from '@/types/user-info';
import { RatingOptions, Review } from '@/types/review';
import { toast } from 'react-toastify';

interface GameReviewPopoverProps {
  game: Game;
  loggedUserInfo: UserInfo | null | undefined;
  reviewsFromUser: Review[];
  setOpenRequireSignInAlert: (value: boolean) => void;
  setSignInAlertMessage: (message: string) => void;
}

export default function GameReviewPopover({
  game,
  loggedUserInfo,
  reviewsFromUser,
  setOpenRequireSignInAlert,
  setSignInAlertMessage,
}: GameReviewPopoverProps) {
  const [openReviewModal, setOpenReviewModal] = useState(false);

  const createReviewWithoutCommentMutation = useCreateReview();
  const deleteReviewWithoutCommentMutation = useDeleteReview();

  const gameHasBeenReviewedByUser = reviewsFromUser?.some((review) => review.gameId === game.id);
  const oldReviewData = reviewsFromUser?.find((review) => review.gameId === game.id);
  const reviewRatingOptions: RatingOptions[] = ['Exceptional', 'Recommended', 'Meh', 'Bad'];

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
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" className="bg-mine-shaft-600 hover:bg-mine-shaft-700 h-min w-min py-0.5 px-2">
            <BsThreeDots className="w-4 h-4 text-mine-shaft-100 hover:text-mine-shaft-200" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-mine-shaft-50 p-1 w-64" side="top">
          <div className="flex flex-col gap-2 p-2">
            {gameHasBeenReviewedByUser ? (
              <>
                <p className="text-mine-shaft-950">Your review</p>
                <div className="flex flex-col items-center gap-1 border border-mine-shaft-300/50 p-2 bg-mine-shaft-200/30">
                  <Image src={`/images/${oldReviewData?.rating}.svg`} width={40} height={40} alt="target" />
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
    </>
  );
}
