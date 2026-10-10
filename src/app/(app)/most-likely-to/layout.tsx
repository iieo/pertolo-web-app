import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Most Likely To',
  description: 'Auf drei zeigen alle auf jemanden. Wer die meisten Finger abbekommt, trinkt.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Most Likely To' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
