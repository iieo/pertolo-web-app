import { forwardRef } from 'react';
import { Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

type SheetMusicCardProps = {
  isPlaying: boolean;
  isPaperVisible: boolean;
  measures: number;
  tempo: number;
};

export const SheetMusicCard = forwardRef<HTMLDivElement, SheetMusicCardProps>(
  function SheetMusicCard({ isPlaying, isPaperVisible, measures, tempo }, ref) {
    return (
      <Card className="w-full max-w-5xl bg-white border-slate-200 shadow-lg overflow-hidden">
        <div className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}
              />
              <span className="text-sm text-slate-600 font-medium">
                {isPlaying ? 'Playing...' : 'Ready'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="hidden sm:inline">
                {measures} {measures === 1 ? 'measure' : 'measures'}
              </span>
              <span>♩ = {tempo}</span>
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-green-500' : 'text-slate-400'}`} />
            </div>
          </div>
        </div>
        <div
          ref={ref}
          className={`w-full transition-all duration-500 ease-out p-4 md:p-6 ${
            isPaperVisible
              ? 'bg-white [&_svg]:fill-slate-800 [&_svg_path]:stroke-slate-800'
              : 'bg-slate-200 [&_svg]:opacity-0 [&_svg_path]:opacity-0'
          }`}
        />
      </Card>
    );
  },
);
