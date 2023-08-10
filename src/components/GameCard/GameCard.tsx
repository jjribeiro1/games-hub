import React from 'react';
import Image from 'next/image';
import { BsWindows } from 'react-icons/bs';
import { Game } from '@/types/game';
import Link from 'next/link';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-mine-shaft-900 w-60 h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-md cursor-pointer">
      <Link href={`/game/${game.id}`} prefetch>
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
          <span className="text-xs lg:text-sm bg-mine-shaft-600 px-1 rounded">{game.genre}</span>
          <span>
            {game.platform === 'PC' ? <BsWindows className="text-mine-shaft-400 w-5 h-5" /> : 'PC'}
          </span>
        </div>
      </div>
    </div>
  );
}
