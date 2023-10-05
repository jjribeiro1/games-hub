import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LogoImg from '../../../public/images/logo.png';

export default function Logo() {
  return (
    <div className="relative h-16 w-16 sm:h-24 sm:w-24">
      <Link href={'/'}>
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
      </Link>
    </div>
  );
}
