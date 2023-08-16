import { useQuery } from '@tanstack/react-query';
import { getAllPlatforms } from '@/services/platform';

export default function useFetchPlatforms() {
  const { data } = useQuery({
    queryKey: ['get-all-platforms'],
    queryFn: getAllPlatforms,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
  });

  const platformsMap = new Map<string, string>();
  data?.forEach((platform) => {
    platformsMap.set(platform.slug, platform.name);
  });

  return {
    platforms: data,
    mappedPlatforms: platformsMap,
  };
}
