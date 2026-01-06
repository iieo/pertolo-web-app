import { Play, Square, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ActionButtonsProps = {
  isPlaying: boolean;
  isPaperVisible: boolean;
  onPlay: () => void;
  onStop: () => void;
  onToggleVisibility: () => void;
  onReload: () => void;
};

export function ActionButtons({
  isPlaying,
  isPaperVisible,
  onPlay,
  onStop,
  onToggleVisibility,
  onReload,
}: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4 md:gap-8">
      <div className="flex flex-col items-center gap-2">
        {!isPlaying ? (
          <Button
            onClick={onPlay}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 border-0"
            size="icon"
            aria-label="Play"
          >
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
          </Button>
        ) : (
          <Button
            onClick={onStop}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-red-500/40 border-0"
            size="icon"
            aria-label="Stop"
          >
            <Square className="w-7 h-7 md:w-9 md:h-9 text-white fill-white" />
          </Button>
        )}
        <span className="text-xs text-slate-500 font-medium">{isPlaying ? 'Stop' : 'Play'}</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={onToggleVisibility}
          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl transition-all duration-200 hover:scale-105 border-0 ${
            isPaperVisible
              ? 'bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40'
              : 'bg-gradient-to-br from-slate-400 to-slate-500 hover:from-slate-300 hover:to-slate-400 shadow-lg shadow-slate-400/30 hover:shadow-xl hover:shadow-slate-400/40'
          }`}
          size="icon"
          aria-label="Show/Hide Sheet"
        >
          {isPaperVisible ? (
            <EyeOff className="w-7 h-7 md:w-9 md:h-9 text-white" />
          ) : (
            <Eye className="w-7 h-7 md:w-9 md:h-9 text-white" />
          )}
        </Button>
        <span className="text-xs text-slate-500 font-medium">
          {isPaperVisible ? 'Hide' : 'Reveal'}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={onReload}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40 border-0"
          size="icon"
          aria-label="New Pattern"
        >
          <RotateCcw className="w-7 h-7 md:w-9 md:h-9 text-white" />
        </Button>
        <span className="text-xs text-slate-500 font-medium">New</span>
      </div>
    </div>
  );
}
