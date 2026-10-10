import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Wellenlänge',
  description: 'Ein Hinweis, eine Skala. Trefft ihr gemeinsam das Ziel?',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Wellenlänge' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
