import Link from 'next/link';
import { Gamepad2, Beer, Music, BookOpen, ChevronRight, Moon, Map } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gray-950 flex flex-col items-center py-20 px-4 overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />

      {/* Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/20 blur-[150px] rounded-full pointer-events-none animate-pulse duration-10000 delay-500" />
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[800px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="z-10 flex flex-col items-center gap-16 w-full max-w-6xl mt-12">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in slide-in-from-top-12 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-white via-white to-white/40 tracking-tight drop-shadow-2xl">
            Pertolo
          </h1>

          <p className="text-xl md:text-2xl text-white/50 max-w-2xl font-medium leading-relaxed">
            Choose your game and start the fun. Minimal, fast, and made for friends.
          </p>
        </div>

        {/* Navigation / Cards */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4 md:px-0">
          {/* Imposter Card */}
          <Link
            href="/imposter"
            className="group relative flex flex-col justify-between h-72 rounded-3xl bg-white/5 border border-white/10 p-8 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.3)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100"
          >
            <div className="absolute inset-0 bg-linear-to-br from-red-500/0 via-red-500/0 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/40 transition-colors duration-500" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30 text-red-400 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                <Gamepad2 size={28} strokeWidth={2.5} />
              </div>
              <ChevronRight
                className="text-white/20 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300"
                size={28}
              />
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">IMPOSTER</h2>
              <p className="text-white/50 font-medium text-sm">Find the secret agents</p>
            </div>
          </Link>

          {/* Drink Card */}
          <Link
            href="/drink"
            className="group relative flex flex-col justify-between h-72 rounded-3xl bg-white/5 border border-white/10 p-8 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(217,70,239,0.3)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200"
          >
            <div className="absolute inset-0 bg-linear-to-br from-fuchsia-500/0 via-fuchsia-500/0 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-fuchsia-500/40 transition-colors duration-500" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30 text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                <Beer size={28} strokeWidth={2.5} />
              </div>
              <ChevronRight
                className="text-white/20 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all duration-300"
                size={28}
              />
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">DRINK</h2>
              <p className="text-white/50 font-medium text-sm">The ultimate party game</p>
            </div>
          </Link>

          {/* Trainer Card */}
          <Link
            href="/bco-trainer"
            className="group relative flex flex-col justify-between h-72 rounded-3xl bg-white/5 border border-white/10 p-8 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300"
          >
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/40 transition-colors duration-500" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Music size={28} strokeWidth={2.5} />
              </div>
              <ChevronRight
                className="text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300"
                size={28}
              />
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">TRAINER</h2>
              <p className="text-white/50 font-medium text-sm">Train rhythm skills</p>
            </div>
          </Link>
          {/* Bluff Card */}
          <Link
            href="/bluff"
            className="group relative flex flex-col justify-between h-72 rounded-3xl bg-white/5 border border-white/10 p-8 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-[400ms]"
          >
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/0 via-violet-500/0 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/40 transition-colors duration-500" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30 text-violet-400 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <BookOpen size={28} strokeWidth={2.5} />
              </div>
              <ChevronRight
                className="text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300"
                size={28}
              />
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">BLUFF</h2>
              <p className="text-white/50 font-medium text-sm">Truth or made-up definition?</p>
            </div>
          </Link>
          {/* Werewolf Card */}
          <Link
            href="/werewolf"
            className="group relative flex flex-col justify-between h-72 rounded-3xl bg-white/5 border border-white/10 p-8 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.3)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500"
          >
            <div className="absolute inset-0 bg-linear-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/40 transition-colors duration-500" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Moon size={28} strokeWidth={2.5} />
              </div>
              <ChevronRight
                className="text-white/20 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300"
                size={28}
              />
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">WEREWOLF</h2>
              <p className="text-white/50 font-medium text-sm">Find the werewolves among you</p>
            </div>
          </Link>

          {/* Quiz (Daily Maze) Card */}
          <Link
            href="/quiz"
            className="group relative flex flex-col justify-between h-72 rounded-3xl bg-white/5 border border-white/10 p-8 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.3)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700"
          >
            <div className="absolute inset-0 bg-linear-to-br from-green-500/0 via-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/40 transition-colors duration-500" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30 text-green-400 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <Map size={28} strokeWidth={2.5} />
              </div>
              <ChevronRight
                className="text-white/20 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300"
                size={28}
              />
            </div>

            <div className="relative z-10 mt-auto">
              <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">DAILY MAZE</h2>
              <p className="text-white/50 font-medium text-sm">Find the hidden path in the dark</p>
            </div>
          </Link>
        </nav>
      </div>
    </main>
  );
}
