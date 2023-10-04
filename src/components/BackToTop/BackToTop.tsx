'use client';
import { Button } from '@/components/ui/button';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';

export default function BackToTop() {
  return (
    <Button
      type="button"
      size={'icon'}
      className="bg-transparent hover:bg-transparent absolute right-6 -top-12"
      onClick={() => {
        scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }}
    >
      <BsFillArrowUpCircleFill className="w-10 h-10" />
    </Button>
  );
}
