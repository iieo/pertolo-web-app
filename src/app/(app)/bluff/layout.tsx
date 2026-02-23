import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dictionary Bluff',
  description: 'Truth or bluff — can your friends tell the difference?',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
