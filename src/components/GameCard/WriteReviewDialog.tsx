import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createReview, deleteReview, updateReviewById } from '@/services/review';
import { Game } from '@/types/game';
import { RateOptions, Review } from '@/types/review';
import { toast } from 'react-toastify';
import { queryClient } from '@/providers';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  userId: string;
  game: Game;
  gameReviewedByUser: Review | undefined; 
}

export default function WriteReviewDialog({ open, onOpenChange, userId, gameReviewedByUser, game }: WriteReviewDialogProps) {
  const [commentValue, setCommentValue] = useState('');
  const [selectedRateValue, setSelectedRateValue] = useState<RateOptions>();
  const maxCommentLength = 140;
  const reviewRateOptions: RateOptions[] = ['Exceptional', 'Recommended', 'Meh', 'Bad'];

  const handleUpdateReview = async () => {
    try {
      await updateReviewById(userId, gameReviewedByUser?.gameId as string, { rate: selectedRateValue, comment: commentValue });
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', userId] });
      toast.success('your updated review has been successfully submitted');
    } catch (error) {
      toast.error('Unexpected error');
    } finally {
      onOpenChange(false);
    }
  };

  const handleCreateReview = async () => {
    try {
      await createReview(userId, game.id, selectedRateValue as RateOptions, commentValue);
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', userId] });
      toast.success('your review has been successfully submitted');
    } catch (error) {
      toast.error('Unexpected error');
    } finally {
      onOpenChange(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(userId, gameReviewedByUser?.gameId as string);
      queryClient.invalidateQueries({ queryKey: ['get-reviews-from-user', userId] });
      toast.success('Your review has been removed');
    } catch (error) {
      toast.error('Unexpected error');
    } finally {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (gameReviewedByUser) {
      setSelectedRateValue(gameReviewedByUser.rate);
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
            {reviewRateOptions.map((rate) => (
              <Button
                key={rate}
                type="button"
                onClick={() => setSelectedRateValue(rate)}
                className={` ${
                  selectedRateValue === rate
                    ? 'bg-mine-shaft-50 hover:bg-mine-shaft-100 text-mine-shaft-950'
                    : 'bg-inherit hover:bg-mine-shaft-50 text-mine-shaft-100 hover:text-mine-shaft-950'
                }  h-12 gap-1 p-1 border rounded-lg transition-colors group`}
              >
                <Image src={`/images/${rate}.svg`} width={30} height={30} alt="target" />
                <p className={'text-sm font-medium'}>{rate}</p>
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
            onClick={gameReviewedByUser ? handleUpdateReview : handleCreateReview}
            disabled={commentValue.length < 1 || !selectedRateValue}
            className="bg-cyan-700 hover:bg-cyan-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-lg font-medium"
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
