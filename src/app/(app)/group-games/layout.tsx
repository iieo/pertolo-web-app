import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Gruppenspiele',
  description: 'Finde heraus, in welcher Gruppe du bist!',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
