'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';

import { BAND, BAND_POINTS, bandStart } from '../scoring';

const BAND_HEIGHTS = ['50%', '75%', '100%', '75%', '50%'];

const KEY_STEPS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
  PageDown: -10,
  PageUp: 10,
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export type SliderProps = {
  onChange: (value: number) => void;
  label: string;
  valueText: string;
};

export function SpectrumLabels({ left, right }: { left: string; right: string }) {
  const textClass =
    'min-w-0 flex-1 leading-[1.05] font-bold tracking-tight text-balance wrap-break-word hyphens-auto';
  const fontSize = 'clamp(1.5rem, min(7vw, 7dvh), 4.5rem)';

  return (
    <div className="flex items-end justify-between gap-6 md:gap-12">
      <p className={textClass} style={{ fontSize }}>
        {left}
      </p>
      <p className={cn(textClass, 'text-right')} style={{ fontSize }}>
        {right}
      </p>
    </div>
  );
}

/**
 * Horizontal 0 to 100 scale. Shows the target bands when `target` is set and a needle when
 * `needle` is set. With `slider`, the whole bar is the drag area and the needle gets a handle.
 */
export function Dial({
  bg,
  target,
  targetLabel,
  needle,
  slider,
  sliderRef,
}: {
  /** Surface color, used to outline the needle so it stays visible on top of the bands. */
  bg: string;
  target?: number;
  targetLabel?: string;
  needle?: number;
  slider?: SliderProps;
  sliderRef?: React.Ref<HTMLDivElement>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const valueAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return needle ?? 50;
    return clamp(((clientX - rect.left) / rect.width) * 100);
  };

  const bar = (
    <div className="relative" style={{ height: 'clamp(3.5rem, 14dvh, 8rem)' }}>
      <div
        ref={trackRef}
        className="absolute inset-0 overflow-hidden rounded-md"
        style={{ backgroundColor: 'color-mix(in srgb, currentColor 20%, transparent)' }}
      >
        {target !== undefined &&
          BAND_POINTS.map((_, band) => (
            <div
              key={band}
              aria-hidden
              className="absolute bottom-0 px-px duration-300 animate-in fade-in motion-reduce:animate-none"
              style={{
                left: `${bandStart(target, band)}%`,
                width: `${BAND}%`,
                height: BAND_HEIGHTS[band],
              }}
            >
              <div className="h-full w-full bg-current" />
            </div>
          ))}
      </div>

      {needle !== undefined && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-2 -bottom-2 w-1 -translate-x-1/2 rounded-full bg-current"
          style={{ left: `${needle}%`, boxShadow: `0 0 0 3px ${bg}` }}
        >
          {slider && (
            <div
              className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
              style={{ boxShadow: `0 0 0 4px ${bg}` }}
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col">
      {slider ? (
        <div
          ref={sliderRef}
          role="slider"
          tabIndex={0}
          aria-label={slider.label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(needle ?? 50)}
          aria-valuetext={slider.valueText}
          aria-orientation="horizontal"
          className="-my-4 cursor-grab touch-none rounded-lg py-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current active:cursor-grabbing"
          onPointerDown={(e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            dragging.current = true;
            slider.onChange(valueAt(e.clientX));
          }}
          onPointerMove={(e) => {
            if (dragging.current) slider.onChange(valueAt(e.clientX));
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onKeyDown={(e) => {
            const current = Math.round(needle ?? 50);
            let next: number | null = null;
            if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = 100;
            else if (KEY_STEPS[e.key])
              next = clamp(current + KEY_STEPS[e.key]! * (e.shiftKey ? 5 : 1));
            if (next === null) return;
            e.preventDefault();
            slider.onChange(next);
          }}
        >
          {bar}
        </div>
      ) : (
        bar
      )}

      {target !== undefined && (
        <>
          <div aria-hidden className="relative mt-4 h-6 md:h-7">
            {BAND_POINTS.map((points, band) => (
              <span
                key={band}
                className="absolute top-0 -translate-x-1/2 text-base leading-none font-bold tabular-nums md:text-lg"
                style={{ left: `${bandStart(target, band) + BAND / 2}%` }}
              >
                {points}
              </span>
            ))}
          </div>
          {targetLabel && <p className="sr-only">{targetLabel}</p>}
        </>
      )}
    </div>
  );
}
