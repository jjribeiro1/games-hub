import React from 'react';
import { Github } from 'lucide-react';
import { BackToTop } from '@/components/BackToTop';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-mine-shaft-900 py-3 w-full">
      <div className="text-sm flex items-center justify-center gap-1">
        <span className="text-mine-shaft-100">Developed By</span>
        <Link
          href={'https://github.com/jjribeiro1'}
          target="_blank"
          className="flex items-center gap-0.5 text-mine-shaft-100 hover:text-mine-shaft-200"
        >
          jjribeiro1 <Github className="w-3.5 h-3.5" />
        </Link>
      </div>
      <BackToTop />
    </footer>
  );
}
