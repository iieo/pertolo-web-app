import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'BCO Trainer',
  description: 'Train your rhythm reading.',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
