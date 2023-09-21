'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import GameImageSkeleton from './GameImageSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CommentCard } from '@/components/CommentCard';
import { ReviewCard } from '@/components/ReviewCard';
import { FiPlayCircle } from 'react-icons/fi';
import { BiChevronRight } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import useFetchGameById from '@/hooks/useFetchGameById';
import useFetchReviewsFromGame from '@/hooks/useFetchReviewsFromGame';
import useGameIcons from '@/components/GameCard/useGameIcons';
import useFindMostFrequentRatingValue from './useFindMostFrequentRatingValue';
import useFetchPlatforms from '@/hooks/useFetchPlatforms';
import useFetchGenres from '@/hooks/useFetchGenres';
import { timestampToDate } from '@/utils/timestamp-to-date';
import useFetchCommentsFromGame from '@/hooks/useFetchCommentsFromGame';
import WriteCommentDialog from './WriteCommentDialog';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';

export default function GameDetailsPage() {
  const [openCollapsible, setOpenCollapsable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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
      <main className="py-8 px-6 w-full min-h-screen">
        <article className="flex gap-8 py-4 w-full">
          <section className="flex flex-col gap-2 w-[25%]">
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

          <section className="flex flex-col gap-2 w-[50%]">
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
                <div className="h-8 flex flex-nowrap">
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

          <section className="flex flex-col gap-2 w-[25%]">
            <iframe
              className="w-full h-48"
              src="https://www.youtube-nocookie.com/embed/innmNewjkuk?si=O6atuM6fMYlBTbpV"
              title="YouTube video player"
            ></iframe>
            <div className="bg-mine-shaft-800 py-2 rounded">
              <p className="text-mine-shaft-200 text-center">OFFICIAL TRAILER</p>
            </div>
          </section>
        </article>

        <article className="flex gap-4 py-4 w-full">
          <section className="flex flex-col gap-6 w-[50%]">
            <Collapsible
              open={openCollapsible}
              onOpenChange={setOpenCollapsable}
              className="flex flex-col gap-4"
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
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-mine-shaft-100 text-3xl font-medium">Additional Information</h2>

              <div className="grid grid-cols-2 gap-y-6 gap-x-2 w-full">
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

          <section className="flex flex-col gap-6 w-[50%]">
            <div className="flex flex-col gap-4">
              <h2 className="text-mine-shaft-100 text-3xl font-medium">Minimum System Requirements</h2>

              <div className="grid grid-cols-2 gap-y-6 gap-x-2 w-full">
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
              <div className="flex flex-col gap-4">
                <h2 className="text-mine-shaft-100 text-3xl font-medium">Screenshots</h2>

                <div className="flex items-center gap-4">
                  {game?.screenshots.map((screenshot) => (
                    <Image
                      key={screenshot}
                      className="aspect-video rounded-t-md"
                      src={screenshot}
                      alt={`screenshot of game ${game.title}`}
                      width={320}
                      height={180}
                      priority
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </article>

        <article className="flex flex-col items-center gap-4 py-12">
          <h2 className="text-mine-shaft-100 text-2xl font-medium">{game?.title} reviews and comments</h2>

          <Tabs defaultValue="reviews" className="flex flex-col gap-6 w-full max-w-3xl">
            <TabsList className="bg-inherit flex gap-4">
              <TabsTrigger value="reviews" asChild>
                <Button className="bg-inherit hover:bg-inherit text-mine-shaft-400 text-lg data-[state=active]:text-mine-shaft-100 data-[state=active]:underline gap-2">
                  Reviews
                  <span className="text-sm mb-4 no-underline">{reviewsWithComment?.length || 0}</span>
                </Button>
              </TabsTrigger>
              <TabsTrigger value="comments" asChild>
                <Button className="bg-inherit hover:bg-inherit text-mine-shaft-400 text-lg data-[state=active]:text-mine-shaft-100 data-[state=active]:underline gap-2">
                  Comments
                  <span className="text-sm mb-4 no-underline">{commentsFromGame?.length || 0}</span>
                </Button>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews">
              <ul className="flex flex-col gap-4">
                {reviewsWithComment?.map((review) => (
                  <li key={review.id}>
                    <ReviewCard review={review} />
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="comments" className="flex flex-col gap-6 items-center">
              <Button
                type="button"
                onClick={() => setOpenDialog(true)}
                className="bg-mine-shaft-800 hover:bg-mine-shaft-700 flex flex-col gap-2 py-4 h-min w-[80%] rounded-sm"
              >
                <AiOutlinePlus className="w-6 h-6 self-start" />
                <span className="self-start text-lg">Write a comment</span>
              </Button>
              {openDialog ? (
                <WriteCommentDialog open={openDialog} onOpenChange={setOpenDialog} gameId={gameId} />
              ) : null}
              <ul className="flex flex-col gap-4 w-full">
                {commentsFromGame?.map((comment) => (
                  <li key={comment.id}>
                    <CommentCard loggedUserInfo={loggedUserInfo} comment={comment} />
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </article>
      </main>
    </>
  );
}
