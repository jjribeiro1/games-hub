'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import GameImageSkeleton from './GameImageSkeleton';
import { FiPlayCircle } from 'react-icons/fi';
import { BiChevronRight } from 'react-icons/bi';
import useFetchGameById from '@/hooks/useFetchGameById';
import useFetchReviewsFromGame from '@/hooks/useFetchReviewsFromGame';
import useGameIcons from '@/components/GameCard/useGameIcons';
import useFindMostFrequentRatingValue from './useFindMostFrequentRatingValue';
import { timestampToDate } from '@/utils/timestamp-to-date';

export default function GameDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { game, isLoading } = useFetchGameById(id);
  const { reviewsFromGame, isLoadingReviewsFromGame } = useFetchReviewsFromGame(game);
  const { mostFrequentRating } = useFindMostFrequentRatingValue(reviewsFromGame);
  const { gameIcons } = useGameIcons(game);

  return (
    <main className="relative flex w-full min-h-screen">
      <div className="absolute w-full h-full opacity-10 -z-50">
        <div className="relative w-full h-[60%]">
          {!isLoading ? (
            <Image
              className="object-cover"
              src={game?.screenshots[0] as string}
              alt={`imagem do jogo ${game?.title} como background da página`}
              priority
              fill
              sizes="(min-width: 300px, 100%)"
            />
          ) : null}
        </div>
      </div>

      {!isLoading ? (
        <section className="flex flex-col gap-2 pt-4 px-4 w-[25%]">
          <Image
            className="aspect-video rounded-t-md"
            src={game?.thumbnail as string}
            alt={`imagem do jogo ${game?.title}`}
            width={355}
            height={200}
            priority
          />
          <div className="flex items-center gap-2">
            {game.isFree ? (
              <Button className="w-[30%] text-mine-shaft-200 bg-mine-shaft-800 hover:bg-mine-shaft-800 rounded cursor-default">
                FREE
              </Button>
            ) : null}

            <Button className="w-full text-mine-shaft-100 bg-cyan-700 hover:bg-cyan-800 rounded" asChild>
              <a href={`${game?.game_url}`} target="_blank">
                PLAY NOW <FiPlayCircle className="h-[18px] w-[18px] ml-1" />
              </a>
            </Button>
          </div>
        </section>
      ) : (
        <GameImageSkeleton />
      )}

      <section className="flex flex-col gap-2 pt-4 px-4 w-[75%]">
        <nav className="text-mine-shaft-100 text-xs flex items-center gap-2">
          <ul className="flex items-center gap-2">
            <li className="flex items-center gap-2">
              <Link href={'/'}>Home</Link>
              <BiChevronRight />
            </li>
            <li className="flex items-center gap-2">
              <Link href={'/games'}>Games</Link>
              <BiChevronRight />
            </li>
          </ul>
          <span>{game?.title}</span>
        </nav>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="bg-mine-shaft-100 text-mine-shaft-950 text-sm px-2 rounded">
              {timestampToDate(game?.release_date as unknown as Timestamp)}
            </span>
            <span className="flex items-center gap-2">{gameIcons()}</span>
          </div>

          <h1 className="text-6xl text-mine-shaft-50 font-semibold">{game?.title}</h1>
        </div>

        <div className="space-y-2">
          {mostFrequentRating ? (
            <div className="flex items-center gap-2">
              <span className="text-mine-shaft-100 text-lg">{mostFrequentRating.name}</span>
              <Image src={`/images/${mostFrequentRating.name}.svg`} alt="xd" width={30} height={30} />
            </div>
          ) : null}

          {!isLoadingReviewsFromGame ? (
            <Button
              size={'sm'}
              className="text-mine-shaft-400 hover:text-mine-shaft-500 bg-inherit hover:bg-inherit underline px-0"
            >
              {reviewsFromGame?.length || 0} RATINGS
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
