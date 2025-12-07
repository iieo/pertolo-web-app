import { Music } from 'lucide-react';

export function Header() {
    return (
        <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 md:p-3 bg-purple-100 rounded-2xl">
                <Music className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                BCO Trainer
            </h1>
        </div>
    );
}
