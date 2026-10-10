import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Flaschendrehen',
  description: 'Flasche drehen oder per Fingerwahl entscheiden, wer dran ist.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Flaschendrehen' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
