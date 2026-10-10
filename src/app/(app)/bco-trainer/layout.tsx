import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'BCO Trainer',
  description: 'Rhythmen hören, lesen und erkennen. Mit Einzählen, Metronom und Quiz.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'BCO Trainer' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
