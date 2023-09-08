import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/context/auth-context';
import { getAllReviewsFromUser } from '@/services/review';

export default function useFetchReviewsFromUser() {
  const { currentUser } = useAuthContext();
  const { data } = useQuery({
    queryKey: ['get-reviews-from-user', currentUser?.uid],
    queryFn: () => getAllReviewsFromUser(currentUser?.uid as string),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return {
    reviews: data,
  };
}
