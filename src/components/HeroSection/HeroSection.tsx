"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/auth-context';

export default function HeroSection() {
  const { currentUser } = useAuthContext();
  return (
    <section>
      <div className="relative flex justify-center items-center w-[100%] h-80 md:h-[400px]">
        <div className="absolute w-full h-full -z-50">
          <Image
            className="aspect-auto opacity-20"
            src={'/images/heroImg.jpg'}
            alt="sei lá"
            fill
            sizes="(min-width: 300px, 100%)"
            priority
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-6">
          <p className="text-2xl md:text-3xl text-mine-shaft-50 font-medium">
            Discover the <em className="text-cyan-600">best</em> games here!
          </p>
          <p className="text-xs md:text-base text-mine-shaft-200 font-light">
            {"Track what you've played and search for what to play next"}
          </p>

          <div className="flex items-center gap-3">
            {!currentUser ? (
              <Button
                asChild
                className="bg-cyan-600 hover:bg-cyan-700 text-mine-shaft-100 hover:text-mine-shaft-200 text-xs sm:text-base font-medium 
               transition-colors"
              >
                <Link href={'/register'}>Get Started</Link>
              </Button>
            ) : null}

            <Button
              asChild
              className="bg-transparent hover:bg-transparent border-2 border-mine-shaft-400 hover:border-mine-shaft-100 text-mine-shaft-400 
              text-xs sm:text-base hover:text-mine-shaft-100  transition-colors"
            >
              <Link href={'/games'}>Browse Games</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
