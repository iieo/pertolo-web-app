'use client';

import { useDrinkGame } from '../game-provider';
import { KIND_COLORS, taskColor } from '../palette';
import { cardTemplate, plainText, splitTopic, splitVersus, toSegments } from '../template';
import type { DeckCard } from '../types';
import { bodySize, CardSurface, heroClass, Kicker, nameSize, RichText } from './card-surface';

export type CardProps = { card: DeckCard; index: number };

export function useCardTemplate(card: DeckCard) {
  const { locale } = useDrinkGame();
  return cardTemplate(card, locale);
}

export function TaskCard({ card, index, kicker }: CardProps & { kicker?: string }) {
  const template = useCardTemplate(card);
  const segments = toSegments(template, card.names, card.sips);
  const text = plainText(segments);

  return (
    <CardSurface color={taskColor(index)} label={kicker ? `${kicker}. ${text}` : text}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <RichText segments={segments} size={bodySize(text.length)} />
    </CardSurface>
  );
}

/** Split diagonally in two colors, one opponent per side, "vs" on the seam. */
export function VersusCard({ card, index }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const rest = splitVersus(template);
  const [a, b] = card.names;
  if (rest === null || !a || !b) return <TaskCard card={card} index={index} />;

  const segments = toSegments(rest, card.names, card.sips, 2);
  const text = plainText(segments);
  const top = KIND_COLORS.versusA;
  const bottom = KIND_COLORS.versusB;

  return (
    <CardSurface
      color={top}
      label={`${t.cards.versus}. ${a} ${t.cards.vs} ${b}. ${text}`}
      className="justify-stretch gap-0 md:gap-0"
      background={
        <>
          <span
            aria-hidden
            className="absolute inset-0 [clip-path:polygon(0_56%,100%_44%,100%_100%,0_100%)]"
            style={{ backgroundColor: bottom.bg }}
          />
          <span
            aria-hidden
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-black tracking-tight uppercase"
            style={{ fontSize: 'clamp(1.75rem, min(9vw, 6dvh), 3.5rem)', lineHeight: 1 }}
          >
            {t.cards.vs}
          </span>
        </>
      }
    >
      <span
        className="flex flex-1 flex-col justify-between pb-10 md:pb-12"
        style={{ color: top.fg }}
      >
        <Kicker>{t.cards.versus}</Kicker>
        <span className={heroClass} style={{ fontSize: nameSize(a.length) }}>
          {a}
        </span>
      </span>
      <span
        className="flex flex-1 flex-col gap-6 pt-12 md:gap-8 md:pt-16"
        style={{ color: bottom.fg }}
      >
        <span className={heroClass} style={{ fontSize: nameSize(b.length) }}>
          {b}
        </span>
        <RichText segments={segments} size={bodySize(text.length, 0.6)} />
      </span>
    </CardSurface>
  );
}

/** A poster headline with the continuation underneath. */
export function NeverCard({ card }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const segments = toSegments(template, card.names, card.sips);
  const text = plainText(segments);

  return (
    <CardSurface color={KIND_COLORS.never} label={`${t.cards.never} ${text}`}>
      <span className={heroClass} style={{ fontSize: 'clamp(3rem, min(15vw, 11dvh), 8rem)' }}>
        {t.cards.never}
      </span>
      <RichText segments={segments} size={bodySize(text.length, 0.75)} />
    </CardSurface>
  );
}

export function VoteCard({ card }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const segments = toSegments(template, card.names, card.sips);
  const text = plainText(segments);

  return (
    <CardSurface
      color={KIND_COLORS.vote}
      label={`${t.cards.vote}. ${text} ${t.cards.voteInstruction}`}
    >
      <Kicker>{t.cards.vote}</Kicker>
      <RichText segments={segments} size={bodySize(text.length, 0.9)} />
      <span className="mt-4 block border-t-2 border-current pt-4 text-lg font-bold md:mt-8 md:text-2xl">
        {t.cards.voteInstruction}
      </span>
    </CardSurface>
  );
}

/** "Alle" as a giant word, the task below. */
export function GroupCard({ card }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const segments = toSegments(template, card.names, card.sips);
  const text = plainText(segments);

  return (
    <CardSurface color={KIND_COLORS.group} label={`${t.cards.group}. ${text}`}>
      <span
        aria-hidden
        className={heroClass}
        style={{ fontSize: 'clamp(5rem, min(34vw, 22dvh), 14rem)', lineHeight: 0.8 }}
      >
        {t.cards.groupHero}
      </span>
      <RichText segments={segments} size={bodySize(text.length, 0.8)} />
    </CardSurface>
  );
}

const LEADING_NAME = /^\s*\{\{player\}\}\s*[,:]\s*/;

/** The asked player's name huge on top, the question below. */
export function QuestionCard({ card, index }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const name = card.names[0];
  if (!name) return <TaskCard card={card} index={index} kicker={t.cards.question} />;

  // The name is already the headline, so "{{player}}, ..." loses its leading name.
  const lead = template.match(LEADING_NAME);
  const question = lead
    ? template.slice(lead[0].length).replace(/^./, (c) => c.toUpperCase())
    : template;
  const segments = toSegments(question, card.names, card.sips, lead ? 1 : 0);
  const text = plainText(segments);

  return (
    <CardSurface color={KIND_COLORS.question} label={`${t.cards.question} ${name}. ${text}`}>
      <span className="flex flex-col gap-2">
        <Kicker>{t.cards.question}</Kicker>
        <span className={heroClass} style={{ fontSize: nameSize(name.length) }}>
          {name}
        </span>
      </span>
      <RichText segments={segments} size={bodySize(text.length, 0.8)} />
    </CardSurface>
  );
}

/**
 * Darker card with an inner frame, like a printed rule card. The duration sits at the bottom.
 * End cards keep the exact look and swap the duration for "no longer applies".
 */
export function RuleCard({ card }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const segments = toSegments(template, card.names, card.sips);
  const text = plainText(segments);

  const isCurse = card.kind === 'curse' || card.kind === 'curseEnd';
  const isEnd = card.kind === 'ruleEnd' || card.kind === 'curseEnd';
  const color = isCurse ? KIND_COLORS.curse : KIND_COLORS.rule;
  const title = isEnd
    ? isCurse
      ? t.cards.curseEnd
      : t.cards.ruleEnd
    : isCurse
      ? t.cards.curse
      : t.cards.rule;
  const rounds = card.rounds ?? 0;
  const duration = `${t.cards.durationLabel} ${rounds} ${t.cards.durationUnit(rounds)}`;

  return (
    <CardSurface
      color={color}
      label={`${title}. ${text} ${isEnd ? t.cards.endedLabel : duration}`}
      className="justify-stretch md:pt-[calc(env(safe-area-inset-top)+5rem)] md:pb-[max(3rem,env(safe-area-inset-bottom))]"
    >
      <span className="flex flex-1 flex-col justify-between gap-8 rounded-2xl border-2 border-current p-6 md:p-10">
        <Kicker>{title}</Kicker>
        <RichText
          segments={segments}
          size={bodySize(text.length, 0.85)}
          className={isEnd && card.repeatsRule ? 'line-through decoration-[0.08em]' : undefined}
        />
        {isEnd ? (
          <span className="block border-t-2 border-current pt-4 text-2xl font-black tracking-tight md:pt-6 md:text-4xl">
            {t.cards.endedLabel}
          </span>
        ) : (
          <span className="flex items-baseline gap-3 border-t-2 border-current pt-4 md:pt-6">
            <span className="text-lg font-semibold md:text-2xl">{t.cards.durationLabel}</span>
            <span
              className="font-black tracking-tighter tabular-nums"
              style={{ fontSize: 'clamp(3rem, min(16vw, 10dvh), 6rem)', lineHeight: 0.9 }}
            >
              {rounds}
            </span>
            <span className="text-lg font-semibold md:text-2xl">
              {t.cards.durationUnit(rounds)}
            </span>
          </span>
        )}
      </span>
    </CardSurface>
  );
}

/** The topic word as big as it fits, the instruction below. */
export function CategoryCard({ card, index }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const split = splitTopic(template);
  if (!split) return <TaskCard card={card} index={index} kicker={t.cards.category} />;

  const segments = toSegments(split.rest, card.names, card.sips);
  const text = plainText(segments);
  const topicSize =
    split.topic.length <= 12
      ? 'clamp(3rem, min(17vw, 13dvh), 9rem)'
      : split.topic.length <= 24
        ? 'clamp(2.5rem, min(11vw, 9dvh), 6rem)'
        : 'clamp(2rem, min(8vw, 7dvh), 4.5rem)';

  return (
    <CardSurface
      color={KIND_COLORS.category}
      label={`${t.cards.category}: ${split.topic}. ${text}`}
    >
      <span className="flex flex-col gap-2">
        <Kicker>{t.cards.category}</Kicker>
        <span className={heroClass} style={{ fontSize: topicSize }}>
          {split.topic}
        </span>
      </span>
      <RichText segments={segments} size={bodySize(text.length, 0.6)} />
    </CardSurface>
  );
}

/** Green table felt with the stakes as the hero. */
export function DoubleCard({ card }: CardProps) {
  const { t } = useDrinkGame();
  const template = useCardTemplate(card);
  const segments = toSegments(template, card.names, card.sips);
  const text = plainText(segments);

  return (
    <CardSurface color={KIND_COLORS.double} label={`${t.cards.double}. ${text}`}>
      <span className="flex flex-col gap-2">
        <Kicker>{t.cards.double}</Kicker>
        <span
          aria-hidden
          className={`${heroClass} tabular-nums`}
          style={{ fontSize: 'clamp(4rem, min(22vw, 18dvh), 11rem)', lineHeight: 0.85 }}
        >
          {t.cards.doubleHero}
        </span>
      </span>
      <RichText segments={segments} size={bodySize(text.length, 0.75)} />
    </CardSurface>
  );
}
