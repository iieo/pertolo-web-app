import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '200 Questions',
  description: 'Auf wen trifft es am meisten zu? Gib das Handy weiter und finde es heraus.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
