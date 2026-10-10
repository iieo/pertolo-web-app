import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Murderi',
  description:
    'Ein Mörderspiel für Stunden oder Tage. Erwische dein Ziel, bevor dich jemand erwischt.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Murderi' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
