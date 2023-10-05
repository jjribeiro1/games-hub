'use client';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GameCard } from '@/components/GameCard';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';
import useFetchReviewsFromUser from '@/hooks/useFetchReviewsFromUser';
import { GameTypeInLibraryOption } from '@/types/user-info';
import { Review } from '@/types/review';

export default function MyLibraryPage() {
  const { loggedUserInfo } = useLoggedUserInfo();
  const { reviews } = useFetchReviewsFromUser();
  const library = loggedUserInfo?.library?.map((game) => game);
  const accordionGameTypeOptions: GameTypeInLibraryOption[] = [
    'Uncategorized',
    'Currently Playing',
    'Completed',
    'Played',
    'Not Played',
  ];

  return (
    <main className="min-h-screen p-4">
      <Accordion type="multiple" className="w-full">
        {accordionGameTypeOptions.map((option) => {
          const games = library?.filter((game) => game.type === option);
          return (
            <AccordionItem key={option} value={option}>
              <AccordionTrigger className="text-mine-shaft-100 text-lg">{`${option} (${
                games?.length || 0
              })`}</AccordionTrigger>
              {games ? (
                <AccordionContent className="p-2">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-x-4 gap-y-6">
                    {games?.map((game) => (
                      <li key={game.id}>
                        <GameCard
                          key={game.id}
                          game={game}
                          loggedUserInfo={loggedUserInfo}
                          reviewsFromUser={reviews as Review[]}
                        />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              ) : null}
            </AccordionItem>
          );
        })}
      </Accordion>
    </main>
  );
}
