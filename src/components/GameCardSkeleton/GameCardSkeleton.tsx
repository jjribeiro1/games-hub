import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface GameCardSkeletonProps {
  quantity: number;
}

export default function GameCardSkeleton({ quantity }: GameCardSkeletonProps) {
  return (
    <>
      {Array(quantity)
        .fill(1)
        .map((_, i) => (
          <div
            key={i}
            className="bg-mine-shaft-900 w-60 h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-md transition-transform"
          >
            <Skeleton className="w-full h-1/2 rounded-t-md rounded-b-none" />
            <Skeleton className="h-4 w-1/4 ml-2 mt-4" />

            <div className="flex flex-col gap-4 mt-6 px-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="self-end h-4 w-1/3 pr-1 lg:mt-3 " />
            </div>
          </div>
        ))}
    </>
  );
}
