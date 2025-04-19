import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
