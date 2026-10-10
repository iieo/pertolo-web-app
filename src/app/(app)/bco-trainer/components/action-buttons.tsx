type ActionButtonsProps = {
  isPlaying: boolean;
  isPaperVisible: boolean;
  onPlay: () => void;
  onStop: () => void;
  onToggleVisibility: () => void;
  onReload: () => void;
};

const buttonBase =
  'flex min-h-14 w-full items-center justify-center rounded-xl px-6 text-base font-semibold outline-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none';
const primaryButtonClass = `${buttonBase} bg-white text-black hover:bg-white/85`;
const secondaryButtonClass = `${buttonBase} border border-white/20 text-white hover:bg-white/10`;

export function ActionButtons({
  isPlaying,
  isPaperVisible,
  onPlay,
  onStop,
  onToggleVisibility,
  onReload,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
      <button
        type="button"
        onClick={isPlaying ? onStop : onPlay}
        className={`${primaryButtonClass} col-span-2 sm:col-span-1`}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>
      <button
        type="button"
        onClick={onToggleVisibility}
        aria-pressed={isPaperVisible}
        className={secondaryButtonClass}
      >
        {isPaperVisible ? 'Hide' : 'Reveal'}
      </button>
      <button type="button" onClick={onReload} className={secondaryButtonClass}>
        New
      </button>
    </div>
  );
}
