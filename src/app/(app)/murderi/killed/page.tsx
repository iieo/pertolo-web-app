import Link from 'next/link';
import { Skull } from 'lucide-react';

export default function KilledPage() {
  return (
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-4 md:max-w-md md:mx-auto">
      <div className="w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center">
            <Skull className="w-10 h-10 text-[#dc2626]" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">You&apos;ve been killed</h1>
          <p className="text-[#888] mt-2">Your game is over. Better luck next time.</p>
        </div>
        <Link
          href="/murderi"
          className="inline-block px-6 py-3 bg-[#111] border border-[#222] rounded-2xl text-white font-semibold hover:bg-[#1a1a1a] transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
