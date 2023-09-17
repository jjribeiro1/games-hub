import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GameImageSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 w-full">
      <Skeleton className="w-full h-48 bg-mine-shaft-500" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-[30%] h-10 bg-mine-shaft-500" />
        <Skeleton className="w-full h-10  bg-mine-shaft-500" />
      </div>
    </div>
  );
}
