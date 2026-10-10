'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

import type { Dictionary, Locale } from '../i18n';
import { narrate, type NarrationLine, type NarrationSnapshot } from '../lib/narration';
import type { JoinedView } from '../lib/view';

const STORAGE_KEY = 'ww-narration';
const SPEECH_LANG: Record<Locale, string> = { de: 'de-DE', en: 'en-US' };
const SILENCE =
  'data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';

export interface Narration {
  supported: boolean;
  enabled: boolean;
  toggle: () => void;
}

const subscribeNever = () => () => {};

function audioAvailable() {
  return typeof window !== 'undefined' && typeof HTMLAudioElement !== 'undefined';
}

function speechAvailable() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  );
}

function readEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function storeEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {}
}

function pickVoice(lang: string) {
  const voices = window.speechSynthesis.getVoices();
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  return (
    voices.find((v) => norm(v) === lang.toLowerCase()) ??
    voices.find((v) => norm(v).startsWith(lang.slice(0, 2).toLowerCase())) ??
    null
  );
}

/** Plays the pre-generated narration on the host's device, browser speech as fallback. */
export function useNarration(view: JoinedView, t: Dictionary, locale: Locale): Narration {
  const supported = useSyncExternalStore(subscribeNever, audioAvailable, () => false);
  const [enabled, setEnabled] = useState(readEnabled);
  const isHost = view.isHost;

  const prev = useRef<NarrationSnapshot | null>(null);
  const queue = useRef<NarrationLine[]>([]);
  const current = useRef<NarrationLine | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const watchdog = useRef<number | undefined>(undefined);
  const primed = useRef(false);
  const localeRef = useRef(locale);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const element = useCallback(() => {
    if (!audio.current) {
      audio.current = new Audio();
      audio.current.preload = 'auto';
    }
    return audio.current;
  }, []);

  const playNext = useCallback(() => {
    const step = () => {
      if (current.current) return;
      const line = queue.current.shift();
      if (!line) return;
      current.current = line;

      const done = () => {
        if (current.current !== line) return;
        window.clearTimeout(watchdog.current);
        current.current = null;
        step();
      };
      // Some browsers never fire the end event (iOS, Chrome on long speech).
      const arm = (ms: number) => {
        window.clearTimeout(watchdog.current);
        watchdog.current = window.setTimeout(done, ms);
      };

      let fellBack = false;
      const speak = () => {
        if (current.current !== line || fellBack) return;
        fellBack = true;
        if (!line.text || !speechAvailable()) return done();
        const lang = SPEECH_LANG[localeRef.current];
        const utterance = new SpeechSynthesisUtterance(line.text);
        utterance.lang = lang;
        const voice = pickVoice(lang);
        if (voice) utterance.voice = voice;
        utterance.onend = done;
        utterance.onerror = done;
        arm(4000 + line.text.length * 120);
        window.speechSynthesis.speak(utterance);
      };

      const el = element();
      el.onended = done;
      el.onerror = speak;
      el.onloadedmetadata = () => {
        if (current.current === line && Number.isFinite(el.duration)) {
          arm(el.duration * 1000 + 2000);
        }
      };
      arm(8000 + line.text.length * 120);
      el.src = `/werewolf/audio/${localeRef.current}/${line.key}.mp3`;
      el.play().catch(speak);
    };
    step();
  }, [element]);

  const stopAll = useCallback(() => {
    queue.current = [];
    current.current = null;
    window.clearTimeout(watchdog.current);
    audio.current?.pause();
    if (speechAvailable()) window.speechSynthesis.cancel();
  }, []);

  // iOS Safari only plays audio on an element that was started inside a user gesture.
  const prime = useCallback(() => {
    if (primed.current || !audioAvailable() || current.current) return;
    primed.current = true;
    const el = element();
    el.onended = null;
    el.onerror = null;
    el.onloadedmetadata = null;
    el.src = SILENCE;
    el.play().catch(() => {
      primed.current = false;
    });
  }, [element]);

  useEffect(() => {
    if (!supported || !isHost) return;
    if (speechAvailable()) window.speechSynthesis.getVoices();
    window.addEventListener('click', prime, true);
    window.addEventListener('keydown', prime, true);
    window.addEventListener('touchend', prime, true);
    return () => {
      window.removeEventListener('click', prime, true);
      window.removeEventListener('keydown', prime, true);
      window.removeEventListener('touchend', prime, true);
    };
  }, [supported, isHost, prime]);

  useEffect(() => {
    if (!isHost) {
      prev.current = null;
      if (current.current || queue.current.length > 0) stopAll();
      return;
    }
    const { lines, next } = narrate(prev.current, view, t);
    prev.current = next;
    if (!supported || !enabled || lines.length === 0) return;
    queue.current = [...queue.current.filter((l) => !l.droppable), ...lines];
    playNext();
  }, [view, t, isHost, supported, enabled, playNext, stopAll]);

  useEffect(() => stopAll, [stopAll]);

  const toggle = useCallback(() => {
    const on = !enabled;
    setEnabled(on);
    storeEnabled(on);
    if (on) prime();
    else stopAll();
  }, [enabled, prime, stopAll]);

  return useMemo(() => ({ supported, enabled, toggle }), [supported, enabled, toggle]);
}
