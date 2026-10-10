import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Codenames',
  description: 'Zwei Teams, 25 Wörter, ein Attentäter. Findet eure Wörter über einen Hinweis.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Codenames' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
