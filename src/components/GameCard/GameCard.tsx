import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/types/game';
import useGameIcons from './useGameIcons';

interface GameCardProps {
  game: Game;
  mappedGenres: Map<string, string>;
}

export default function GameCard({ game, mappedGenres }: GameCardProps) {
  const { gameIcons } = useGameIcons(game);

  return (
    <div className="bg-mine-shaft-900 w-60 h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-md hover:scale-105 transition-transform">
      <Link href={`/game/${game.id}`}>
        <div className="flex flex-col gap-2">
          <Image
            className="aspect-video rounded-t-md"
            src={game.thumbnail}
            alt={`imagem do jogo ${game.title}`}
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
        <span className="flex items-center self-end gap-2 lg:mt-3 ">{gameIcons()}</span>
      </div>
    </div>
  );
}
