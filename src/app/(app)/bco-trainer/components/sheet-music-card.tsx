import { forwardRef } from 'react';

type SheetMusicCardProps = {
  isPlaying: boolean;
  isPaperVisible: boolean;
  measures: number;
  tempo: number;
};

export const SheetMusicCard = forwardRef<HTMLDivElement, SheetMusicCardProps>(
  function SheetMusicCard({ isPlaying, isPaperVisible, measures, tempo }, ref) {
    return (
      <section aria-label="Sheet music" className="flex w-full flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4 text-sm text-white/60 tabular-nums">
          <span aria-live="polite" className="font-medium text-white">
            {isPlaying ? 'Playing' : 'Ready'}
          </span>
          <span>
            {measures} {measures === 1 ? 'measure' : 'measures'}, ♩ = {tempo}
          </span>
        </div>
        <div className="relative overflow-hidden rounded-xl">
          {/* abcjs replaces this element's content, so the hidden label lives in a sibling. */}
          <div
            ref={ref}
            aria-hidden={!isPaperVisible}
            className={`w-full p-4 transition-colors duration-300 motion-reduce:transition-none md:p-8 ${
              isPaperVisible
                ? 'bg-white [&_svg]:fill-neutral-900 [&_svg_path]:stroke-neutral-900'
                : 'bg-neutral-900 [&_svg]:opacity-0 [&_svg_path]:opacity-0'
            }`}
          />
          {!isPaperVisible && (
            <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 text-center text-base text-white/60">
              Sheet hidden. Listen first, then reveal.
            </p>
          )}
        </div>
      </section>
    );
  },
);
