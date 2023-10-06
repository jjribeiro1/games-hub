'use client';
import { redirect } from 'next/navigation';
import useLoggedUserInfo from '@/hooks/useLoggedUserInfo';
import CreateGameForm from './CreateGameForm';

export default function AdminPage() {
  const { loggedUserInfo, isLoading } = useLoggedUserInfo();
  const isAdmin = loggedUserInfo?.isAdmin;
  if (!isLoading && !isAdmin) {
    redirect('/');
  }

  return !isLoading && isAdmin && <CreateGameForm />;
}
