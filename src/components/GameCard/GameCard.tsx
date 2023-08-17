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
    <div className="bg-mine-shaft-900 w-60 h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-md">
      <Link href={`/game/${game.id}`}>
        <Image
          className="aspect-video rounded-t-md"
          src={game.thumbnail}
          alt={`imagem do jogo ${game.title}`}
          width={320}
          height={180}
          priority
        />
      </Link>

      <div className="flex flex-col gap-2 p-2">
        <p className="text-mine-shaft-200">{game.title}</p>
        <p className="text-mine-shaft-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {game.short_description}
        </p>

        <div className="text-mine-shaft-200 flex items-center gap-2 self-end lg:mt-3">
          <span className="text-xs lg:text-sm bg-mine-shaft-600 px-1 rounded">
            {game.genre.map((genre) => mappedGenres.get(genre))}
          </span>
          <span className="flex items-center gap-2">{gameIcons()}</span>
        </div>
      </div>
    </div>
  );
}
