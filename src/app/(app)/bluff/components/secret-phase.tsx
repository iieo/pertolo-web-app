'use client';

import { useBluffGame } from '../game-provider';

export function SecretPhase() {
  const { currentWord, secretType, nextWord } = useBluffGame();

  const isTruth = secretType === 'truth';

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col md:max-w-lg md:mx-auto">
      {/* Dynamic background */}
      <div
        className={`fixed inset-0 pointer-events-none transition-colors duration-500 ${
          isTruth
            ? 'bg-gradient-to-br from-emerald-950 via-black to-teal-950'
            : 'bg-gradient-to-br from-rose-950 via-black to-red-950'
        }`}
      />

      <div className="relative flex flex-col flex-1 p-5">
        {/* Top word label */}
        <div className="pt-2 pb-4 text-center">
          <p className="text-white/30 text-xs font-bold tracking-[0.2em] uppercase">
            The word was
          </p>
          <p className="text-white/70 text-lg font-black tracking-tight">
            {currentWord.word}
          </p>
        </div>

        {/* Main secret card */}
        <div
          className={`flex-1 flex flex-col items-center justify-center rounded-3xl border p-7 gap-5 ${
            isTruth
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-rose-500/10 border-rose-500/30'
          }`}
        >
          {/* TRUTH / BLUFF banner */}
          <div
            className={`px-6 py-2 rounded-2xl border-2 ${
              isTruth
                ? 'bg-emerald-500/20 border-emerald-400/60'
                : 'bg-rose-500/20 border-rose-400/60'
            }`}
          >
            <span
              className={`font-black tracking-widest ${
                isTruth ? 'text-emerald-300' : 'text-rose-300'
              }`}
              style={{ fontSize: 'clamp(2rem, 10vw, 3.5rem)' }}
            >
              {isTruth ? 'TRUTH' : 'BLUFF!'}
            </span>
          </div>

          {isTruth ? (
            <>
              <p className="text-white/50 text-xs font-bold tracking-widest uppercase">
                Real Definition
              </p>
              <p className="text-white font-semibold text-center text-lg leading-relaxed">
                "{currentWord.definition}"
              </p>
              <p className="text-emerald-400/70 text-sm text-center leading-relaxed">
                Read this confidently. Don't let them see you sweat!
              </p>
            </>
          ) : (
            <>
              <p
                className="text-white font-black text-center leading-tight"
                style={{ fontSize: 'clamp(1.4rem, 7vw, 2.2rem)' }}
              >
                Make something up.
                <br />
                <span className="text-rose-300">Right now.</span>
              </p>
              <p className="text-white/50 text-sm text-center leading-relaxed max-w-xs">
                Invent a convincing fake definition and deliver it like you own
                it. You've got this.
              </p>
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 mt-1">
                <p className="text-white/30 text-xs font-bold tracking-widest uppercase mb-1 text-center">
                  (Real definition — for later)
                </p>
                <p className="text-white/50 text-sm text-center italic leading-relaxed">
                  "{currentWord.definition}"
                </p>
              </div>
            </>
          )}
        </div>

        {/* Next Word button */}
        <div className="pt-5 pb-6">
          <button
            onClick={nextWord}
            className={`w-full py-6 rounded-2xl font-black text-white text-xl tracking-wide active:scale-[0.98] transition-all border ${
              isTruth
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_40px_-4px_rgba(16,185,129,0.5)] border-emerald-500/50'
                : 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_40px_-4px_rgba(244,63,94,0.5)] border-rose-500/50'
            }`}
          >
            Next Word →
          </button>
        </div>
      </div>
    </div>
  );
}
