import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '../ui/button';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  gameTitle: string;
}

export default function WriteReviewDialog({ open, onOpenChange, gameTitle }: WriteReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-mine-shaft-950 p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl text-mine-shaft-100 font-semibold">{gameTitle}</DialogTitle>
          <div className="flex items-center justify-between gap-2 w-full">
            <Button
              type="button"
              className="bg-inherit hover:bg-mine-shaft-50 h-12 gap-1 p-1 border rounded-lg transition-colors group"
            >
              <Image src={'/images/target.svg'} width={30} height={30} alt="target" />
              <p className="text-sm text-mine-shaft-100 font-medium group-hover:text-mine-shaft-950">
                Exceptional
              </p>
            </Button>

            <Button
              type="button"
              className="bg-inherit hover:bg-mine-shaft-50 h-12 gap-1 p-1 border rounded-lg transition-colors group"
            >
              <Image src={'/images/thumbs-up.svg'} width={30} height={30} alt="thumbs up" />
              <p className="text-sm text-mine-shaft-100 font-medium group-hover:text-mine-shaft-950">
                Recommended
              </p>
            </Button>

            <Button
              type="button"
              className="bg-inherit hover:bg-mine-shaft-50 h-12 gap-1 p-1 border rounded-lg transition-colors group"
            >
              <Image src={'/images/neutral-face.svg'} width={30} height={30} alt="neutral face" />
              <p className="text-sm text-mine-shaft-100 font-medium group-hover:text-mine-shaft-950">Meh</p>
            </Button>

            <Button
              type="button"
              className="bg-inherit hover:bg-mine-shaft-50 h-12 gap-1 p-1 border rounded-lg transition-colors group"
            >
              <Image src={'/images/thumbs-down.svg'} width={30} height={30} alt="thumbs down" />
              <p className="text-sm text-mine-shaft-100 font-medium group-hover:text-mine-shaft-950">Bad</p>
            </Button>
          </div>
        </DialogHeader>

        <Textarea
          className="text-lg text-mine-shaft-950 font-medium placeholder:text-mine-shaft-900 placeholder:text-sm"
          placeholder="write a review"
        />
        <Button className="bg-cyan-700 hover:bg-cyan-800 text-mine-shaft-50 hover:text-mine-shaft-100 text-lg font-medium w-1/2 my-0 mx-auto">
          Publish
        </Button>
      </DialogContent>
    </Dialog>
  );
}
