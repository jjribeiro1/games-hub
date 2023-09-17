'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import GameImageSkeleton from './GameImageSkeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FiPlayCircle } from 'react-icons/fi';
import { BiChevronRight } from 'react-icons/bi';
import useFetchGameById from '@/hooks/useFetchGameById';
import useFetchReviewsFromGame from '@/hooks/useFetchReviewsFromGame';
import useGameIcons from '@/components/GameCard/useGameIcons';
import useFindMostFrequentRatingValue from './useFindMostFrequentRatingValue';
import { timestampToDate } from '@/utils/timestamp-to-date';

export default function GameDetailsPage() {
  const [openCollapsible, setOpenCollapsable] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const { game, isLoading } = useFetchGameById(id);
  const { reviewsFromGame, isLoadingReviewsFromGame } = useFetchReviewsFromGame(game);
  const { mostFrequentRating, allRatingsInfo } = useFindMostFrequentRatingValue(reviewsFromGame);
  const { gameIcons } = useGameIcons(game);

  return (
    <main className="relative w-full min-h-screen">
      <div className="absolute w-full opacity-10 -z-50 h-[60%]">
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

      <article className="flex pt-4 w-full h-min">
        <section className="flex flex-col gap-2 px-4 w-[25%]">
          {!isLoading ? (
            <>
              <Image
                className="aspect-video rounded-t-md"
                src={game?.thumbnail as string}
                alt={`imagem do jogo ${game?.title}`}
                width={355}
                height={200}
                priority
              />
              <div className="flex items-center gap-2">
                {game?.isFree ? (
                  <Button className="w-[30%] text-mine-shaft-200 bg-mine-shaft-800 hover:bg-mine-shaft-800 rounded cursor-default">
                    FREE
                  </Button>
                ) : null}

                <Button className="w-full text-mine-shaft-200 bg-cyan-700 hover:bg-cyan-800 rounded" asChild>
                  <Link href={`${game?.game_url}`} target="_blank">
                    PLAY NOW <FiPlayCircle className="h-[18px] w-[18px] ml-1" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <GameImageSkeleton />
          )}
        </section>

        <section className="flex flex-col gap-2 px-4 w-[50%]">
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
                <Image
                  src={`/images/${mostFrequentRating.name}.svg`}
                  alt="image of most frequent rating"
                  width={30}
                  height={30}
                />
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

          {allRatingsInfo ? (
            <div className="flex flex-col w-full gap-4">
              <div className="h-10">
                <span
                  className={`bg-green-500 inline-block h-full rounded-l-lg w-[${allRatingsInfo.at(0)
                    ?.percentage}%] hover:shadow-2xl hover:shadow-mine-shaft-400 hover:brightness-110 cursor-pointer`}
                />

                <span
                  className={`bg-blue-500 inline-block h-full w-[${allRatingsInfo.at(1)
                    ?.percentage}%] hover:shadow-2xl hover:shadow-mine-shaft-400 hover:brightness-110 cursor-pointer`}
                />
                <span
                  className={`bg-yellow-500 inline-block h-full w-[${allRatingsInfo.at(2)
                    ?.percentage}%] hover:shadow-2xl hover:shadow-mine-shaft-400 hover:brightness-110 cursor-pointer`}
                />

                <span
                  className={`bg-red-500 inline-block h-full rounded-r-lg w-[${allRatingsInfo.at(3)
                    ?.percentage}%] hover:shadow-xl hover:shadow-mine-shaft-400 hover:brightness-110 cursor-pointer`}
                />
              </div>

              <div className="flex items-center gap-2">
                {allRatingsInfo.map((rating, i) => (
                  <Button
                    key={i}
                    className="bg-inherit hover:bg-inherit border-2 border-transparent hover:border-mine-shaft-400 rounded-l-3xl rounded-r-3xl px-2 gap-2"
                  >
                    <span className={`h-3 w-3 rounded-full ${rating.bgColor}`}></span>
                    <span className="text-sm font-semibold">{rating.name}</span>
                    <span className="text-mine-shaft-300 text-sm">{rating.value}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="flex flex-col gap-2 px-4 w-[25%]">
          <iframe
            className="w-full h-48"
            src="https://www.youtube-nocookie.com/embed/innmNewjkuk?si=O6atuM6fMYlBTbpV"
            title="YouTube video player"
          ></iframe>
          <div className="bg-mine-shaft-800 py-2 rounded">
            <h2 className="text-mine-shaft-200 text-center">OFFICIAL TRAILER</h2>
          </div>
        </section>
      </article>

      <article className="flex pt-4 w-full h-min">
        <section className="px-4 w-[50%]">
          <Collapsible
            open={openCollapsible}
            onOpenChange={setOpenCollapsable}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-mine-shaft-200 text-3xl font-medium">About {game?.title}</h3>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  className="bg-mine-shaft-800 hover:bg-mine-shaft-900 text-mine-shaft-200 text-sm gap-1 px-2 py-0 h-min rounded"
                >
                  <span className="transition-all">{openCollapsible ? '-' : '+'}</span>
                  <span className="transition-all">{openCollapsible ? 'Show less' : 'Read more'}</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <p className="text-mine-shaft-300">{game?.short_description}</p>
            <CollapsibleContent>
              <p className="text-mine-shaft-300">{game?.description}</p>
            </CollapsibleContent>
          </Collapsible>
        </section>
      </article>
    </main>
  );
}
