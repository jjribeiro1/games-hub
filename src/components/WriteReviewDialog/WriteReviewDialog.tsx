import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateReview } from '@/mutations/create-review';
import { useUpdateReview } from '@/mutations/update-review';
import { useDeleteReview } from '@/mutations/delete-review';
import { Game } from '@/types/game';
import { RatingOptions, Review } from '@/types/review';
import { toast } from 'react-toastify';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  userId: string;
  username: string;
  game: Game;
  gameHasBeenReviewedByUser: boolean;
  oldReviewData: Review | undefined;
}

export default function WriteReviewDialog({
  open,
  onOpenChange,
  userId,
  username,
  gameHasBeenReviewedByUser,
  game,
  oldReviewData,
}: WriteReviewDialogProps) {
  const [commentValue, setCommentValue] = useState('');
  const [selectedRatingValue, setSelectedRatingValue] = useState<RatingOptions>();
  const maxCommentLength = 140;
  const reviewRatingOptions: RatingOptions[] = ['Exceptional', 'Recommended', 'Meh', 'Bad'];
  const createReviewWithCommentMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const handleUpdateReview = async () => {
    if (!userId || !username || !gameHasBeenReviewedByUser) {
      toast.error('You do not have permission to complete this action');
      return;
    }
    const data = { comment: commentValue, rating: selectedRatingValue, userId: oldReviewData?.userId };
    updateReviewMutation.mutate({ userId, gameId: oldReviewData?.gameId as string, data });
    onOpenChange(false);
  };

  const handleCreateReviewWithComment = () => {
    if (!userId || !username) {
      toast.error('You do not have permission to complete this action');
      return;
    }
    createReviewWithCommentMutation.mutate({
      userId,
      username,
      gameId: game.id,
      rating: selectedRatingValue as RatingOptions,
      comment: commentValue,
    });
    onOpenChange(false);
  };

  const handleDeleteReview = () => {
    if (!userId || !username || !gameHasBeenReviewedByUser) {
      toast.error('You do not have permission to complete this action');
      return;
    }
    deleteReviewMutation.mutate({ userId, gameId: oldReviewData?.gameId as string });
    onOpenChange(false);
  };

  useEffect(() => {
    if (gameHasBeenReviewedByUser) {
      setSelectedRatingValue(oldReviewData?.rating);
      setCommentValue(oldReviewData?.comment as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-mine-shaft-950 p-6 max-w-[350px] sm:max-w-lg">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl text-mine-shaft-100 font-semibold">{game.title}</DialogTitle>
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2 w-full">
            {reviewRatingOptions.map((rating) => (
              <Button
                key={rating}
                type="button"
                onClick={() => setSelectedRatingValue(rating)}
                className={` ${
                  selectedRatingValue === rating
                    ? 'bg-mine-shaft-50 hover:bg-mine-shaft-100 text-mine-shaft-950'
                    : 'bg-inherit hover:bg-mine-shaft-50 text-mine-shaft-100 hover:text-mine-shaft-950'
                }  h-12 gap-1 p-1 border rounded-lg transition-colors group`}
              >
                <Image src={`/images/${rating}.svg`} width={30} height={30} alt="target" />
                <p className={'text-sm font-medium'}>{rating}</p>
              </Button>
            ))}
          </div>
        </DialogHeader>

        <Textarea
          className="text-lg text-mine-shaft-950 font-medium placeholder:text-mine-shaft-900 placeholder:text-sm"
          placeholder="write a review"
          onChange={(e) => setCommentValue(e.target.value)}
          value={commentValue}
          maxLength={maxCommentLength}
        />
        <div className="text-mine-shaft-50 text-sm text-end">
          {`${commentValue.length} / ${maxCommentLength}`}
        </div>
        <DialogFooter className='gap-2 sm:gap-0'>
          {gameHasBeenReviewedByUser ? (
            <Button type="button" variant={'destructive'} onClick={handleDeleteReview}>
              Delete
            </Button>
          ) : null}

          <Button
            type="submit"
            onClick={
              oldReviewData && gameHasBeenReviewedByUser ? handleUpdateReview : handleCreateReviewWithComment
            }
            disabled={commentValue.length < 1 || !selectedRatingValue}
            className="bg-cyan-700 hover:bg-cyan-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-lg font-medium"
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
