import type { Locale } from '@/components/game/locale';

import type { CardKind, DeckCard } from './types';

export type Segment = { type: 'text' | 'name' | 'sips'; value: string };

const TOKEN = /\{\{(player|sips)\}\}/g;

/** `nameOffset` skips names already shown elsewhere on the card, e.g. the versus opponents. */
export function toSegments(
  template: string,
  names: readonly string[],
  sips: number,
  nameOffset = 0,
): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  let nameIndex = nameOffset;
  for (const match of template.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ type: 'text', value: template.slice(last, index) });
    segments.push(
      match[1] === 'player'
        ? { type: 'name', value: names.length ? names[nameIndex++ % names.length]! : '' }
        : { type: 'sips', value: String(sips) },
    );
    last = index + match[0].length;
  }
  if (last < template.length) segments.push({ type: 'text', value: template.slice(last) });
  return segments;
}

export function plainText(segments: readonly Segment[]) {
  return segments.map((s) => s.value).join('');
}

// Defensive: the seed strips these, but a stray prefix would repeat the kind label.
const PREFIXES: Partial<Record<CardKind, RegExp>> = {
  vote: /^(?:abstimmung|vote)\s*:\s*/i,
  never: /^(?:ich hab(?:e)? noch nie|never have i ever)\b[\s:,.]*/i,
  curse: /^(?:fluch|curse)\s*:\s*/i,
  curseEnd: /^(?:fluch|curse)\s*:\s*/i,
  rule: /^(?:neue regel|new rule|regel|rule)\s*:\s*/i,
  ruleEnd: /^(?:neue regel|new rule|regel|rule)\s*:\s*/i,
  category: /^(?:kategorie|category)\s*:\s*/i,
  double: /^(?:doppelt oder nichts|double or nothing)\s*[:!.]?\s*/i,
  roulette: /^roulette\s*:\s*/i,
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function cardTemplate(card: DeckCard, locale: Locale) {
  const raw = (locale === 'en' ? (card.contentEn ?? card.content) : card.content).trim();
  const prefix = PREFIXES[card.kind];
  if (!prefix) return raw;
  const stripped = raw.replace(prefix, '');
  if (!stripped) return raw;
  return card.kind === 'never' ? stripped : capitalize(stripped);
}

// The stored versus text keeps "{{player}} gegen {{player}}: ", the UI shows the rest.
const VERSUS_PREFIX =
  /^\s*\{\{player\}\}\s+(?:gegen|vs\.?|versus|against)\s+\{\{player\}\}\s*:\s*/i;

export function splitVersus(template: string): string | null {
  const match = template.match(VERSUS_PREFIX);
  if (!match) return null;
  const rest = template.slice(match[0].length).trim();
  return rest ? capitalize(rest) : null;
}

const TOPIC = /^([^.:!?{}]{1,40})[.:!?]\s+([\s\S]+)$/;

/** "Automarken. {{player}} fängt an." becomes the topic "Automarken" and the instruction. */
export function splitTopic(template: string): { topic: string; rest: string } | null {
  const match = template.match(TOPIC);
  if (!match) return null;
  return { topic: match[1]!.trim(), rest: match[2]!.trim() };
}
