'use client';

import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import type { PrivateInfo } from '../lib/view';
import { useRoom } from './room-context';
import { dialogContentClass, secondaryButtonClass } from './ui';

/** Everything this player privately knows. Only ever rendered on their own phone. */
export function RoleDetails({ me, large = false }: { me: PrivateInfo; large?: boolean }) {
  const { t, name, view } = useRoom();
  const role = t.roles[me.role];
  const named = (id: string) => (id === view.meId ? `${name(id)} (${t.you})` : name(id));
  const lines: string[] = [];
  const groups: { heading: string; names: string[] }[] = [];

  if (me.wolfIds && me.wolfIds.length > 0) {
    groups.push({
      heading: me.role === 'traitor' ? t.traitorWolvesHeading : t.packHeading,
      names: me.wolfIds.map(name),
    });
  }
  if (
    me.siblingIds &&
    me.siblingIds.length > 0 &&
    (me.role === 'sisters' || me.role === 'brothers')
  ) {
    groups.push({ heading: t.siblingsHeading[me.role], names: me.siblingIds.map(name) });
  }
  if (me.charmedIds) {
    if (me.role !== 'piper') lines.push(t.charmedSelf);
    if (me.charmedIds.length > 0) {
      groups.push({ heading: t.charmedHeading, names: me.charmedIds.map(named) });
    } else {
      lines.push(t.charmedNone);
    }
  }
  if (me.beholder) {
    lines.push(me.beholder.seerId ? t.beholderSeer(name(me.beholder.seerId)) : t.beholderNoSeer);
    if (me.beholder.apprenticeId) lines.push(t.beholderApprentice(name(me.beholder.apprenticeId)));
  }
  if (me.loverId) {
    lines.push(t.loverInfo(name(me.loverId)));
    if (me.loversMixed !== null) lines.push(me.loversMixed ? t.loversMixed : t.loversSame);
  }
  if (me.wildChild) {
    if (me.wildChild.converted) lines.push(t.wildChildConverted);
    else if (me.wildChild.modelId) lines.push(t.wildChildModel(name(me.wildChild.modelId)));
  }
  if (me.witch) {
    lines.push(me.witch.heal ? t.healLeft : t.healUsed);
    lines.push(me.witch.poison ? t.poisonLeft : t.poisonUsed);
  }
  if (me.protectorLastId) lines.push(t.protectorLast(name(me.protectorLastId)));
  if (me.priest) {
    lines.push(
      !me.priest.used
        ? t.priestAvailable
        : me.priest.blessedId
          ? t.priestBlessed(named(me.priest.blessedId))
          : t.priestSpent,
    );
  }
  if (me.fox?.powerLost) lines.push(t.foxPowerLost);
  if (me.infectUsed !== null) lines.push(me.infectUsed ? t.infectUsed : t.infectLeft);
  if (me.judgeUsed !== null) lines.push(me.judgeUsed ? t.judgeUsed : t.judgeLeft);

  const results = [
    ...(me.seerResults ?? []).map((r) => ({
      round: r.round,
      text: t.seerResultLine(name(r.targetId), t.roles[r.role].name),
    })),
    ...(me.wolfSeerResults ?? []).map((r) => ({
      round: r.round,
      text: t.seerResultLine(name(r.targetId), t.roles[r.role].name),
    })),
    ...(me.fox?.results ?? []).map((r) => ({
      round: r.round,
      text: t.foxLine(name(r.targetId), r.wolf),
    })),
    ...(me.detectiveResults ?? []).map((r) => ({
      round: r.round,
      text: t.detectiveLine(name(r.targetIds[0]), name(r.targetIds[1]), r.same),
    })),
  ].sort((a, b) => a.round - b.round);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p
          className={cn(
            'font-bold tracking-tight wrap-break-word hyphens-auto',
            large ? 'text-5xl md:text-7xl' : 'text-3xl',
          )}
        >
          {role.name}
        </p>
        <p className={cn('font-semibold', large ? 'text-lg md:text-xl' : 'text-base')}>
          {t.teamLine(t.teams[me.team])}
        </p>
        {me.formerRole && (
          <div
            className={cn(
              'flex flex-col gap-1 font-semibold',
              large ? 'text-base md:text-xl' : 'text-base',
            )}
          >
            {me.transformedBy && <p>{t.transformed[me.transformedBy]}</p>}
            <p className="font-normal">{t.dealtRole(t.roles[me.formerRole].name)}</p>
          </div>
        )}
        <p className={cn('leading-relaxed', large ? 'text-base md:text-xl' : 'text-base')}>
          {role.ability}
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.heading} className="flex flex-col gap-1">
          <p className="text-sm font-medium">{group.heading}</p>
          <p className="text-lg font-semibold">{group.names.join(', ')}</p>
        </div>
      ))}

      {lines.length > 0 && (
        <ul className="flex flex-col gap-2 text-base leading-relaxed">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">{t.seerResultsHeading}</p>
          <ul className="flex flex-col gap-1">
            {results.map((r, i) => (
              <li key={i} className="text-base">
                <span className="font-medium">{t.nightLabel(r.round)}</span> {r.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function MyRoleButton() {
  const { game, t, locale } = useRoom();
  const [open, setOpen] = useState(false);
  const me = game?.me;
  if (!me) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-12 items-center rounded-xl px-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-current"
      >
        {t.myRole}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent lang={locale} className={cn(dialogContentClass, 'sm:max-w-md')}>
          <DialogHeader className="pr-12 text-left sm:text-left">
            <DialogTitle className="text-base font-medium text-white/60">{t.myRole}</DialogTitle>
          </DialogHeader>
          <RoleDetails me={me} />
          <button type="button" className={secondaryButtonClass} onClick={() => setOpen(false)}>
            {t.close}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
