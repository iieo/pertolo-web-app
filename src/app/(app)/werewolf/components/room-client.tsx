'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { exitFullscreen } from '@/components/game/fullscreen';
import { useThemeColor } from '@/components/game/hooks';
import type { Result } from '@/util/types';

import { leaveGame } from '../actions';
import type { JoinedView, View } from '../lib/view';
import { BLACK } from '../palette';
import { DayScreen } from './day';
import { EndScreen } from './end';
import { HunterTurn } from './hunter';
import { JoinForm } from './join-form';
import { Lobby } from './lobby';
import { NightScreen } from './night';
import { RevealScreen } from './reveal';
import { RoomContext, type RoomContextValue } from './room-context';
import { PageShell, primaryButtonClass, useI18n } from './ui';
import { useNarration } from './use-narration';
import { VoteResultScreen, VoteScreen } from './vote';

const POLL_MS = 1500;

type RoomState =
  | { kind: 'loading' }
  | { kind: 'gone' }
  | { kind: 'ready'; view: View; clockOffset: number };

function useRoomState(gameId: string) {
  const [state, setState] = useState<RoomState>({ kind: 'loading' });
  const [offline, setOffline] = useState(false);
  const version = useRef(-1);
  const stopped = useRef(false);
  const again = useRef(false);
  const loop = useRef<Promise<void> | null>(null);

  const fetchOnce = useCallback(async () => {
    try {
      const res = await fetch(`/werewolf/${encodeURIComponent(gameId)}/state`, {
        cache: 'no-store',
      });
      if (stopped.current) return;
      if (res.status === 404 || res.status === 400) {
        stopped.current = true;
        setState({ kind: 'gone' });
        return;
      }
      if (!res.ok) {
        setOffline(true);
        return;
      }
      const view = (await res.json()) as View;
      if (stopped.current) return;
      setOffline(false);
      // Equal versions are accepted: they still carry fresh online flags and server time.
      if (view.version < version.current) return;
      version.current = view.version;
      setState({
        kind: 'ready',
        view,
        clockOffset: view.joined ? view.serverNow - Date.now() : 0,
      });
    } catch {
      if (!stopped.current) setOffline(true);
    }
  }, [gameId]);

  // Requests never overlap: a call during a running request schedules one more round.
  const refresh = useCallback(() => {
    again.current = true;
    if (!loop.current) {
      loop.current = (async () => {
        while (again.current && !stopped.current) {
          again.current = false;
          await fetchOnce();
        }
        loop.current = null;
      })();
    }
    return loop.current;
  }, [fetchOnce]);

  const stop = useCallback(() => {
    stopped.current = true;
  }, []);

  useEffect(() => {
    stopped.current = false;
    void refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    const timer = setInterval(onVisible, POLL_MS);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      stopped.current = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [refresh]);

  return { state, offline, refresh, stop };
}

export function RoomClient({ gameId }: { gameId: string }) {
  const { locale, t } = useI18n();
  const { state, offline, refresh, stop } = useRoomState(gameId);

  return (
    <div lang={locale}>
      {state.kind === 'loading' && <Splash text={t.loading} />}
      {state.kind === 'gone' && <GoneScreen />}
      {state.kind === 'ready' &&
        (state.view.joined ? (
          <JoinedRoom
            gameId={gameId}
            view={state.view}
            clockOffset={state.clockOffset}
            refresh={refresh}
            stop={stop}
          />
        ) : (
          <JoinForm gameId={gameId} view={state.view} onJoined={refresh} />
        ))}
      {offline && (
        <p
          role="status"
          className="fixed inset-x-0 bottom-0 z-40 bg-white px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center text-sm font-medium text-black"
        >
          {t.connectionLost}
        </p>
      )}
    </div>
  );
}

function JoinedRoom({
  gameId,
  view,
  clockOffset,
  refresh,
  stop,
}: {
  gameId: string;
  view: JoinedView;
  clockOffset: number;
  refresh: () => Promise<void>;
  stop: () => void;
}) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);
  const game = view.game;
  const narration = useNarration(view, t, locale);

  const screenKey = `${view.status}:${game?.phase}:${game?.round}:${game?.turn?.kind ?? ''}`;
  const [errorKey, setErrorKey] = useState(screenKey);
  if (errorKey !== screenKey) {
    setErrorKey(screenKey);
    setError(null);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screenKey]);

  const run = useCallback(
    async (fn: () => Promise<Result<unknown>>) => {
      if (busyRef.current) return false;
      busyRef.current = true;
      setBusy(true);
      setError(null);
      try {
        const result = await fn();
        if (!result.success) setError(result.error);
        return result.success;
      } catch {
        setError('NETWORK');
        return false;
      } finally {
        busyRef.current = false;
        setBusy(false);
        void refresh();
      }
    },
    [refresh],
  );

  const quit = useCallback(async () => {
    stop();
    try {
      await leaveGame(gameId);
    } catch {}
    await exitFullscreen();
    router.push('/werewolf');
  }, [gameId, router, stop]);

  const value = useMemo<RoomContextValue>(() => {
    const byId = new Map(view.players.map((p) => [p.id, p]));
    return {
      gameId,
      view,
      game,
      t,
      locale,
      clockOffset,
      busy,
      error,
      run,
      refresh,
      player: (id) => (id ? byId.get(id) : undefined),
      name: (id) => (id ? (byId.get(id)?.name ?? '') : ''),
      quit,
      narration,
    };
  }, [gameId, view, game, t, locale, clockOffset, busy, error, run, refresh, quit, narration]);

  return <RoomContext.Provider value={value}>{renderScreen(view)}</RoomContext.Provider>;
}

function renderScreen(view: JoinedView) {
  const game = view.game;
  if (view.status === 'lobby' || !game) return <Lobby />;
  if (game.turn?.kind === 'hunter') return <HunterTurn turn={game.turn} />;
  switch (game.phase) {
    case 'reveal':
      return <RevealScreen />;
    case 'night':
      return <NightScreen />;
    case 'day':
      return <DayScreen />;
    case 'vote':
      return <VoteScreen />;
    case 'voteResult':
      return <VoteResultScreen />;
    case 'end':
      return <EndScreen />;
  }
}

function Splash({ text }: { text: string }) {
  useThemeColor(BLACK.bg);
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black text-base text-white/60">
      {text}
    </div>
  );
}

function GoneScreen() {
  const { t } = useI18n();
  return (
    <PageShell color={BLACK}>
      <div className="flex flex-1 flex-col justify-center gap-8 md:mx-auto md:max-w-md">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t.gameGoneTitle}</h1>
          <p className="text-base leading-relaxed text-(--muted) md:text-lg">{t.gameGoneText}</p>
        </div>
        <Link href="/werewolf" className={primaryButtonClass} onClick={() => exitFullscreen()}>
          {t.backToStart}
        </Link>
      </div>
    </PageShell>
  );
}
