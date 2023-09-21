import React, { useState } from 'react';
import Image from 'next/image';
import { BsThreeDots } from 'react-icons/bs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Review } from '@/types/review';
import { PopoverContent } from '@radix-ui/react-popover';
import WriteReviewDialog from '../GameCard/WriteReviewDialog';
import { UserInfo } from '@/types/user-info';
import { Game } from '@/types/game';

interface ReviewCardProps {
  loggedUserInfo: UserInfo | undefined;
  game: Game;
  review: Review;
}
export default function ReviewCard({ loggedUserInfo, game, review }: ReviewCardProps) {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const gameHasBeenReviewedByUser = review.userId === loggedUserInfo?.id;

  return (
    <Card className="bg-zinc-900/50 border-2 border-mine-shaft-600 rounded">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-mine-shaft-200 font-medium underline">{review.rating}</CardTitle>
          <Image
            src={`/images/${review.rating}.svg`}
            alt="image that represent a review rating"
            width={30}
            height={30}
          />
        </div>

        {gameHasBeenReviewedByUser ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" className="bg-inherit hover:bg-inherit h-min w-min py-0.5 px-2">
                <BsThreeDots className="w-4 h-4 text-mine-shaft-100 hover:text-mine-shaft-200" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-mine-shaft-50 flex flex-col p-1 rounded">
              <div className="flex flex-col gap-2">
                <span
                  onClick={() => setOpenReviewModal(true)}
                  className="text-mine-shaft-950 hover:bg-mine-shaft-800 hover:text-mine-shaft-50 text-center text-sm p-2 rounded cursor-pointer"
                >
                  Edit review
                </span>
                <span className="text-red-600 hover:bg-red-600 hover:text-mine-shaft-50 text-center text-sm p-2 rounded cursor-pointer">
                  Delete review
                </span>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </CardHeader>

      <CardContent>
        <p className="text-mine-shaft-300">{review.comment}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Avatar>
          <AvatarFallback className="bg-mine-shaft-100 hover:bg-mine-shaft-200 text-mine-shaft-900 text-lg font-semibold h-9 w-9 capitalize cursor-pointer">
            {review.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p className="text-mine-shaft-200">{review.username}</p>
      </CardFooter>
      {openReviewModal ? (
        <WriteReviewDialog
          open={openReviewModal}
          onOpenChange={setOpenReviewModal}
          userId={loggedUserInfo?.id as string}
          username={loggedUserInfo?.username as string}
          game={game}
          gameHasBeenReviewedByUser={gameHasBeenReviewedByUser}
          oldReviewData={review}
        />
      ) : null}
    </Card>
  );
}
