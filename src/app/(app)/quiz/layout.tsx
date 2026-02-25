import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blind Maze',
    description: 'Daily blind maze puzzle — find your way through the dark!',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
}
