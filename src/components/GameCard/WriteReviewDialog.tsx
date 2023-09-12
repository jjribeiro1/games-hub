import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getReviewById } from '@/services/review';
import { Game } from '@/types/game';
import { RateOptions } from '@/types/review';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  userId: string;
  game: Game;
}

export default function WriteReviewDialog({ open, onOpenChange, userId, game }: WriteReviewDialogProps) {
  const [commentValue, setCommentValue] = useState('');
  const maxCommentLength = 140;

  const { data } = useQuery({
    queryKey: ['get-review-by-id', userId, game.id],
    queryFn: () => getReviewById(userId, game.id),
  });

  const reviewRateOptions: RateOptions[] = ['Exceptional', 'Recommended', 'Meh', 'Bad'];

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
                className={` ${
                  data?.rate === rate
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
          maxLength={maxCommentLength}
        />
        <div className="text-mine-shaft-50 text-sm text-end">
          {`${commentValue.length} / ${maxCommentLength}`}
        </div>
        <DialogFooter>
          <Button className="bg-cyan-700 hover:bg-cyan-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-lg font-medium w-1/2 my-0 mx-auto">
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
