import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const geistSans = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js Template v15',
  description: 'Created by ab@deutschlandgpt.de and mb@titanom.com. Use as a template',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
