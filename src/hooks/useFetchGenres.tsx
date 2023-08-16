import { useQuery } from '@tanstack/react-query';
import { getAllGenres } from '@/services/genre';

export default function useFetchGenres() {
  const { data } = useQuery({
    queryKey: ['get-all-genres'],
    queryFn: getAllGenres,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    genres: data,
  };
}
