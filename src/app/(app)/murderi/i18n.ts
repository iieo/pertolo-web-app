import type { ErrorKey } from './limits';

export type Locale = 'de' | 'en';

export const LOCALES: Locale[] = ['de', 'en'];

export type Dictionary = {
  title: string;
  subtitle: string;
  language: string;
  back: string;
  overview: string;
  rulesTitle: string;
  rulesList: string[];
  joinTitle: string;
  codeLabel: string;
  codeHint: string;
  join: string;
  joining: string;
  createGame: string;
  createTitle: string;
  createSubtitle: (min: number) => string;
  nameLabel: string;
  namePlaceholder: string;
  add: string;
  remove: (name: string) => string;
  playersHeading: string;
  playerCount: (count: number) => string;
  needMore: (count: number) => string;
  maxReached: (max: number) => string;
  create: string;
  creating: string;
  shareTitle: string;
  shareSubtitle: string;
  linkLabel: string;
  share: string;
  copyLink: string;
  copied: string;
  copyFailed: string;
  shareMessage: (code: string) => string;
  toGame: string;
  gameLabel: (code: string) => string;
  whoAreYou: string;
  whoAreYouHint: string;
  claimAs: (name: string) => string;
  cancel: string;
  claiming: string;
  taken: string;
  free: string;
  youName: (name: string) => string;
  winnerLabel: string;
  aliveCount: (alive: number, total: number) => string;
  showTarget: string;
  youAre: (name: string) => string;
  youAreOut: string;
  youAreOutHint: string;
  gameOver: string;
  winnerIs: (name: string) => string;
  youWon: string;
  youWonHint: string;
  shareGame: string;
  gameNotFound: string;
  gameNotFoundHint: string;
  yourTarget: string;
  newTarget: string;
  targetHint: string;
  reportKilled: string;
  confirmTitle: string;
  confirmHint: string;
  confirmKilled: string;
  reporting: string;
  transferDevice: string;
  transferHint: string;
  transferCopied: string;
  transferCopyFailed: string;
  errors: Record<ErrorKey, string>;
};

const de: Dictionary = {
  title: 'Murderi',
  subtitle:
    'Ein Mörderspiel für Stunden oder Tage. Erwische dein Ziel, bevor dich jemand erwischt.',
  language: 'Sprache',
  back: 'Zurück',
  overview: 'Übersicht',
  rulesTitle: 'So geht es',
  rulesList: [
    'Jede Person spielt auf dem eigenen Handy und sieht dort ein geheimes Ziel.',
    'Du erwischst dein Ziel, wenn die Person einen beliebigen Gegenstand von dir annimmt.',
    'Wenn du erwischt wurdest, tippst du auf deinem Handy auf „Ich wurde getötet“. Dein Ziel geht dann an die Person, die dich erwischt hat.',
    'Wer als Letztes übrig bleibt, gewinnt.',
  ],
  joinTitle: 'Spiel beitreten',
  codeLabel: 'Code',
  codeHint: 'Vier Buchstaben, die du von der Person bekommen hast, die das Spiel erstellt hat.',
  join: 'Beitreten',
  joining: 'Spiel wird gesucht',
  createGame: 'Neues Spiel erstellen',
  createTitle: 'Neues Spiel',
  createSubtitle: (min) => `Trage alle Namen ein, mindestens ${min}. Jeder Name nur einmal.`,
  nameLabel: 'Name',
  namePlaceholder: 'Name eingeben',
  add: 'Hinzufügen',
  remove: (name) => `${name} entfernen`,
  playersHeading: 'Spieler',
  playerCount: (count) => `${count} ${count === 1 ? 'Person' : 'Personen'}`,
  needMore: (count) =>
    count === 1 ? 'Es fehlt noch eine Person.' : `Es fehlen noch ${count} Personen.`,
  maxReached: (max) => `Mehr als ${max} Personen sind nicht möglich.`,
  create: 'Spiel erstellen',
  creating: 'Wird erstellt',
  shareTitle: 'Alle einladen',
  shareSubtitle:
    'Schick allen den Link. Jede Person öffnet ihn auf dem eigenen Handy und wählt ihren Namen.',
  linkLabel: 'Link',
  share: 'Link teilen',
  copyLink: 'Link kopieren',
  copied: 'Kopiert',
  copyFailed: 'Kopieren hat nicht geklappt. Markiere den Link und kopiere ihn selbst.',
  shareMessage: (code) => `Spiel mit mir Murderi. Code: ${code}`,
  toGame: 'Zum Spiel',
  gameLabel: (code) => `Spiel ${code}`,
  whoAreYou: 'Wer bist du?',
  whoAreYouHint:
    'Wähle deinen Namen. Danach kann ihn niemand sonst wählen. Willst du später woanders weiterspielen, nimmst du ihn bei deinem Ziel über „Auf anderem Gerät öffnen“ mit.',
  claimAs: (name) => `Ich bin ${name}`,
  cancel: 'Abbrechen',
  claiming: 'Wird gespeichert',
  taken: 'vergeben',
  free: 'frei',
  youName: (name) => `${name} (du)`,
  winnerLabel: 'gewonnen',
  aliveCount: (alive, total) => `${alive} von ${total} sind noch dabei.`,
  showTarget: 'Mein Ziel anzeigen',
  youAre: (name) => `Du bist ${name}`,
  youAreOut: 'Du bist raus',
  youAreOutHint: 'Du wurdest erwischt. Hier siehst du, wie das Spiel weitergeht.',
  gameOver: 'Spiel vorbei',
  winnerIs: (name) => `${name} hat gewonnen.`,
  youWon: 'Du hast gewonnen',
  youWonHint: 'Außer dir ist niemand mehr übrig.',
  shareGame: 'Spiel teilen',
  gameNotFound: 'Spiel nicht gefunden',
  gameNotFoundHint: 'Prüfe den Code oder frag die Person, die das Spiel erstellt hat.',
  yourTarget: 'Dein Ziel',
  newTarget: 'Neues Ziel',
  targetHint: 'Bring die Person dazu, einen Gegenstand von dir anzunehmen.',
  reportKilled: 'Ich wurde getötet',
  confirmTitle: 'Wirklich raus?',
  confirmHint:
    'Das lässt sich nicht rückgängig machen. Dein Ziel geht an die Person, die dich erwischt hat.',
  confirmKilled: 'Ja, ich bin raus',
  reporting: 'Wird gespeichert',
  transferDevice: 'Auf anderem Gerät öffnen',
  transferHint:
    'Der Link gehört nur dir. Wer ihn öffnet, spielt als du. Schick ihn also an niemand anderen.',
  transferCopied: 'Link kopiert. Öffne ihn im anderen Browser oder auf dem anderen Gerät.',
  transferCopyFailed: 'Kopieren hat nicht geklappt. Versuch es nochmal.',
  errors: {
    invalidInput: 'Die Eingabe ist ungültig.',
    notFound: 'Kein Spiel mit diesem Code gefunden.',
    tooFewPlayers: 'Es braucht mindestens 3 Personen.',
    tooManyPlayers: 'Es gehen höchstens 50 Personen.',
    nameTooLong: 'Der Name ist zu lang.',
    emptyName: 'Gib einen Namen ein.',
    duplicateName: 'Diesen Namen gibt es schon.',
    reservedName: 'Dieser Name ist nicht möglich.',
    alreadyTaken:
      'Dieser Name ist schon vergeben. Wenn du das bist, öffne dein Ziel dort, wo du ihn gewählt hast, und tippe auf „Auf anderem Gerät öffnen“.',
    alreadyClaimed: 'In diesem Browser ist schon ein anderer Name gewählt.',
    notClaimed: 'Wähle zuerst deinen Namen.',
    alreadyDead: 'Du bist schon raus.',
    alreadyWon: 'Du hast schon gewonnen.',
    gameOver: 'Das Spiel ist schon vorbei.',
    busy: 'Gerade ist viel los. Versuch es gleich nochmal.',
    unknown: 'Etwas ist schiefgelaufen. Versuch es nochmal.',
  },
};

const en: Dictionary = {
  title: 'Murderi',
  subtitle:
    'An assassin game that runs for hours or days. Get your target before someone gets you.',
  language: 'Language',
  back: 'Back',
  overview: 'Overview',
  rulesTitle: 'How to play',
  rulesList: [
    'Everyone plays on their own phone and sees a secret target there.',
    'You get your target when they accept any object from you.',
    'If you get caught, tap "I have been killed" on your phone. Your target then passes to whoever caught you.',
    'The last player left wins.',
  ],
  joinTitle: 'Join a game',
  codeLabel: 'Code',
  codeHint: 'The four letters you got from the person who created the game.',
  join: 'Join',
  joining: 'Looking for game',
  createGame: 'Create a new game',
  createTitle: 'New game',
  createSubtitle: (min) => `Enter every name, at least ${min}. Each name only once.`,
  nameLabel: 'Name',
  namePlaceholder: 'Enter a name',
  add: 'Add',
  remove: (name) => `Remove ${name}`,
  playersHeading: 'Players',
  playerCount: (count) => `${count} ${count === 1 ? 'player' : 'players'}`,
  needMore: (count) => `${count} more ${count === 1 ? 'player' : 'players'} needed.`,
  maxReached: (max) => `No more than ${max} players.`,
  create: 'Create game',
  creating: 'Creating',
  shareTitle: 'Invite everyone',
  shareSubtitle:
    'Send everyone the link. Each player opens it on their own phone and picks their name.',
  linkLabel: 'Link',
  share: 'Share link',
  copyLink: 'Copy link',
  copied: 'Copied',
  copyFailed: 'Copying did not work. Select the link and copy it yourself.',
  shareMessage: (code) => `Join my Murderi game. Code: ${code}`,
  toGame: 'Go to game',
  gameLabel: (code) => `Game ${code}`,
  whoAreYou: 'Who are you?',
  whoAreYouHint:
    'Pick your name. Nobody else can take it afterwards. To keep playing somewhere else later, move it with "Open on another device" on your target screen.',
  claimAs: (name) => `I am ${name}`,
  cancel: 'Cancel',
  claiming: 'Saving',
  taken: 'taken',
  free: 'free',
  youName: (name) => `${name} (you)`,
  winnerLabel: 'won',
  aliveCount: (alive, total) => `${alive} of ${total} still in the game.`,
  showTarget: 'Show my target',
  youAre: (name) => `You are ${name}`,
  youAreOut: 'You are out',
  youAreOutHint: 'You got caught. Follow the rest of the game here.',
  gameOver: 'Game over',
  winnerIs: (name) => `${name} won.`,
  youWon: 'You won',
  youWonHint: 'You are the last one left.',
  shareGame: 'Share game',
  gameNotFound: 'Game not found',
  gameNotFoundHint: 'Check the code or ask the person who created the game.',
  yourTarget: 'Your target',
  newTarget: 'New target',
  targetHint: 'Get them to accept any object from you.',
  reportKilled: 'I have been killed',
  confirmTitle: 'Really out?',
  confirmHint: 'This cannot be undone. Your target passes to the person who caught you.',
  confirmKilled: 'Yes, I am out',
  reporting: 'Saving',
  transferDevice: 'Open on another device',
  transferHint:
    'This link is yours alone. Whoever opens it plays as you, so do not send it to anyone else.',
  transferCopied: 'Link copied. Open it in the other browser or on the other device.',
  transferCopyFailed: 'Copying did not work. Try again.',
  errors: {
    invalidInput: 'That input is not valid.',
    notFound: 'No game found with this code.',
    tooFewPlayers: 'You need at least 3 players.',
    tooManyPlayers: 'No more than 50 players.',
    nameTooLong: 'That name is too long.',
    emptyName: 'Enter a name.',
    duplicateName: 'That name is already in the list.',
    reservedName: "This name isn't allowed.",
    alreadyTaken:
      'That name is already taken. If it is yours, open your target where you picked it and tap "Open on another device".',
    alreadyClaimed: 'This browser already picked a different name.',
    notClaimed: 'Pick your name first.',
    alreadyDead: 'You are already out.',
    alreadyWon: 'You already won.',
    gameOver: 'The game is already over.',
    busy: 'A lot is happening right now. Try again in a moment.',
    unknown: 'Something went wrong. Try again.',
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };

export function errorMessage(t: Dictionary, key: string): string {
  return key in t.errors ? t.errors[key as ErrorKey] : t.errors.unknown;
}
