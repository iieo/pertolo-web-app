import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Hot Takes',
  description: 'Stimmst du zu oder nicht? Die Minderheit trinkt oder muss sich erklären.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Hot Takes' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
