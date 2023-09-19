import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { updateReviewById } from '@/services/review';
import { Game } from '@/types/game';
import { RatingOptions, Review } from '@/types/review';
import { toast } from 'react-toastify';
import { queryClient } from '@/providers';
import { useCreateReview } from '@/mutations/create-review';
import { useRemoveReview } from '@/mutations/remove-review';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  userId: string;
  username: string;
  game: Game;
  gameReviewedByUser: Review | undefined;
}

export default function WriteReviewDialog({
  open,
  onOpenChange,
  userId,
  username,
  gameReviewedByUser,
  game,
}: WriteReviewDialogProps) {
  const [commentValue, setCommentValue] = useState('');
  const [selectedRatingValue, setSelectedRatingValue] = useState<RatingOptions>();
  const maxCommentLength = 140;
  const reviewRatingOptions: RatingOptions[] = ['Exceptional', 'Recommended', 'Meh', 'Bad'];
  const createReviewWithCommentMutation = useCreateReview();
  const removeReviewMutation = useRemoveReview();

  const handleUpdateReview = async () => {
    try {
      await updateReviewById(userId, gameReviewedByUser?.gameId as string, {
        rating: selectedRatingValue,
        comment: commentValue,
      });
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', userId] });
      toast.success('your updated review has been successfully submitted');
    } catch (error) {
      toast.error('Unexpected error');
    } finally {
      onOpenChange(false);
    }
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
    if (!userId || !username || !gameReviewedByUser) {
      toast.error('You do not have permission to complete this action');
      return;
    }
    removeReviewMutation.mutate({ userId, gameId: gameReviewedByUser.gameId });
    onOpenChange(false);
  };

  useEffect(() => {
    if (gameReviewedByUser) {
      setSelectedRatingValue(gameReviewedByUser.rating);
      setCommentValue(gameReviewedByUser.comment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-mine-shaft-950 p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl text-mine-shaft-100 font-semibold">{game.title}</DialogTitle>
          <div className="flex items-center justify-between gap-2 w-full">
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
        <DialogFooter>
          {gameReviewedByUser ? (
            <Button type="button" variant={'destructive'} onClick={handleDeleteReview}>
              Delete
            </Button>
          ) : null}

          <Button
            type="submit"
            onClick={gameReviewedByUser ? handleUpdateReview : handleCreateReviewWithComment}
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
