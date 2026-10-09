import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '200 Questions',
  description: 'Auf wen trifft es am meisten zu? Gib das Handy weiter und finde es heraus.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: '200 Questions' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
