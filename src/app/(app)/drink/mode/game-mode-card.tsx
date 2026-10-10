'use client';

import type { QuestionColor } from '@/app/(app)/200-questions/palette';
import { cn } from '@/lib/utils';

function GameModeCard({
  name,
  description,
  color,
  loading,
  disabled,
  onClick,
}: {
  name: string;
  description: string | null;
  color: QuestionColor;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={loading}
      className={cn(
        'flex min-h-20 w-full flex-col justify-center gap-1 rounded-xl p-5 text-left outline-none transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none',
        disabled && !loading && 'opacity-50',
      )}
      style={{ backgroundColor: color.bg, color: color.fg }}
    >
      <span className="text-xl font-semibold wrap-break-word hyphens-auto">{name}</span>
      {description && (
        <span className="text-base leading-snug wrap-break-word hyphens-auto">
          {loading ? 'Wird geladen …' : description}
        </span>
      )}
    </button>
  );
}

export default GameModeCard;
