import Image from 'next/image';
import React from 'react';
import LogoImg from '../../../public/images/logo.png';

export default function Logo() {
  return (
    <div className="relative h-20 w-20 sm:h-24 sm:w-24">
      <Image
        src={LogoImg}
        alt="logo do site"
        quality={100}
        priority
        sizes="100vw"
        style={{
          width: '100%',
          height: 'auto',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}