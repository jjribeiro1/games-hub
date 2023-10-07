import Image from 'next/image';
import { Game } from '@/types/game';

interface RecentCardGame {
  game: Game;
}

export default function RecentCardGame({ game }: RecentCardGame) {
  return (
    <div className="bg-mine-shaft-900 flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-md">
      <div className="self-center">
        <Image
          src={game.thumbnail}
          alt={`${game.title} thumbnail`}
          width={250}
          height={141}
          className="aspect-auto rounded"
        />
      </div>

      <div className="flex flex-col gap-4 sm:w-1/2">
        <div className="flex flex-col gap-1">
          <h3 className="text-mine-shaft-100 font-semibold">{game.title}</h3>
          <p className="text-mine-shaft-400 text-sm">{game.short_description}</p>
        </div>

        <div className="flex items-center gap-2">
          {game.genre.map((genre) => (
            <span
              key={genre}
              className="bg-mine-shaft-700 text-mine-shaft-200 text-sm px-2 py-0.5 rounded-md"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
