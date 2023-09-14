import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GameImageSkeleton() {
  return (
    <div className="flex flex-col gap-2 mt-4 px-4 w-[25%]">
      <Skeleton className="w-full h-40 bg-mine-shaft-500" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-[25%] h-10 bg-mine-shaft-500" />
        <Skeleton className="w-full h-10  bg-mine-shaft-500" />
      </div>
    </div>
  );
}
