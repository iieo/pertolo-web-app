import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Hot Potato',
  description:
    'Tickende Bombe: Nennt reihum Antworten und gebt das Handy weiter, bevor die Bombe explodiert.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Hot Potato' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
