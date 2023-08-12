import { useQuery } from '@tanstack/react-query';
import { getAllPlatforms } from '@/services/platform';
import { Platform } from '@/types/platform';

export default function useFetchPlatforms() {
  const { data } = useQuery({
    queryKey: ['fetch-platforms'],
    queryFn: getAllPlatforms,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    platforms: data?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Platform[],
  };
}
