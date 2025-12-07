import Link from 'next/link'

export default function Home() {
  return (
    // Changed: 'fixed inset-0' removed. Added 'py-24' for scroll spacing.
    <main className="min-h-screen bg-black flex flex-col items-center justify-center py-24 px-4">

      <div className="flex flex-col items-center gap-10 w-full max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-widest text-center drop-shadow-[0_2px_16px_rgba(255,255,255,0.15)]">
            Pertolo
          </h1>
          <p className="text-lg md:text-xl text-[#bbb] text-center max-w-md font-mono tracking-wide">
            Choose your game and start the fun. Minimal, fast, and made for friends.
          </p>
        </div>

        {/* Navigation / Cards */}
        <nav className="flex flex-col md:flex-row flex-wrap justify-center gap-6 w-full">

          <Link
            href="/imposter"
            className="group relative w-full md:w-60 h-36 flex flex-col justify-center px-8 py-6 rounded-2xl bg-gradient-to-tr from-[#222] via-[#111] to-[#333] border-2 border-white/10 hover:border-white/30 hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <div className="relative z-10">
              <span className="block text-2xl font-bold text-white tracking-widest font-mono group-hover:text-black transition-colors">
                IMPOSTER
              </span>
              <span className="block mt-2 text-[#bbb] text-xs font-mono uppercase tracking-wider group-hover:text-black/70 transition-colors">
                Find the secret agents
              </span>
            </div>
            {/* Arrow Icon */}
            <span className="absolute top-4 right-4 text-white/40 opacity-60 group-hover:opacity-100 group-hover:text-black transition">→</span>

            {/* Hover Gradient Overlay */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white via-gray-200 to-gray-400" />
          </Link>

          <Link
            href="/drink"
            className="group relative w-full md:w-60 h-36 flex flex-col justify-center px-8 py-6 rounded-2xl bg-gradient-to-tr from-[#333] via-[#111] to-[#222] border-2 border-white/10 hover:border-white/30 hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <div className="relative z-10">
              <span className="block text-2xl font-bold text-white tracking-widest font-mono group-hover:text-black transition-colors">
                DRINK
              </span>
              <span className="block mt-2 text-[#bbb] text-xs font-mono uppercase tracking-wider group-hover:text-black/70 transition-colors">
                The ultimate party game
              </span>
            </div>
            <span className="absolute top-4 right-4 text-white/40 opacity-60 group-hover:opacity-100 group-hover:text-black transition">→</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white via-gray-200 to-gray-400" />
          </Link>

          <Link
            href="/bco-trainer"
            className="group relative w-full md:w-60 h-36 flex flex-col justify-center px-8 py-6 rounded-2xl bg-gradient-to-tr from-[#333] via-[#111] to-[#222] border-2 border-white/10 hover:border-white/30 hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <div className="relative z-10">
              <span className="block text-2xl font-bold text-white tracking-widest font-mono group-hover:text-black transition-colors">
                TRAINER
              </span>
              <span className="block mt-2 text-[#bbb] text-xs font-mono uppercase tracking-wider group-hover:text-black/70 transition-colors">
                Train rhythm skills
              </span>
            </div>
            <span className="absolute top-4 right-4 text-white/40 opacity-60 group-hover:opacity-100 group-hover:text-black transition">→</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white via-gray-200 to-gray-400" />
          </Link>

        </nav>
      </div>
    </main>
  )
}