import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Would You Rather',
  description:
    'Was würdest du eher wählen? Entscheidet euch und seht, wie alle anderen gewählt haben.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Would You Rather' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
