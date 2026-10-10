'use client';

import { useState } from 'react';

import { act, skipStep, type ActAction } from '../actions';
import type { Dictionary } from '../i18n';
import type { GameView, Turn } from '../lib/view';
import { NIGHT } from '../palette';
import { MyRoleButton } from './my-role';
import { useRoom } from './room-context';
import {
  ActionError,
  GameScreen,
  HostSkip,
  PlayerTile,
  primaryButtonClass,
  secondaryButtonClass,
  TileGrid,
} from './ui';

type NightTurn = Exclude<Turn, { kind: 'hunter' }>;
type SingleTurnKind =
  | 'wild_child'
  | 'wanderer'
  | 'protector'
  | 'priest'
  | 'seer'
  | 'wolf_seer'
  | 'fox'
  | 'infect_father'
  | 'big_bad_wolf'
  | 'white_werewolf'
  | 'serial_killer'
  | 'grumpy_grandma';
type SingleNightTurn = Extract<NightTurn, { kind: SingleTurnKind }>;

export function NightScreen() {
  const { game } = useRoom();
  const [seenRound, setSeenRound] = useState(0);
  if (!game) return null;

  const turn = game.turn;
  if (turn && turn.kind !== 'hunter') {
    // A second wolf consensus round starts with fresh picks, so it gets a fresh screen.
    const key = turn.kind === 'werewolves' ? `werewolves:${turn.chosenIds.length}` : turn.kind;
    return <NightTurnScreen key={key} turn={turn} />;
  }

  // Information steps end as soon as the player picks, so the result is shown once right after.
  if (seenRound !== game.round && hasNightResult(game)) {
    return <NightResult game={game} onDone={() => setSeenRound(game.round)} />;
  }
  return <NightRest />;
}

function SkipFooter() {
  const { run, gameId } = useRoom();
  return (
    <>
      <ActionError />
      <HostSkip onSkip={() => run(() => skipStep(gameId))} />
    </>
  );
}

function NightRest() {
  const { game, view, t, name } = useRoom();
  const me = game?.me;
  const meAlive = view.players.find((p) => p.isMe)?.alive ?? false;

  return (
    <GameScreen color={NIGHT} center headerExtra={<MyRoleButton />} footer={<SkipFooter />}>
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-6xl font-bold tracking-tight md:text-8xl">{t.nightTitle}</h1>
        <p className="max-w-md text-lg leading-relaxed text-(--muted) md:max-w-xl md:text-2xl">
          {t.nightText}
        </p>
        {!meAlive && <p className="max-w-md text-base text-(--muted)">{t.youAreOut}</p>}
        {meAlive && me?.loverId && game?.round === 1 && (
          <div className="flex max-w-md flex-col gap-2 text-base leading-relaxed md:max-w-xl md:text-lg">
            <p>{t.loverInfo(name(me.loverId))}</p>
            {me.loversMixed !== null && <p>{me.loversMixed ? t.loversMixed : t.loversSame}</p>}
          </div>
        )}
      </div>
    </GameScreen>
  );
}

function roundResults(game: GameView) {
  const me = game.me;
  const round = game.round;
  return {
    seer: me?.seerResults?.find((r) => r.round === round),
    wolfSeer: me?.wolfSeerResults?.find((r) => r.round === round),
    fox: me?.fox?.results.find((r) => r.round === round),
    detective: me?.detectiveResults?.find((r) => r.round === round),
  };
}

function hasNightResult(game: GameView) {
  return Object.values(roundResults(game)).some(Boolean);
}

function NightResult({ game, onDone }: { game: GameView; onDone: () => void }) {
  const { t, name } = useRoom();
  const { seer, wolfSeer, fox, detective } = roundResults(game);

  let title = t.seerResultTitle;
  let body: React.ReactNode = null;
  if (seer) {
    body = (
      <>
        <BigLine lead={t.seerResultText(name(seer.targetId))} value={t.roles[seer.role].name} />
        <p className="text-lg font-semibold md:text-xl">{t.teamLine(t.teams[seer.team])}</p>
      </>
    );
  } else if (wolfSeer) {
    body = (
      <BigLine
        lead={t.seerResultText(name(wolfSeer.targetId))}
        value={t.roles[wolfSeer.role].name}
      />
    );
  } else if (fox) {
    title = t.foxResultTitle;
    body = (
      <>
        <BigLine lead={t.foxQuestion(name(fox.targetId))} value={fox.wolf ? t.yes : t.no} />
        {!fox.wolf && <p className="text-lg font-semibold md:text-xl">{t.foxPowerLost}</p>}
      </>
    );
  } else if (detective) {
    title = t.detectiveResultTitle;
    const [a, b] = detective.targetIds;
    body = (
      <BigLine lead={t.detectiveQuestion(name(a), name(b))} value={detective.same ? t.yes : t.no} />
    );
  }

  return (
    <GameScreen
      color={NIGHT}
      center
      footer={
        <button type="button" className={primaryButtonClass} onClick={onDone}>
          {t.understood}
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-base font-medium text-(--muted)">{title}</p>
        {body}
      </div>
    </GameScreen>
  );
}

function BigLine({ lead, value }: { lead: string; value: string }) {
  return (
    <>
      <p className="text-2xl font-semibold md:text-4xl">{lead}</p>
      <p className="text-6xl font-bold tracking-tight wrap-break-word hyphens-auto md:text-8xl">
        {value}
      </p>
    </>
  );
}

/** Intro text plus notes, with the transformation notice for players whose role changed. */
function Intro({ text, notes = [] }: { text: string; notes?: (string | null | false)[] }) {
  const { game, t } = useRoom();
  const cause = game?.me?.transformedBy;
  const lines = [cause && t.transformed[cause], ...notes].filter(Boolean) as string[];
  return (
    <>
      {text}
      {lines.map((line) => (
        <span key={line} className="mt-2 block">
          {line}
        </span>
      ))}
    </>
  );
}

function NightTurnScreen({ turn }: { turn: NightTurn }) {
  const { t } = useRoom();
  switch (turn.kind) {
    case 'cupid':
      return (
        <MultiTurn
          title={t.cupidTitle}
          text={t.cupidText}
          targets={turn.targets}
          min={2}
          max={2}
          toAction={(ids) => ({ type: 'cupid', targetIds: [ids[0], ids[1]] })}
        />
      );
    case 'detective':
      return (
        <MultiTurn
          title={t.detectiveTitle}
          text={t.detectiveText}
          targets={turn.targets}
          min={2}
          max={2}
          toAction={(ids) => ({ type: 'detect', targetIds: [ids[0], ids[1]] })}
        />
      );
    case 'piper':
      return (
        <MultiTurn
          title={t.piperTitle}
          text={t.piperText(turn.maxPicks)}
          targets={turn.targets}
          min={1}
          max={turn.maxPicks}
          toAction={(ids) => ({ type: 'charm', targetIds: ids })}
        />
      );
    case 'witch':
      return <WitchTurn turn={turn} />;
    case 'werewolves':
      return <WolvesTurn turn={turn} />;
    default:
      return <SingleTurn turn={turn} />;
  }
}

interface SingleConfig {
  title: string;
  text: string;
  note?: string | null;
  targets: string[];
  toAction: (targetId: string) => ActAction;
  pass?: { label: string; action: ActAction };
}

function singleConfig(
  turn: SingleNightTurn,
  t: Dictionary,
  name: (id: string | null) => string,
): SingleConfig {
  switch (turn.kind) {
    case 'wild_child':
      return {
        title: t.wildChildTitle,
        text: t.wildChildText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'wildChild', targetId }),
      };
    case 'wanderer':
      return {
        title: t.wandererTitle,
        text: t.wandererText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'wander', targetId }),
      };
    case 'protector':
      return {
        title: t.protectorTitle,
        text: t.protectorText,
        note: turn.lastProtectedId && t.protectorLastNote(name(turn.lastProtectedId)),
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'protect', targetId }),
      };
    case 'priest':
      return {
        title: t.priestTitle,
        text: t.priestText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'bless', targetId }),
        pass: { label: t.priestPass, action: { type: 'bless', targetId: null } },
      };
    case 'seer':
      return {
        title: t.seerTitle,
        text: t.seerText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'see', targetId }),
      };
    case 'wolf_seer':
      return {
        title: t.wolfSeerTitle,
        text: t.wolfSeerText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'wolfSee', targetId }),
      };
    case 'fox':
      return {
        title: t.foxTitle,
        text: t.foxText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'fox', targetId }),
      };
    case 'infect_father':
      return {
        title: t.infectTitle,
        text: t.infectText,
        targets: turn.victimIds,
        toAction: (targetId) => ({ type: 'infect', targetId }),
        pass: { label: t.infectPass, action: { type: 'infect', targetId: null } },
      };
    case 'big_bad_wolf':
      return {
        title: t.bigBadWolfTitle,
        text: t.bigBadWolfText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'bigBadWolf', targetId }),
      };
    case 'white_werewolf':
      return {
        title: t.whiteWolfTitle,
        text: t.whiteWolfText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'whiteWolf', targetId }),
        pass: turn.required
          ? undefined
          : { label: t.whiteWolfPass, action: { type: 'whiteWolf', targetId: null } },
      };
    case 'serial_killer':
      return {
        title: t.serialKillerTitle,
        text: t.serialKillerText,
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'serialKill', targetId }),
      };
    case 'grumpy_grandma':
      return {
        title: t.grandmaTitle,
        text: t.grandmaText,
        note: turn.lastSilencedId && t.grandmaLastNote(name(turn.lastSilencedId)),
        targets: turn.targets,
        toAction: (targetId) => ({ type: 'silence', targetId }),
      };
  }
}

function SingleTurn({ turn }: { turn: SingleNightTurn }) {
  const { t, name, run, busy, gameId, view } = useRoom();
  const [selected, setSelected] = useState<string | null>(null);
  const config = singleConfig(turn, t, name);
  const pass = config.pass;

  return (
    <GameScreen
      color={NIGHT}
      headerExtra={<MyRoleButton />}
      title={config.title}
      intro={<Intro text={config.text} notes={[config.note ?? null]} />}
      footer={
        <>
          <SkipFooter />
          <button
            type="button"
            className={primaryButtonClass}
            disabled={busy || !selected}
            onClick={() => selected && run(() => act(gameId, config.toAction(selected)))}
          >
            {t.confirm}
          </button>
          {pass && (
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={busy}
              onClick={() => run(() => act(gameId, pass.action))}
            >
              {pass.label}
            </button>
          )}
        </>
      }
    >
      <TileGrid label={config.title}>
        {config.targets.map((id) => (
          <PlayerTile
            key={id}
            name={name(id)}
            sub={id === view.meId ? t.you : undefined}
            selected={selected === id}
            onClick={() => setSelected((s) => (s === id && pass ? null : id))}
          />
        ))}
      </TileGrid>
    </GameScreen>
  );
}

function MultiTurn({
  title,
  text,
  targets,
  min,
  max,
  toAction,
}: {
  title: string;
  text: string;
  targets: string[];
  min: number;
  max: number;
  toAction: (ids: string[]) => ActAction;
}) {
  const { t, name, run, busy, gameId, view } = useRoom();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id)
        ? s.filter((x) => x !== id)
        : s.length < max
          ? [...s, id]
          : [...s.slice(1), id],
    );

  return (
    <GameScreen
      color={NIGHT}
      headerExtra={<MyRoleButton />}
      title={title}
      intro={<Intro text={text} />}
      footer={
        <>
          <SkipFooter />
          <button
            type="button"
            className={primaryButtonClass}
            disabled={busy || selected.length < min || selected.length > max}
            onClick={() => run(() => act(gameId, toAction(selected)))}
          >
            {t.confirm}
          </button>
        </>
      }
    >
      <TileGrid label={title}>
        {targets.map((id) => (
          <PlayerTile
            key={id}
            name={name(id)}
            sub={id === view.meId ? t.you : undefined}
            selected={selected.includes(id)}
            onClick={() => toggle(id)}
          />
        ))}
      </TileGrid>
    </GameScreen>
  );
}

function WolvesTurn({ turn }: { turn: Extract<NightTurn, { kind: 'werewolves' }> }) {
  const { t, name, run, busy, gameId, view } = useRoom();
  const [selected, setSelected] = useState<string | null>(turn.myPick);

  const pickers = (targetId: string) =>
    turn.picks
      .filter((p) => p.targetId === targetId)
      .map((p) => (p.wolfId === view.meId ? t.you : name(p.wolfId)));

  return (
    <GameScreen
      color={NIGHT}
      headerExtra={<MyRoleButton />}
      title={t.wolvesTitle}
      intro={
        <Intro
          text={t.wolvesText}
          notes={[
            turn.kills > 1 && t.wolvesTwoKills,
            turn.chosenIds.length > 0 && t.wolvesSecond(name(turn.chosenIds[0])),
          ]}
        />
      }
      footer={
        <>
          <SkipFooter />
          <button
            type="button"
            className={primaryButtonClass}
            disabled={busy || !selected || selected === turn.myPick}
            onClick={() =>
              selected && run(() => act(gameId, { type: 'wolfPick', targetId: selected }))
            }
          >
            {t.confirm}
          </button>
        </>
      }
    >
      <TileGrid label={t.wolvesTitle}>
        {turn.targets.map((id) => {
          const by = pickers(id);
          return (
            <PlayerTile
              key={id}
              name={name(id)}
              sub={by.length > 0 ? t.pickedBy(by.join(', ')) : undefined}
              selected={selected === id}
              onClick={() => setSelected(id)}
            />
          );
        })}
      </TileGrid>
    </GameScreen>
  );
}

function WitchTurn({ turn }: { turn: Extract<NightTurn, { kind: 'witch' }> }) {
  const { t, name, run, busy, gameId } = useRoom();
  const [healId, setHealId] = useState<string | null>(null);
  const [poisonId, setPoisonId] = useState<string | null>(null);
  const victims = turn.victimIds;

  return (
    <GameScreen
      color={NIGHT}
      headerExtra={<MyRoleButton />}
      title={t.witchTitle}
      intro={
        <Intro
          text={
            victims.length > 0
              ? t.witchVictims(victims.map((id) => name(id)).join(', '))
              : t.witchNoVictim
          }
        />
      }
      footer={
        <>
          <SkipFooter />
          <button
            type="button"
            className={primaryButtonClass}
            disabled={busy}
            onClick={() => run(() => act(gameId, { type: 'witch', healId, poisonId }))}
          >
            {t.witchDone}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        {victims.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">{t.witchHealHeading}</h2>
            {turn.canHeal ? (
              <>
                {victims.length > 1 && (
                  <p className="text-base text-(--muted)">{t.witchHealHint}</p>
                )}
                <TileGrid label={t.witchHealHeading}>
                  {victims.map((id) => (
                    <PlayerTile
                      key={id}
                      name={t.witchHeal(name(id))}
                      selected={healId === id}
                      onClick={() => setHealId((h) => (h === id ? null : id))}
                    />
                  ))}
                </TileGrid>
              </>
            ) : (
              <p className="text-base">{t.healUsed}</p>
            )}
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">{t.witchPoisonHeading}</h2>
          {turn.canPoison ? (
            <>
              <p className="text-base text-(--muted)">{t.witchPoisonHint}</p>
              <TileGrid label={t.witchPoisonHeading}>
                {turn.poisonTargets.map((id) => (
                  <PlayerTile
                    key={id}
                    name={name(id)}
                    selected={poisonId === id}
                    onClick={() => setPoisonId((p) => (p === id ? null : id))}
                  />
                ))}
              </TileGrid>
            </>
          ) : (
            <p className="text-base">{t.poisonUsed}</p>
          )}
        </section>
      </div>
    </GameScreen>
  );
}
