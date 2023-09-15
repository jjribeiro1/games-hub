import { useQuery } from '@tanstack/react-query';
import { getGamesByFilters } from '@/services/game';
import { Game } from '@/types/game';

interface Props {
  platformSlug: string | null;
  genreSlug: string | null;
  sortBy?: {
    fieldPath: string;
    value: 'asc' | 'desc';
  };
}

export default function useFetchGamesBySlug({ platformSlug, genreSlug, sortBy }: Props) {
  const fetchGamesByPlatform = async () =>
    await getGamesByFilters({
      fieldPath: 'platform',
      operator: 'array-contains',
      value: platformSlug as string,
      sortBy,
    });

  const fetchGamesByGenre = async () =>
    await getGamesByFilters({
      fieldPath: 'genre',
      operator: 'array-contains',
      value: genreSlug as string,
      sortBy,
    });

  const fetchGamesByPlatformAndGenre = async () => {
    const gamesByPlatform = await fetchGamesByPlatform();
    return gamesByPlatform.filter((game) => game.genre.includes(genreSlug as string)).map((game) => game);
  };

  const fetcher = async () => {
    if (platformSlug && !genreSlug) {
      return fetchGamesByPlatform();
    }

    if (!platformSlug && genreSlug) {
      return fetchGamesByGenre();
    }

    if (platformSlug && genreSlug) {
      return fetchGamesByPlatformAndGenre();
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fetch-games-by-slug', platformSlug, genreSlug, sortBy],
    queryFn: fetcher,
    enabled: (platformSlug || genreSlug) ? true : false,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    games: data as Game[],
    isLoading,
  };
}
