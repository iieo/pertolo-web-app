import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Drink',
  description: 'Das Trinkspiel für eure Runde: Namen eintragen, Kategorien wählen, losspielen.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Drink' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
