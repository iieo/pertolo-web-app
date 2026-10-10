import type { DefaultTask, DrinkTaskKind } from '@/types/task';

const DEFAULT_ROUNDS = 3;
const MAX_TIMER_SECONDS = 180;

const NUMBER_WORDS: Record<string, number> = {
  ein: 1,
  eine: 1,
  einer: 1,
  zwei: 2,
  drei: 3,
  vier: 4,
  fünf: 5,
  sechs: 6,
  sieben: 7,
  acht: 8,
  neun: 9,
  zehn: 10,
  fünfzehn: 15,
  zwanzig: 20,
  dreißig: 30,
  sechzig: 60,
};

const NUM =
  '(\\d+|ein|eine|einer|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|fünfzehn|zwanzig|dreißig|sechzig)';

function toNumber(raw: string) {
  const n = Number(raw);
  if (Number.isFinite(n)) return n;
  return NUMBER_WORDS[raw.toLowerCase()] ?? null;
}

// Prefixes the UI replaces with its own label. Each entry pairs the German and English form.
const PREFIXES: Partial<Record<DrinkTaskKind, { de: RegExp; en: RegExp }[]>> = {
  vote: [
    { de: /^Abstimmung:\s*/, en: /^Vote:\s*/i },
    { de: /^Die Runde stimmt ab:\s*/, en: /^(Group vote|Vote):\s*/i },
  ],
  never: [{ de: /^Ich hab(?:e)? (?:(mich|dich|mir) )?noch nie\s+/, en: /^Never have I ever\s+/i }],
  curse: [{ de: /^Fluch:\s*/, en: /^Curse:\s*/i }],
  double: [{ de: /^Doppelt oder nichts:\s*/, en: /^Double or nothing:\s*/i }],
};

const END_TEXT: Partial<Record<DrinkTaskKind, { de: string; en: string }>> = {
  rule: { de: 'Die Regel ist aufgehoben.', en: 'The rule is over.' },
  curse: { de: 'Der Fluch ist gebrochen.', en: 'The curse is broken.' },
};

// "für die nächsten 5 Aufgaben", "in den nächsten 3 Aufgaben", "ab sofort für 3 Aufgaben", "3 Aufgaben lang"
const LASTING = new RegExp(
  `\\b(?:(?:für|in|auf) (?:die|den) nächsten ${NUM} (Aufgaben|Karten|Runden|Minuten)|für ${NUM} (Aufgaben|Karten|Runden)|${NUM} (Aufgaben|Karten) lang)\\b`,
  'i',
);
const LASTING_ONE =
  /\b(?:für die nächste|bis zur nächsten|in der nächsten) (Aufgabe|Karte|Runde)\b/i;

function lastingRounds(de: string) {
  const match = de.match(LASTING);
  if (match) {
    const raw = match[1] ?? match[3] ?? match[5];
    const unit = match[2] ?? match[4] ?? match[6];
    const n = raw ? toNumber(raw) : null;
    if (!n) return DEFAULT_ROUNDS;
    // Roughly one card per minute, capped so a "10 minute" rule doesn't run forever.
    return unit?.toLowerCase() === 'minuten' ? Math.min(Math.max(n, 2), 10) : n;
  }
  if (LASTING_ONE.test(de)) return 1;
  return null;
}

function isRule(de: string) {
  if (/^(Neue Regel|Regel:)/.test(de)) return true;
  return LASTING.test(de) || LASTING_ONE.test(de);
}

function timerSeconds(de: string) {
  // Guessing when time is up must not show a countdown.
  if (/\bohne Uhr\b/i.test(de)) return null;
  const sec = de.match(new RegExp(`\\b${NUM} Sekunden\\b`, 'i'));
  if (sec) {
    const n = toNumber(sec[1]!);
    if (n && n > 0 && n <= MAX_TIMER_SECONDS) return n;
  }
  const min = de.match(
    new RegExp(
      `\\b(?:(?:für|in|innerhalb von|binnen) ${NUM} Minuten?|${NUM} Minuten? lang)\\b`,
      'i',
    ),
  );
  const minutes = min ? toNumber((min[1] ?? min[2])!) : null;
  if (minutes && minutes * 60 <= MAX_TIMER_SECONDS) return minutes * 60;
  return null;
}

function isVote(de: string) {
  return (
    /^Abstimmung\b/.test(de) ||
    /^Die Runde stimmt ab\b/.test(de) ||
    /^Mehrheit gewinnt\b/.test(de) ||
    /^Auf (drei|3) zeigen alle\b/.test(de) ||
    /^Alle zeigen [^.!]{0,30}\bauf die Person\b/.test(de) ||
    /^Wer würde (eher|am ehesten)\b/.test(de)
  );
}

function isCategory(de: string) {
  if (/^Kategorie/.test(de)) return true;
  if (/\b(Reimkette|Wortkette|Wort-Kette|Wortassoziation)\b/.test(de)) return true;
  if (/^(Song|Länder|Städte|Filmtitel|Promi)-Kette\b/.test(de)) return true;
  if (
    /^(Ich packe meinen Koffer|Ich gehe (auf eine Party|in den Supermarkt)|Ich mixe einen Cocktail)\b/.test(
      de,
    )
  ) {
    return true;
  }
  if (/\bAlphabet reihum mit\b/.test(de)) return true;
  return (
    /\b(reihum|abwechselnd|der Reihe nach|im Uhrzeigersinn)\b/i.test(de) &&
    /\b(nenn\w*|aufzähl\w*|ein Wort|einen Begriff|reimt)\b/i.test(de)
  );
}

const GROUP_START =
  /^(Alle|Jeder|Jede|Ihr alle|Die ganze Runde|Reihum|Zählt|Teilt euch|2 Teams|Teamspiel|Wer|Die Person|Die (jüngste|älteste|größte|kleinste|zwei jüngsten)|Diejenigen)\b/;

// Many group games open with a name like "Mini-Wasserfall:" or "Prost!" before the actual instruction.
function withoutLabel(de: string) {
  const match = de.match(/^[^.!?:{}]{1,40}[:!]\s+(.*)$/);
  return match ? match[1]! : null;
}

function isGroup(de: string) {
  if (GROUP_START.test(de)) return true;
  const rest = withoutLabel(de);
  return rest !== null && GROUP_START.test(rest);
}

function isQuestion(de: string) {
  if (!/^\{\{player\}\}/.test(de)) return false;
  if (/^\{\{player\}\} (beantwortet|muss \S+ Fragen)/.test(de)) return true;
  if (!/^\{\{player\}\},/.test(de)) return false;
  // Trivia and "pick one of two players" are not personal questions.
  if (/\b(prüft|geraten|wer von \{\{player\}\})/i.test(de)) return false;
  return /\b(beantworte|antworte|verrate|gestehe?|gib zu)\b/i.test(de) || /\?/.test(de);
}

const COMPETITIVE =
  /\b(wer (zuerst|als Erstes|als Erster|länger|schneller|mehr|weniger|verliert|gewinnt|langsamer|näher|passt|zögert|stockt|hängen bleibt)|wem (zuerst|keine?s?r? mehr)|verlierer|gewinner|best of|abwechselnd)\b/i;

function isVersus(de: string) {
  if (/^\{\{player\}\} gegen \{\{player\}\}/.test(de)) return true;
  // The UI shows the first two players as opponents, so a third player (a referee) rules it out.
  if (playerCount(de) !== 2) return false;
  const pair = de.search(/\{\{player\}\} und \{\{player\}\}/);
  return pair >= 0 && pair <= 40 && COMPETITIVE.test(de);
}

function playerCount(text: string) {
  return text.match(/\{\{player\}\}/g)?.length ?? 0;
}

export function detectKind(de: string): DrinkTaskKind {
  if (/^Fluch:/.test(de)) return 'curse';
  if (/^Doppelt oder nichts\b/.test(de)) return 'double';
  if (/^Roulette\b/.test(de)) return 'roulette';
  if (/^Ich hab(e)? ((mich|dich|mir) )?noch nie\b/.test(de)) return 'never';
  if (isVote(de)) return 'vote';
  if (/^\{\{player\}\} gegen \{\{player\}\}/.test(de)) return 'versus';
  if (isRule(de)) return 'rule';
  if (isVersus(de)) return 'versus';
  if (isCategory(de)) return 'category';
  if (timerSeconds(de) !== null) return 'timer';
  // Hot seat rounds often start with "Alle stellen ...", but they are questions to one player.
  if (/^Hot Seat\b/.test(de)) return 'question';
  if (isGroup(de)) return 'group';
  if (isQuestion(de)) return 'question';
  return 'task';
}

function upperFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function strip(kind: DrinkTaskKind, de: string, en: string) {
  const prefixes = PREFIXES[kind];
  if (!prefixes) return { de, en, enMissed: false };
  const entry = prefixes.find((p) => p.de.test(de));
  if (!entry) return { de, en, enMissed: false };
  // "Ich hab noch nie" is replaced by a label, the continuation stays lowercase on purpose.
  const fix = kind === 'never' ? (t: string) => t : upperFirst;
  // A reflexive pronoun ("Ich hab mich noch nie ...") stays with the continuation.
  const strippedDe = fix(
    de.replace(entry.de, (_m, reflexive) => (typeof reflexive === 'string' ? `${reflexive} ` : '')),
  );
  if (!entry.en.test(en)) return { de: strippedDe, en, enMissed: true };
  return { de: strippedDe, en: fix(en.replace(entry.en, '')), enMissed: false };
}

const ROLE_DE = /^\{\{player\}\} ist für die nächsten \S+ \S+ (?:der|die|das) ([^\s.,:]+)/;
const ROLE_EN = /^\{\{player\}\} is the ([A-Z][\w-]*(?: [A-Z][\w-]*)?|[a-z][\w-]*) for the next/;

function endText(kind: DrinkTaskKind, de: string, en: string) {
  const fallback = END_TEXT[kind];
  if (!fallback) return null;
  if (kind === 'rule') {
    const roleDe = de.match(ROLE_DE)?.[1];
    const roleEn = en.match(ROLE_EN)?.[1];
    if (roleDe && roleEn) {
      return { de: `Die Rolle als ${roleDe} ist vorbei.`, en: `The ${roleEn} role is over.` };
    }
  }
  return fallback;
}

export function classifyTaskDetailed(de: string, en: string) {
  const kind = detectKind(de);
  const stripped = strip(kind, de, en);
  const task: DefaultTask = { type: 'default', content: stripped.de, contentEn: stripped.en, kind };

  if (kind === 'rule' || kind === 'curse') {
    task.rounds = lastingRounds(de) ?? DEFAULT_ROUNDS;
    const end = endText(kind, de, en);
    if (end) {
      task.endContent = end.de;
      task.endContentEn = end.en;
    }
  }
  if (kind === 'timer') {
    task.seconds = timerSeconds(de) ?? undefined;
  }
  return { task, enPrefixMissed: stripped.enMissed };
}

export function classifyTask(de: string, en: string): DefaultTask {
  return classifyTaskDetailed(de, en).task;
}
