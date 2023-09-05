'use client';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';
import { GameCard } from '@/components/GameCard';
import { GameTypeInLibraryOption } from '@/types/user-info';

export default function MyLibraryPage() {
  const { loggedUserInfo } = useLoggedUserInfo();
  const library = loggedUserInfo?.library.map((game) => game);
  const accordionGameTypeOptions: GameTypeInLibraryOption[] = [
    'Uncategorized',
    'Currently Playing',
    'Completed',
    'Played',
    'Not Played',
  ];

  return (
    <main className="h-screen p-4">
      <Accordion type="multiple" className="w-full">
        {accordionGameTypeOptions.map((option) => {
          const games = library?.filter((game) => game.type === option);
          return (
            <AccordionItem key={option} value={option} disabled={games?.length === 0}>
              <AccordionTrigger className="text-mine-shaft-100 text-lg">{`${option} (${games?.length})`}</AccordionTrigger>
              <AccordionContent className="p-2">
                {games?.map((game) => <GameCard key={game.id} game={game} loggedUserInfo={loggedUserInfo} />)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </main>
  );
}
