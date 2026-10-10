'use client';

import abcjs from 'abcjs';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type JSX } from 'react';

import { cn } from '@/lib/utils';

import { toAbc, toTimeline, type Rhythm } from '../rhythm';

type NotationProps = {
  rhythm: Rhythm;
  activeIndex?: number | null;
  hidden?: boolean;
  color: string;
  highlightColor: string;
  compact?: boolean;
  className?: string;
  ariaLabel?: string;
};

type RenderedNote = { abselem?: { elemset?: SVGElement[] } };

const WIDTH_STEP = 16;
const PADDING_X = 4;

function isDense(rhythm: Rhythm): boolean {
  return rhythm.measures.some((notes) =>
    notes.some((note) => Math.abs(note.duration * 2 - Math.round(note.duration * 2)) > 1e-6),
  );
}

function measuresPerLine(width: number, dense: boolean, compact: boolean, count: number): number {
  let perLine: number;
  if (compact) perLine = width >= (dense ? 440 : 280) ? 2 : 1;
  else if (width < 520) perLine = dense ? 1 : 2;
  else perLine = dense && width < 880 ? 2 : 4;
  return Math.max(1, Math.min(perLine, count));
}

const DIMMED_OPACITY = '0.35';

// While a note is active, the others are dimmed so the highlight does not rely on hue alone.
function applyHighlight(groups: SVGElement[][] | null, activeIndex: number | null, color: string) {
  if (!groups) return;
  groups.forEach((elements, index) => {
    const active = index === activeIndex;
    const dimmed = activeIndex !== null && !active;
    for (const element of elements) {
      if (active) element.style.color = color;
      else element.style.removeProperty('color');
      if (dimmed) element.style.opacity = DIMMED_OPACITY;
      else element.style.removeProperty('opacity');
    }
  });
}

export function Notation({
  rhythm,
  activeIndex = null,
  hidden = false,
  color,
  highlightColor,
  compact = false,
  className,
  ariaLabel,
}: NotationProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<SVGElement[][] | null>(null);
  const [width, setWidth] = useState(0);
  const highlightRef = useRef({ index: activeIndex, color: highlightColor });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = (w: number) => setWidth(Math.floor(w / WIDTH_STEP) * WIDTH_STEP);
    update(el.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) update(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const perLine = useMemo(
    () => measuresPerLine(width, isDense(rhythm), compact, rhythm.measures.length),
    [width, rhythm, compact],
  );
  const abc = useMemo(() => toAbc(rhythm, perLine), [rhythm, perLine]);
  const expectedNotes = useMemo(() => toTimeline(rhythm).length, [rhythm]);

  useEffect(() => {
    highlightRef.current = { index: activeIndex, color: highlightColor };
    applyHighlight(notesRef.current, activeIndex, highlightColor);
  }, [activeIndex, highlightColor]);

  useEffect(() => {
    const paper = paperRef.current;
    if (!paper || width === 0) return;
    const [tune] = abcjs.renderAbc(paper, abc, {
      staffwidth: Math.max(120, width - PADDING_X * 2 - 2),
      paddingleft: PADDING_X,
      paddingright: PADDING_X,
      paddingtop: compact ? 0 : 4,
      paddingbottom: compact ? 0 : 4,
      scale: compact ? 0.72 : 1,
      add_classes: true,
      selectTypes: false,
      foregroundColor: 'currentColor',
      ariaLabel: '',
    });

    // Every VoiceItem with el_type 'note' (rests included) gets its drawn <g> in abselem.elemset.
    const groups: SVGElement[][] = [];
    for (const line of tune?.lines ?? []) {
      const voice = line.staff?.[0]?.voices?.[0] ?? [];
      for (const item of voice) {
        if (item.el_type !== 'note') continue;
        groups.push((item as unknown as RenderedNote).abselem?.elemset ?? []);
      }
    }
    const valid =
      groups.length === expectedNotes && groups.every((elements) => elements.length > 0);
    notesRef.current = valid ? groups : null;
    applyHighlight(notesRef.current, highlightRef.current.index, highlightRef.current.color);
  }, [abc, width, compact, expectedNotes]);

  return (
    <div
      ref={containerRef}
      role={hidden ? undefined : 'img'}
      aria-label={hidden ? undefined : ariaLabel}
      aria-hidden={hidden || undefined}
      className={cn('w-full max-w-full min-w-0 overflow-hidden', className)}
      style={{ color }}
    >
      <div
        ref={paperRef}
        className="[&_svg]:block [&_svg]:max-w-none"
        style={{ visibility: hidden ? 'hidden' : 'visible' }}
      />
    </div>
  );
}
