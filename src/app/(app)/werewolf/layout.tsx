import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Werwolf',
  description: 'Werwolf für alle am eigenen Handy. Die App erzählt, ihr spielt.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Werwolf' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-black">{children}</div>;
}
