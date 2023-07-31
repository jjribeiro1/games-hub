import { RootObject } from '@/types/resource-response';
import React from 'react';

interface ResourceDataProps {
  resource: RootObject | null;
}

export default function ResourceData({ resource }: ResourceDataProps) {
  return (
    <div className="bg-[#0F172A] text-white flex flex-col gap-2 py-4 px-2 h-[500px] w-full overflow-y-scroll">
      <pre className="">{JSON.stringify(resource, null, 2)}</pre>
    </div>
  );
}
