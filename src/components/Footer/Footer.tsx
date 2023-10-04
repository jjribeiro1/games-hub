import React from 'react';
import { BackToTop } from '@/components/BackToTop';

export default function Footer() {
  return (
    <footer className="relative bg-mine-shaft-900 text-lg text-mine-shaft-100 py-2 w-full">
      <p className="text-center">Developed By João Vitor</p>
      <BackToTop />
    </footer>
  );
}
