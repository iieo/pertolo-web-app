import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Heads Up',
  description:
    'Errate das Wort auf deiner Stirn. Die anderen erklären, du kippst das Handy für richtig oder weiter.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Heads Up' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
