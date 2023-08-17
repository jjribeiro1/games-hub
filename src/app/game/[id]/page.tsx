'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FiPlayCircle } from 'react-icons/fi';
import { BiChevronRight } from 'react-icons/bi';
import { getGameById } from '@/services/game';

export default function GameDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data } = useQuery({
    queryKey: ['getGameById', id],
    queryFn: () => getGameById(id),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return (
    <section className="relative flex w-full h-full">
      <div className="absolute w-full h-full opacity-5 -z-50">
        <div className="relative w-full h-[60%]">
          <Image
            className="object-cover"
            src={data?.screenshots[0] as string}
            alt={`imagem do jogo ${data?.title} como background da página`}
            priority
            fill
            sizes="(min-width: 300px, 100%)"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4 px-4 w-[25%]">
        <Image
          className="aspect-video rounded-t-md"
          src={data?.thumbnail as string}
          alt={`imagem do jogo ${data?.title}`}
          width={355}
          height={200}
          priority
        />
        <div className="flex items-center gap-2 w-full">
          <Button className="w-1/5 text-mine-shaft-200 bg-mine-shaft-800 hover:bg-mine-shaft-800 rounded cursor-default">
            FREE
          </Button>
          <Button className="w-full text-white bg-cyan-600 hover:bg-cyan-700 rounded" asChild>
            <a href={`${data?.game_url}`} target="_blank">
              PLAY NOW <FiPlayCircle className="h-[18px] w-[18px] ml-1" />
            </a>
          </Button>
        </div>
      </div>

      <div className="text-mine-shaft-100 text-sm mt-4 px-4 w-[75%]">
        <div className="flex items-center gap-2">
          <Link href={'/'}>
            Home
          </Link>
          <BiChevronRight />
          <Link href={'/games'}>
            Games
          </Link>
          <BiChevronRight />
          <span>{data?.title}</span>
        </div>
      </div>
    </section>
  );
}
