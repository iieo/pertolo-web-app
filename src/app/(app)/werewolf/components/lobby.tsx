'use client';

import { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

import { kickPlayer, setRoles, startGame } from '../actions';
import { errorMessage } from '../i18n';
import {
  MAX_PLAYERS,
  ROLE_INFO,
  ROLES,
  roleTotal,
  validateRoles,
  type Role,
  type RolesConfig,
  type Team,
} from '../lib/roles';
import { BLACK, ROLE_COLORS } from '../palette';
import { useRoom } from './room-context';
import {
  ActionError,
  GameHeader,
  LocaleToggle,
  NameList,
  PageShell,
  primaryButtonClass,
  RulesButton,
  secondaryButtonClass,
  textButtonClass,
} from './ui';

const TEAMS: Team[] = ['village', 'wolves', 'solo'];
const ROLES_BY_TEAM = TEAMS.map((team) => ({
  team,
  roles: ROLES.filter((r) => ROLE_INFO[r].team === team),
}));

export function Lobby() {
  const { view, t, locale, run, busy, gameId } = useRoom();
  const lobby = view.lobby;
  if (!lobby) return null;
  const isHost = view.isHost;
  const error = lobby.rolesError;

  return (
    <PageShell
      color={BLACK}
      header={
        <GameHeader
          extra={
            <div className="flex items-center">
              <RulesButton t={t} locale={locale} />
              <LocaleToggle t={t} locale={locale} />
            </div>
          }
        />
      }
      footer={
        isHost ? (
          <>
            <ActionError />
            <button
              type="button"
              className={primaryButtonClass}
              disabled={busy || error !== null}
              onClick={() => {
                run(() => startGame(gameId));
              }}
            >
              {t.start}
            </button>
          </>
        ) : (
          <p className="text-center text-base text-(--muted) md:text-lg">{t.waitingForHost}</p>
        )
      }
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div className="flex flex-col gap-12">
          <CodeSection />
          <PlayersSection />
        </div>
        {isHost ? <RolePlanner /> : <RolesSummary />}
      </div>
    </PageShell>
  );
}

function CodeSection() {
  const { view, t } = useRoom();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const url = `${window.location.origin}/werewolf/${view.gameId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      try {
        await navigator.share?.({ url });
      } catch {}
    }
  };

  return (
    <section aria-labelledby="ww-code-heading" className="flex flex-col gap-4">
      <h2 id="ww-code-heading" className="text-base font-medium text-(--muted)">
        {t.codeHeading}
      </h2>
      <p className="text-7xl font-bold tracking-[0.15em] md:text-8xl" aria-live="off">
        {view.gameId}
      </p>
      <p className="text-base text-(--muted)">{t.shareHint}</p>
      <button
        type="button"
        onClick={copy}
        className={cn(secondaryButtonClass, 'sm:w-auto sm:self-start')}
      >
        <span aria-live="polite">{copied ? t.linkCopied : t.copyLink}</span>
      </button>
    </section>
  );
}

function PlayersSection() {
  const { view, t, run, busy, gameId } = useRoom();

  return (
    <section aria-labelledby="ww-players-heading" className="flex flex-col gap-4">
      <h2 id="ww-players-heading" className="text-2xl font-semibold">
        {t.playersHeading(view.players.length)}
      </h2>
      <NameList className="lg:grid-cols-1">
        {view.players.map((p) => {
          const notes = [p.isMe && t.you, p.isHost && t.host, !p.connected && t.offline].filter(
            Boolean,
          );
          return (
            <li key={p.id} className="flex min-h-12 items-center justify-between gap-4">
              <span className="min-w-0">
                <span
                  className={cn(
                    'block text-lg font-semibold wrap-break-word',
                    !p.connected && 'text-(--muted)',
                  )}
                >
                  {p.name}
                </span>
                {notes.length > 0 && (
                  <span className="block text-sm text-(--muted)">{notes.join(', ')}</span>
                )}
              </span>
              {view.isHost && !p.isMe && (
                <button
                  type="button"
                  className={cn(textButtonClass, 'shrink-0 text-sm')}
                  aria-label={t.kickLabel(p.name)}
                  disabled={busy}
                  onClick={() => run(() => kickPlayer(gameId, p.id))}
                >
                  {t.kick}
                </button>
              )}
            </li>
          );
        })}
      </NameList>
    </section>
  );
}

function RolesSummary() {
  const { view, t } = useRoom();
  const config = view.lobby!.rolesConfig;

  return (
    <section aria-labelledby="ww-roles-heading" className="flex flex-col gap-8">
      <h2 id="ww-roles-heading" className="text-2xl font-semibold">
        {t.rolesInGame}
      </h2>
      {ROLES_BY_TEAM.map(({ team, roles }) => {
        const active = roles.filter((r) => config[r] > 0);
        if (active.length === 0) return null;
        return (
          <section key={team} className="flex flex-col gap-4">
            <h3 className="text-base font-medium text-(--muted)">{t.teams[team]}</h3>
            <ul className="flex flex-col gap-4">
              {active.map((role) => (
                <li key={role}>
                  <span className="block text-lg font-semibold">
                    {config[role] > 1
                      ? `${config[role]} ${t.roles[role].plural}`
                      : t.roles[role].name}
                  </span>
                  <span className="block text-base text-(--muted)">{t.roles[role].short}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </section>
  );
}

function RolePlanner() {
  const { view, t, run, busy, gameId, refresh } = useRoom();
  const lobby = view.lobby!;
  const playerCount = view.players.length;
  const [draft, setDraft] = useState<RolesConfig | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const latest = useRef<RolesConfig | null>(null);
  const sending = useRef(false);

  const config = draft ?? lobby.rolesConfig;
  const total = roleTotal(config);
  const rolesError = draft ? validateRoles(draft, playerCount) : lobby.rolesError;

  // Taps update a local draft right away; the latest draft is sent one request at a time.
  const flush = async () => {
    if (sending.current) return;
    sending.current = true;
    try {
      while (latest.current) {
        const next = latest.current;
        const result = await setRoles(gameId, next);
        if (!result.success) {
          setSendError(result.error);
          latest.current = null;
          break;
        }
        if (latest.current !== next) continue;
        await refresh();
        if (latest.current === next) latest.current = null;
      }
    } catch {
      setSendError('NETWORK');
      latest.current = null;
    } finally {
      sending.current = false;
      if (!latest.current) setDraft(null);
    }
  };

  const change = (role: Role, delta: number) => {
    const base = latest.current ?? lobby.rolesConfig;
    const { max, group } = ROLE_INFO[role];
    // Sisters and brothers only exist as a full group, so they step by the group size.
    const value = Math.min(max ?? MAX_PLAYERS, Math.max(0, base[role] + delta * (group ?? 1)));
    const next = { ...base, [role]: value };
    latest.current = next;
    setDraft(next);
    setSendError(null);
    void flush();
  };

  return (
    <section aria-labelledby="ww-roles-heading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h2 id="ww-roles-heading" className="text-2xl font-semibold">
            {t.rolesHeading}
          </h2>
          <span className="text-lg font-semibold tabular-nums" aria-live="polite">
            {t.rolesCount(total, playerCount)}
          </span>
        </div>
        <p className="text-base" aria-live="polite">
          {sendError
            ? errorMessage(t, sendError)
            : rolesError
              ? t.rolesErrors[rolesError]
              : t.rolesOk}
        </p>
        {(lobby.rolesCustom || draft) && (
          <button
            type="button"
            className={cn(textButtonClass, '-ml-2 self-start')}
            disabled={busy}
            onClick={() => run(() => setRoles(gameId, null))}
          >
            {t.resetPreset}
          </button>
        )}
      </div>
      {ROLES_BY_TEAM.map(({ team, roles }) => (
        <section key={team} aria-labelledby={`ww-team-${team}`} className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h3 id={`ww-team-${team}`} className="text-xl font-semibold">
              {t.teams[team]}
            </h3>
            <span className="text-base text-(--muted) tabular-nums">
              {roles.reduce((sum, r) => sum + config[r], 0)}
            </span>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {roles.map((role) => (
              <li key={role}>
                <RoleTile
                  role={role}
                  count={config[role]}
                  canIncrease={config[role] < (ROLE_INFO[role].max ?? MAX_PLAYERS)}
                  onChange={(delta) => change(role, delta)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}

function RoleTile({
  role,
  count,
  canIncrease,
  onChange,
}: {
  role: Role;
  count: number;
  canIncrease: boolean;
  onChange: (delta: number) => void;
}) {
  const { t } = useRoom();
  const color = ROLE_COLORS[role];
  const active = count > 0;
  const text = t.roles[role];
  const stepButton =
    'flex size-12 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,currentColor_15%,transparent)] outline-none transition-colors duration-150 motion-reduce:transition-none hover:bg-[color-mix(in_srgb,currentColor_25%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-30';

  // Inactive tiles dim only the background and switch to white text to keep AA contrast.
  return (
    <div
      className="flex h-full min-h-20 items-center gap-4 rounded-xl p-4 transition-colors duration-150 motion-reduce:transition-none"
      style={{
        backgroundColor: active ? color.bg : `color-mix(in srgb, ${color.bg} 35%, black)`,
        color: active ? color.fg : '#FFFFFF',
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold wrap-break-word hyphens-auto">
          {count > 1 || ROLE_INFO[role].group ? text.plural : text.name}
        </p>
        <p className="text-sm leading-snug">{text.short}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          className={stepButton}
          aria-label={t.decrease(text.name)}
          disabled={count === 0}
          onClick={() => onChange(-1)}
        >
          <Minus size={20} aria-hidden />
        </button>
        <span className="w-8 text-center text-2xl font-bold tabular-nums">{count}</span>
        <button
          type="button"
          className={stepButton}
          aria-label={t.increase(text.name)}
          disabled={!canIncrease}
          onClick={() => onChange(1)}
        >
          <Plus size={20} aria-hidden />
        </button>
      </div>
    </div>
  );
}
