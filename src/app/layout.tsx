import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pertolo - The Drinking Game',
  description: 'Get the party started with Pertolo!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='w-[100dvw] h-[100dvh] overflow-hidden'>
      <Head>
        <meta name="theme-color" content="black" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
