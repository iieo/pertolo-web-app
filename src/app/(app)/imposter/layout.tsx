import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pertolo',
    description: 'Find the imposter!',
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
        </div>
    );
}
