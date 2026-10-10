import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Ich hab noch nie',
  description: 'Wer es schon getan hat, trinkt oder nimmt einen Finger runter.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Ich hab noch nie' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
