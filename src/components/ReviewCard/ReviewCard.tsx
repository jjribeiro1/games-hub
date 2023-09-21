import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;
}
export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="bg-zinc-900/50 border-2 border-mine-shaft-600 rounded">
      <CardHeader className="flex flex-row items-center gap-2">
        <CardTitle className="text-mine-shaft-200 font-medium underline">{review.rating}</CardTitle>
        <Image
          src={`/images/${review.rating}.svg`}
          alt="image that represent a review rating"
          width={30}
          height={30}
        />
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
    </Card>
  );
}
