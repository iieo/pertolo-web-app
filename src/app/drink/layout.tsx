import type { Metadata } from 'next';
import Footer from '@/components/footer';

export const metadata: Metadata = {
    title: 'Pertolo',
    description: 'Play games with your friends!',
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
            <Footer className='text-white fixed bottom-0 left-0 w-full bg-purple-950' />
        </div>
    );
}
