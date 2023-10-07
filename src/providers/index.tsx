'use client';
import AuthContextProvider from '@/context/auth-context';
import { Analytics } from '@vercel/analytics/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const queryClient = new QueryClient();

export default function PageProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        {children}
        <Analytics/>
        <ToastContainer limit={1} position="top-right" autoClose={2000} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
