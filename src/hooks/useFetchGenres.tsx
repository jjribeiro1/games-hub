import { useQuery } from '@tanstack/react-query';
import { getAllGenres } from '@/services/genre';
import { Genre } from '@/types/genre';

export default function useFetchGenres() {
  const { data } = useQuery({
    queryKey: ['fetch-genres'],
    queryFn: getAllGenres,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    genres: data?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Genre[],
  };
}
