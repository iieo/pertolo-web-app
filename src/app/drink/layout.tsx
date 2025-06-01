import type { Metadata } from 'next';
import { GameProvider } from './game-provider';

export const metadata: Metadata = {
    title: 'Pertolo',
    description: 'The best drinking game!',
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <GameProvider>
            {children}
        </GameProvider>
    );
}
