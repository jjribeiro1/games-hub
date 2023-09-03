'use client';
import { useParams, useSearchParams } from 'next/navigation';

interface Props {
  mappedPlatforms: Map<string, string>;
}

export default function useVerifyGamesPageUrl({ mappedPlatforms }: Props) {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const activeSortBy = searchParams.get('sort_by') as string;
  let platformSlug: string | null = null;
  let genreSlug: string | null = null;

  if (slug?.length === 1) {
    mappedPlatforms.has(slug[0]) ? (platformSlug = slug[0]) : (genreSlug = slug[0]);
  }
  if (slug?.length > 1) {
    genreSlug = slug[1];
    platformSlug = slug[0];
  }

  return {
    platformSlug,
    genreSlug,
    activeSortBy,
    searchParams,
  };
}
