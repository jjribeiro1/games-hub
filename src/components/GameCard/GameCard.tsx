'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RequireSignInAlert } from '@/components/RequireSignInAlert';
import GameInLibraryPopover from './GameInLibraryPopover';
import GameReviewPopover from './GameReviewPopover';
import useGameIcons from './useGameIcons';
import { Game } from '@/types/game';
import { UserInfo } from '@/types/user-info';
import { Review } from '@/types/review';

interface GameCardProps {
  game: Game;
  loggedUserInfo: UserInfo | null | undefined;
  reviewsFromUser: Review[];
}

export default function GameCard({ game, loggedUserInfo, reviewsFromUser }: GameCardProps) {
  const [openRequireSignInAlert, setOpenRequireSignInAlert] = useState(false);
  const [signInAlertMessage, setSignInAlertMessage] = useState('');
  const { gameIcons } = useGameIcons(game);


  return (
    <div className="bg-mine-shaft-900 w-72 h-72 sm:w-64 sm:h-64 md:w-60 lg:w-72 lg:h-72 min-[1440px]:w-80 min-[1440px]:h-80 rounded-md hover:scale-105 transition-transform">
      <Link href={`/game/${game.id}`}>
        <div className="flex flex-col gap-2">
          <Image
            className="aspect-video rounded-t-md"
            src={game.thumbnail}
            alt={`${game.title} image`}
            width={320}
            height={180}
            priority
          />
          <p className="text-mine-shaft-200 pl-2">{game.title}</p>
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-2">
        <p className="text-mine-shaft-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {game.short_description}
        </p>

        <div className="flex items-center justify-between px-1 lg:mt-3 w-full">
          <div className="flex gap-2">
            <GameInLibraryPopover game={game} loggedUserInfo={loggedUserInfo} />
            <GameReviewPopover
              game={game}
              loggedUserInfo={loggedUserInfo}
              reviewsFromUser={reviewsFromUser}
              setOpenRequireSignInAlert={setOpenRequireSignInAlert}
              setSignInAlertMessage={setSignInAlertMessage}
            />
          </div>

          <span className="flex items-center gap-2">{gameIcons()}</span>
        </div>
      </div>
      {openRequireSignInAlert ? (
        <RequireSignInAlert
          open={openRequireSignInAlert}
          onOpenChange={setOpenRequireSignInAlert}
          message={signInAlertMessage}
        />
      ) : null}
    </div>
  );
}
