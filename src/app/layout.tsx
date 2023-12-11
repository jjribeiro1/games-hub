import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import PageProviders from '@/providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'gamer hub',
  description: 'Find, review and discover the best games here',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body className={`${inter.className} min-h-[100dvh] flex flex-col w-full bg-mine-shaft-950`}>
        <PageProviders>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </PageProviders>
      </body>
    </html>
  );
}
