import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Imposter',
  description: 'Find the imposter!',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Imposter' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
