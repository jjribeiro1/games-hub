import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/context/auth-context';
import { getUserById } from '@/services/user';

export default function useLoggedUserInfo() {
  const { currentUser } = useAuthContext();

  const fetcher = currentUser ? getUserById(currentUser.uid) : null

  const { data } = useQuery({
    queryKey: ['logged-user-info', currentUser?.uid],
    queryFn: () => fetcher,
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 30,
  });

  return { loggedUserInfo: data };
}
