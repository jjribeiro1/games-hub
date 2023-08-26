import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import PageProviders from '@/providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} min-h-screen w-full bg-mine-shaft-950`}>
        <PageProviders>
          <Header />
          {children}
          <Footer />
        </PageProviders>
      </body>
    </html>
  );
}
