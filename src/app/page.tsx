'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center bg-black min-h-screen">
      <div className="flex flex-col items-center gap-10 w-full max-w-lg px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-widest text-center drop-shadow-[0_2px_16px_rgba(255,255,255,0.15)]">
          PARTY GAME HUB
        </h1>
        <p className="text-lg md:text-xl text-[#bbb] text-center max-w-md font-mono tracking-wide">
          Choose your game and start the fun. Minimal, fast, and made for friends.
        </p>
        <nav className="flex flex-col md:flex-row gap-6 w-full justify-center items-center mt-6">
          <Link
            href="/imposter"
            className="group relative w-full md:w-60 h-36 flex flex-col justify-center group/link px-8 py-6 rounded-2xl bg-gradient-to-tr from-[#222] via-[#111] to-[#333] shadow-2xl border-2 border-white/10 hover:border-white/30 hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <span className="block text-2xl font-bold text-white tracking-widest font-mono group-hover:text-black transition">
              IMPOSTER
            </span>
            <span className="absolute top-2 right-4 text-white/40 opacity-60 text-lg group-hover:opacity-100 transition">→</span>
            <span className="block mt-2 text-[#bbb] text-xs font-mono uppercase tracking-wider">
              Find the secret agents among your friends
            </span>
            <span className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition bg-gradient-to-br from-white/80 to-black/0" />
          </Link>
          <Link
            href="/drink"
            className="group relative w-full md:w-60 h-36 flex flex-col justify-center group/link px-8 py-6 rounded-2xl bg-gradient-to-tr from-[#333] via-[#111] to-[#222] shadow-2xl border-2 border-white/10 hover:border-white/30 hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <span className="block text-2xl font-bold text-white tracking-widest font-mono group-hover:text-black transition">
              DRINK
            </span>
            <span className="absolute top-2 right-4 text-white/40 opacity-60 text-lg group-hover:opacity-100 transition">→</span>
            <span className="block mt-2 text-[#bbb] text-xs font-mono uppercase tracking-wider">
              The ultimate party drinking game
            </span>
            <span className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition bg-gradient-to-br from-white/80 to-black/0" />
          </Link>
        </nav>
      </div>
    </main>
  )
}
