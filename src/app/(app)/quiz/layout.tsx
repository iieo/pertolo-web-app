import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Blind Maze',
  description: 'Daily blind maze puzzle. Find your way through the dark!',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Blind Maze' },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
