'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FiPlayCircle } from 'react-icons/fi';
import { BiChevronRight } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ReviewAndCommentTabs from './ReviewAndCommentTabs';
import GameImageSkeleton from './GameImageSkeleton';
import useGameIcons from '@/components/GameCard/useGameIcons';
import useFetchGameById from '@/hooks/useFetchGameById';
import useFetchReviewsFromGame from '@/hooks/useFetchReviewsFromGame';
import useFindMostFrequentRatingValue from './useFindMostFrequentRatingValue';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import useFetchGenres from '@/hooks/useFetchGenres';
import useFetchCommentsFromGame from '@/hooks/useFetchCommentsFromGame';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';
import { Timestamp } from 'firebase/firestore';
import { timestampToDate } from '@/utils/timestamp-to-date';

export default function GameDetailsPage() {
  const [openCollapsible, setOpenCollapsable] = useState(false);
  const params = useParams();
  const gameId = params.id as string;
  const { loggedUserInfo } = useLoggedUserInfo();
  const { game, isLoading } = useFetchGameById(gameId);
  const { commentsFromGame } = useFetchCommentsFromGame(gameId);
  const { reviewsFromGame, reviewsWithComment, isLoadingReviewsFromGame } = useFetchReviewsFromGame(game);
  const { mostFrequentRating, allRatingsInfo } = useFindMostFrequentRatingValue(reviewsFromGame);
  const { mappedPlatforms } = useFetchPlatforms();
  const { mappedGenres } = useFetchGenres();
  const { gameIcons } = useGameIcons(game);

  return (
    <>
      <div className="relative pb-8 w-full">
        <div className="absolute w-full opacity-10 -z-50 h-80 sm:h-[400px]">
          {!isLoading ? (
            <Image
              className="object-cover"
              src={game?.screenshots[0] as string}
              alt={`${game?.title} background image`}
              priority
              fill
              sizes="(min-width: 300px, 100%)"
            />
          ) : null}
        </div>
        <article className="flex gap-8 sm:px-6 sm:gap-12 py-4 w-full">
          <section className="hidden md:flex flex-col gap-2">
            {!isLoading ? (
              <>
                <Image
                  className="aspect-video rounded-t-md"
                  src={game?.thumbnail as string}
                  alt={`${game?.title} image`}
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

                  <Button
                    className="w-full text-mine-shaft-200 bg-cyan-700 hover:bg-cyan-800 rounded"
                    asChild
                  >
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

          <section className="flex flex-col gap-2 w-full">
            <nav className="text-mine-shaft-100 text-xs flex justify-center md:justify-normal gap-2">
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

            <div className="flex flex-col items-center md:items-start gap-4 pb-4">
              <div className="flex items-center gap-4">
                <span className="bg-mine-shaft-100 text-mine-shaft-950 text-xs sm:text-sm py-0.5 px-2 rounded">
                  {timestampToDate(game?.release_date as unknown as Timestamp)}
                </span>
                <span className="flex items-center gap-2">{gameIcons()}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-mine-shaft-50 font-semibold">
                {game?.title}
              </h1>
            </div>

            <div className="pl-4 md:pl-0 space-y-2 my-0 mx-auto md:mx-0">
              {mostFrequentRating ? (
                <div className="flex items-center gap-2">
                  <span className="text-mine-shaft-100 text-base md:text-lg">{mostFrequentRating.name}</span>
                  <Image
                    src={`/images/${mostFrequentRating.name}.svg`}
                    alt="image of most frequent rating"
                    width={30}
                    height={30}
                  />
                </div>
              ) : null}

              {!isLoadingReviewsFromGame ? (
                <p className="text-mine-shaft-400 hover:text-mine-shaft-500 text-sm sm:text-base tracking-wider underline underline-offset-4">
                  {reviewsFromGame?.length || 0} RATINGS
                </p>
              ) : null}
            </div>

            {allRatingsInfo ? (
              <div className="flex flex-col w-full gap-4 p-4 md:pl-0 items-center md:items-start">
                <div className="h-6 md:h-8 w-[75%] flex flex-nowrap">
                  <span
                    className={`bg-green-500 inline-block h-full w-[${allRatingsInfo.at(0)
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
                    className={`bg-red-500 inline-block h-full w-[${allRatingsInfo.at(3)
                      ?.percentage}%] hover:shadow-xl hover:shadow-mine-shaft-400 hover:brightness-110 cursor-pointer`}
                  />
                </div>

                <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4">
                  {allRatingsInfo.map((rating, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`inline-blockblock h-3 w-3 rounded-full ${rating.bgColor}`}></span>
                      <span className="text-mine-shaft-100 text-sm font-semibold">{rating.name}</span>
                      <span className="text-mine-shaft-300 text-sm">{rating.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <Button
              className="md:hidden text-mine-shaft-200 bg-cyan-700 hover:bg-cyan-800 rounded w-max my-2 mx-auto"
              asChild
            >
              <Link href={`${game?.game_url}`} target="_blank">
                PLAY NOW <FiPlayCircle className="h-[18px] w-[18px] ml-1" />
              </Link>
            </Button>
          </section>
        </article>

        <article className="flex flex-col items-center xl:flex-row xl:justify-normal xl:items-start gap-4 px-6 py-12 w-full">
          <section className="flex flex-col gap-10 py-6 xl:w-[50%]">
            <Collapsible
              open={openCollapsible}
              onOpenChange={setOpenCollapsable}
              className="flex flex-col items-center xl:items-start gap-4"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-mine-shaft-100 text-3xl font-medium">About {game?.title}</h2>
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
              <p className="text-mine-shaft-200">{game?.short_description}</p>
              <CollapsibleContent>
                <p className="text-mine-shaft-200">{game?.description}</p>
              </CollapsibleContent>
            </Collapsible>
            <div className="flex flex-col items-center xl:items-start gap-4 xl:w-full">
              <h2 className="text-mine-shaft-100 text-3xl font-medium">Additional Information</h2>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-2 w-full">
                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Platforms</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {game?.platform.map((platform, i, arr) => (
                      <li key={platform}>
                        <Link
                          href={`/games/${platform}`}
                          className="text-mine-shaft-100 hover:text-mine-shaft-200"
                        >
                          {`${mappedPlatforms.get(platform)}${platform !== arr[arr.length - 1] ? ', ' : ''}`}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Genres</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {game?.genre.map((genre, i, arr) => (
                      <li key={genre}>
                        <Link
                          href={`/games/${genre}`}
                          className="text-mine-shaft-100 hover:text-mine-shaft-200"
                        >
                          {`${mappedGenres.get(genre)}${genre !== arr[arr.length - 1] ? ', ' : ''}`}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Developer</h3>
                  <p className="text-mine-shaft-100 hover:text-mine-shaft-200"> {game?.developer}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Publisher</h3>
                  <p className="text-mine-shaft-100 hover:text-mine-shaft-200"> {game?.publisher}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Release Date</h3>
                  <p className="text-mine-shaft-100 hover:text-mine-shaft-200">
                    {timestampToDate(game?.release_date as unknown as Timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-10 py-6 xl:w-[50%]">
            <div className="flex flex-col items-center xl:items-start gap-4">
              <h2 className="text-mine-shaft-100 text-3xl font-medium">Minimum System Requirements</h2>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-2 w-full">
                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">OS</h3>
                  <p className="text-mine-shaft-100 hover:text-mine-shaft-200">
                    {game?.minimum_system_requirements?.os || 'Runs in any web browser'}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Processor</h3>
                  <p className="text-mine-shaft-100 hover:text-mine-shaft-200">
                    {game?.minimum_system_requirements?.processor || 'Only web browser is required'}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Memory</h3>
                  <p className="text-mine-shaft-100 hover:text-mine-shaft-200">
                    {game?.minimum_system_requirements?.memory || 'Only web browser is required'}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Graphics</h3>
                  <p className="text-mine-shaft-100 hover:text-mine-shaft-200">
                    {game?.minimum_system_requirements?.graphics || 'None'}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-mine-shaft-400 font-semibold">Storage</h3>
                  <p className="text-mine-shaft-100 hover:text-mine-shaft-200">
                    {game?.minimum_system_requirements?.storage || 'None'}
                  </p>
                </div>
              </div>
            </div>

            {game?.screenshots ? (
              <div className="flex flex-col items-center xl:items-start gap-4">
                <h2 className="text-mine-shaft-100 text-3xl font-medium">Screenshots</h2>

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {game?.screenshots.map((screenshot) => (
                    <Image
                      key={screenshot}
                      className="aspect-video rounded-t-md"
                      src={screenshot}
                      alt={`screenshot of game ${game.title}`}
                      width={290}
                      height={163}
                      priority
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </article>

        <article className="flex flex-col items-center gap-4 px-6 py-12">
          <h2 className="text-mine-shaft-100 text-2xl font-medium">{game?.title} reviews and comments</h2>
          <ReviewAndCommentTabs
            loggedUserInfo={loggedUserInfo}
            game={game}
            commentsFromGame={commentsFromGame}
            reviewsWithComment={reviewsWithComment}
          />
        </article>
      </div>
    </>
  );
}
