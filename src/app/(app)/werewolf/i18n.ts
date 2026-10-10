import { LOCALES, type Locale } from '@/components/game/locale';

import type { DeathCause, Winner } from './lib/engine';
import type { Role, RolesError, Team } from './lib/roles';
import type { TransformCause } from './lib/view';

export { LOCALES, type Locale };

type RoleText = {
  name: string;
  plural: string;
  /** One line for the role planner. */
  short: string;
  /** Full ability text for the reveal and the rules. */
  ability: string;
};

export type Dictionary = {
  title: string;
  subtitle: string;
  rules: string;
  rulesTitle: string;
  rulesList: string[];
  rulesRolesHeading: string;
  rulesConfirm: string;
  language: string;
  loading: string;
  connectionLost: string;

  createHeading: string;
  createHint: string;
  nameLabel: string;
  namePlaceholder: string;
  create: string;
  joinHeading: string;
  joinHint: string;
  codeLabel: string;
  join: string;

  joinGameTitle: (code: string) => string;
  joinGameHint: string;
  rejoinHeading: string;
  rejoinHint: string;
  rejoinAs: (name: string) => string;
  gameRunning: string;
  gameGoneTitle: string;
  gameGoneText: string;
  backToStart: string;

  codeHeading: string;
  copyLink: string;
  linkCopied: string;
  shareHint: string;
  playersHeading: (count: number) => string;
  you: string;
  host: string;
  offline: string;
  kick: string;
  kickLabel: (name: string) => string;
  rolesHeading: string;
  rolesCount: (total: number, players: number) => string;
  rolesOk: string;
  rolesErrors: Record<RolesError, string>;
  resetPreset: string;
  decrease: (role: string) => string;
  increase: (role: string) => string;
  waitingForHost: string;
  rolesInGame: string;
  start: string;

  revealTitle: string;
  revealHint: string;
  tapToReveal: string;
  tapToHide: string;
  teamLine: (team: string) => string;
  packHeading: string;
  traitorWolvesHeading: string;
  siblingsHeading: Record<'sisters' | 'brothers', string>;
  ready: string;
  waitingForOthers: string;
  waitingFor: (names: string) => string;

  myRole: string;
  close: string;
  dealtRole: (role: string) => string;
  transformed: Record<TransformCause, string>;
  loverInfo: (name: string) => string;
  loversMixed: string;
  loversSame: string;
  wildChildModel: (name: string) => string;
  wildChildConverted: string;
  seerResultsHeading: string;
  seerResultLine: (name: string, role: string) => string;
  foxLine: (name: string, wolf: boolean) => string;
  foxPowerLost: string;
  detectiveLine: (a: string, b: string, same: boolean) => string;
  nightLabel: (round: number) => string;
  healLeft: string;
  healUsed: string;
  poisonLeft: string;
  poisonUsed: string;
  protectorLast: (name: string) => string;
  priestAvailable: string;
  priestBlessed: (name: string) => string;
  priestSpent: string;
  infectLeft: string;
  infectUsed: string;
  judgeLeft: string;
  judgeUsed: string;
  charmedSelf: string;
  charmedHeading: string;
  charmedNone: string;
  beholderSeer: (name: string) => string;
  beholderApprentice: (name: string) => string;
  beholderNoSeer: string;

  nightTitle: string;
  nightText: string;
  youAreOut: string;
  skipText: string;
  skipButton: string;

  cupidTitle: string;
  cupidText: string;
  wildChildTitle: string;
  wildChildText: string;
  wandererTitle: string;
  wandererText: string;
  protectorTitle: string;
  protectorText: string;
  protectorLastNote: (name: string) => string;
  priestTitle: string;
  priestText: string;
  priestPass: string;
  seerTitle: string;
  seerText: string;
  wolfSeerTitle: string;
  wolfSeerText: string;
  foxTitle: string;
  foxText: string;
  detectiveTitle: string;
  detectiveText: string;
  wolvesTitle: string;
  wolvesText: string;
  wolvesTwoKills: string;
  wolvesSecond: (name: string) => string;
  pickedBy: (names: string) => string;
  infectTitle: string;
  infectText: string;
  infectPass: string;
  bigBadWolfTitle: string;
  bigBadWolfText: string;
  whiteWolfTitle: string;
  whiteWolfText: string;
  whiteWolfPass: string;
  serialKillerTitle: string;
  serialKillerText: string;
  witchTitle: string;
  witchVictims: (names: string) => string;
  witchNoVictim: string;
  witchHealHeading: string;
  witchHealHint: string;
  witchHeal: (name: string) => string;
  witchPoisonHeading: string;
  witchPoisonHint: string;
  witchDone: string;
  grandmaTitle: string;
  grandmaText: string;
  grandmaLastNote: (name: string) => string;
  piperTitle: string;
  piperText: (max: number) => string;
  hunterTitle: string;
  hunterText: string;
  shoot: string;
  confirm: string;
  seerResultTitle: string;
  seerResultText: (name: string) => string;
  foxResultTitle: string;
  foxQuestion: (name: string) => string;
  detectiveResultTitle: string;
  detectiveQuestion: (a: string, b: string) => string;
  yes: string;
  no: string;
  understood: string;

  dayTitle: string;
  morningHeading: string;
  noDeaths: string;
  causes: Partial<Record<DeathCause, string>>;
  bearGrowls: string;
  bearQuiet: string;
  silencedToday: (name: string) => string;
  cannotVoteToday: string;
  hunterChoosing: (name: string) => string;
  discussText: string;
  aliveHeading: (count: number) => string;
  deadHeading: string;
  cannotVoteNote: string;
  startVote: string;

  voteTitle: string;
  secondVoteTitle: string;
  voteText: string;
  secondVoteText: string;
  voteDouble: string;
  abstain: string;
  castVote: string;
  yourVote: (name: string) => string;
  youAbstained: string;
  cannotVote: string;
  votedHeading: string;
  waitingHeading: string;
  endVote: string;

  resultTitle: string;
  secondResultTitle: string;
  votesCount: (count: number) => string;
  abstainedCount: (count: number) => string;
  eliminated: (name: string) => string;
  scapegoatDied: (name: string) => string;
  tie: string;
  noVotes: string;
  idiotRevealed: (name: string) => string;
  alsoDied: string;
  judgeButton: string;
  judgeHint: string;
  continueToNight: string;

  winTitles: Record<Winner, string>;
  winTexts: Record<Winner, string>;
  everyoneHeading: string;
  won: string;
  dead: string;
  dealtAs: (role: string) => string;
  lovers: (a: string, b: string) => string;
  playAgain: string;
  waitingForNewRound: string;

  quit: string;
  quitTitle: string;
  quitDescription: string;
  keepPlaying: string;

  teams: Record<Team, string>;
  roles: Record<Role, RoleText>;
  errors: Record<string, string>;
  errorFallback: string;
};

const de: Dictionary = {
  title: 'Werwolf',
  subtitle: 'Jeder spielt am eigenen Handy. Die App erzählt, ihr müsst nur lügen.',
  rules: 'Regeln',
  rulesTitle: 'Spielregeln',
  rulesList: [
    'Eine Person erstellt das Spiel, alle anderen treten mit dem Code bei. Ab 3 Personen geht es los, richtig gut wird es ab 8.',
    'Jede Person bekommt geheim eine Rolle. Es gibt das Dorf, die Werwölfe und Einzelgänger, die nur für sich spielen. Die Werwölfe kennen sich.',
    'Nachts schließen alle die Augen. Wer an der Reihe ist, wird vom Handy geweckt und handelt still.',
    'Am Morgen erfahrt ihr, wer gestorben ist, und seht dessen Rolle. Je nach Rollen erfahrt ihr auch, ob der Bär brummt und wer heute nicht abstimmen darf.',
    'Tagsüber diskutiert ihr und stimmt ab, wer das Dorf verlassen muss. Die Stimme des Bürgermeisters zählt doppelt. Bei Gleichstand muss niemand gehen, außer es gibt einen Sündenbock.',
    'Das Dorf gewinnt, wenn kein Werwolf, kein Weißer Werwolf und kein Serienmörder mehr lebt.',
    'Die Werwölfe gewinnen, sobald sie mindestens so viele sind wie der Rest und weder Weißer Werwolf noch Serienmörder leben. Der Verräter gewinnt mit ihnen.',
    'Einzelgänger gewinnen allein, so wie es bei ihrer Rolle steht. Verliebte aus verschiedenen Lagern gewinnen zusammen, wenn sie die letzten zwei sind.',
    'Manche Rollen ändern sich im Spiel, etwa wenn der Urwolf jemanden infiziert. Dein Handy sagt es dir unter Meine Rolle.',
    'Wer tot ist, schaut zu und verrät nichts.',
  ],
  rulesRolesHeading: 'Rollen',
  rulesConfirm: 'Verstanden',
  language: 'Sprache',
  loading: 'Lädt',
  connectionLost: 'Keine Verbindung. Versuche es weiter.',

  createHeading: 'Neues Spiel',
  createHint: 'Du leitest das Spiel und spielst selbst mit.',
  nameLabel: 'Dein Name',
  namePlaceholder: 'Name',
  create: 'Spiel erstellen',
  joinHeading: 'Beitreten',
  joinHint: 'Gib den Code ein, den du bekommen hast.',
  codeLabel: 'Code',
  join: 'Beitreten',

  joinGameTitle: (code) => `Spiel ${code}`,
  joinGameHint: 'Gib deinen Namen ein, um beizutreten.',
  rejoinHeading: 'Wieder einsteigen',
  rejoinHint: 'Bist du rausgeflogen? Tippe auf deinen Namen.',
  rejoinAs: (name) => `Als ${name} wieder einsteigen`,
  gameRunning: 'Das Spiel läuft schon. Neue Leute können in der nächsten Runde dazukommen.',
  gameGoneTitle: 'Spiel nicht gefunden',
  gameGoneText: 'Dieses Spiel gibt es nicht mehr. Erstelle ein neues oder prüfe den Code.',
  backToStart: 'Zum Start',

  codeHeading: 'Code',
  copyLink: 'Link kopieren',
  linkCopied: 'Link kopiert',
  shareHint: 'Die anderen treten mit dem Code oder dem Link bei.',
  playersHeading: (count) => `Spieler (${count})`,
  you: 'du',
  host: 'Spielleitung',
  offline: 'offline',
  kick: 'Entfernen',
  kickLabel: (name) => `${name} entfernen`,
  rolesHeading: 'Rollen',
  rolesCount: (total, players) => `${total} / ${players} Rollen`,
  rolesOk: 'Passt, ihr könnt starten.',
  rolesErrors: {
    TOO_FEW_PLAYERS: 'Ihr braucht mindestens 3 Spieler.',
    TOO_MANY_PLAYERS: 'Höchstens 20 Spieler.',
    ROLE_COUNT_MISMATCH: 'Es muss genau eine Rolle pro Spieler geben.',
    NO_WOLVES:
      'Es braucht mindestens einen Werwolf, Großen bösen Wolf, ein Wolfsjunges oder einen Urwolf.',
    TOO_MANY_WOLVES:
      'Die Werwölfe müssen weniger als die Hälfte sein. Der Weiße Werwolf zählt mit, der Verräter nicht.',
    ROLE_LIMIT: 'Diese Rolle gibt es nur einmal.',
    GROUP_SIZE: 'Schwestern gibt es nur zu zweit, Brüder nur zu dritt.',
    TOO_MANY_SOLOS: 'Höchstens 3 Einzelgänger pro Spiel.',
  },
  resetPreset: 'Vorschlag übernehmen',
  decrease: (role) => `${role} entfernen`,
  increase: (role) => `${role} hinzufügen`,
  waitingForHost: 'Warte, bis die Spielleitung startet.',
  rolesInGame: 'Rollen in diesem Spiel',
  start: 'Spiel starten',

  revealTitle: 'Deine Rolle',
  revealHint: 'Halte das Handy so, dass niemand mitliest.',
  tapToReveal: 'Tippen, um deine Rolle zu sehen',
  tapToHide: 'Tippen zum Verstecken',
  teamLine: (team) => `Team: ${team}`,
  packHeading: 'Dein Rudel',
  traitorWolvesHeading: 'Die Werwölfe',
  siblingsHeading: { sisters: 'Deine Schwester', brothers: 'Deine Brüder' },
  ready: 'Bereit',
  waitingForOthers: 'Warte auf die anderen',
  waitingFor: (names) => `Warte auf ${names}`,

  myRole: 'Meine Rolle',
  close: 'Schließen',
  dealtRole: (role) => `Ausgeteilt war: ${role}`,
  transformed: {
    infected:
      'Der Urwolf hat dich infiziert. Du bist jetzt ein Werwolf und gewinnst mit den Werwölfen.',
    cursed:
      'Die Werwölfe haben dich angegriffen und der Fluch hat gewirkt. Du bist jetzt ein Werwolf.',
    apprentice: 'Die Seherin ist tot. Du bist jetzt die Seherin und siehst jede Nacht eine Rolle.',
    wolf_seer: 'Alle anderen Wölfe sind tot. Du bist jetzt ein Werwolf und jagst jede Nacht.',
  },
  loverInfo: (name) =>
    `Du bist in ${name} verliebt. Stirbt eine Person von euch, stirbt die andere vor Kummer.`,
  loversMixed:
    'Ihr gehört zu verschiedenen Seiten. Ihr gewinnt zusammen, wenn ihr die letzten zwei seid.',
  loversSame: 'Ihr seid im selben Team und gewinnt mit eurem Team.',
  wildChildModel: (name) => `Dein Vorbild: ${name}`,
  wildChildConverted: 'Dein Vorbild ist tot. Du bist jetzt ein Werwolf.',
  seerResultsHeading: 'Was du gesehen hast',
  seerResultLine: (name, role) => `${name}: ${role}`,
  foxLine: (name, wolf) => `${name}: ${wolf ? 'Werwolf in der Nähe' : 'kein Werwolf in der Nähe'}`,
  foxPowerLost: 'Du hast deine Fähigkeit verloren.',
  detectiveLine: (a, b, same) =>
    `${a} und ${b}: ${same ? 'im selben Team' : 'in verschiedenen Teams'}`,
  nightLabel: (round) => `Nacht ${round}`,
  healLeft: 'Heiltrank noch da',
  healUsed: 'Heiltrank benutzt',
  poisonLeft: 'Gifttrank noch da',
  poisonUsed: 'Gifttrank benutzt',
  protectorLast: (name) => `Letzte Nacht geschützt: ${name}`,
  priestAvailable: 'Dein Segen ist noch frei.',
  priestBlessed: (name) => `${name} ist gesegnet.`,
  priestSpent: 'Dein Segen ist verbraucht.',
  infectLeft: 'Du kannst einmal im Spiel infizieren.',
  infectUsed: 'Du hast schon infiziert.',
  judgeLeft: 'Du kannst einmal nach einem Ergebnis eine zweite Abstimmung starten.',
  judgeUsed: 'Du hast die zweite Abstimmung schon gestartet.',
  charmedSelf: 'Der Rattenfänger hat dich verzaubert.',
  charmedHeading: 'Verzaubert',
  charmedNone: 'Noch niemand ist verzaubert.',
  beholderSeer: (name) => `Die Seherin ist ${name}.`,
  beholderApprentice: (name) => `Der Seherlehrling ist ${name}.`,
  beholderNoSeer: 'In diesem Spiel gibt es keine Seherin.',

  nightTitle: 'Nacht',
  nightText: 'Augen zu. Dein Handy weckt dich, wenn du dran bist.',
  youAreOut: 'Du bist raus. Schau zu, aber verrate nichts.',
  skipText: 'Jemand braucht sehr lange.',
  skipButton: 'Zug überspringen',

  cupidTitle: 'Amor',
  cupidText: 'Wähle zwei Personen, die sich verlieben. Du darfst dich selbst wählen.',
  wildChildTitle: 'Wildes Kind',
  wildChildText: 'Wähle dein Vorbild. Stirbt es, wirst du zum Werwolf.',
  wandererTitle: 'Nachtwandlerin',
  wandererText:
    'Bei wem schläfst du heute Nacht? Liegst du bei einem Werwolf oder bei ihrem Opfer, stirbst du mit.',
  protectorTitle: 'Beschützer',
  protectorText: 'Wen beschützt du heute Nacht vor den Werwölfen?',
  protectorLastNote: (name) => `${name} hast du letzte Nacht beschützt.`,
  priestTitle: 'Priester',
  priestText: 'Willst du heute Nacht jemanden segnen? Du hast nur einen Segen im ganzen Spiel.',
  priestPass: 'Heute nicht',
  seerTitle: 'Seherin',
  seerText: 'Wessen Rolle willst du sehen?',
  wolfSeerTitle: 'Wolfsseher',
  wolfSeerText: 'Wessen Rolle willst du sehen?',
  foxTitle: 'Fuchs',
  foxText:
    'Wähle eine Person. Du erfährst, ob sie oder einer ihrer zwei Sitznachbarn ein Werwolf ist.',
  detectiveTitle: 'Detektiv',
  detectiveText: 'Wähle zwei Personen. Du erfährst, ob sie im selben Team sind.',
  wolvesTitle: 'Werwölfe',
  wolvesText: 'Einigt euch auf ein Opfer. Alle müssen dieselbe Person wählen.',
  wolvesTwoKills:
    'Das Wolfsjunge ist tot. Heute Nacht reißt ihr zwei Opfer, eins nach dem anderen.',
  wolvesSecond: (name) => `Erstes Opfer: ${name}. Einigt euch jetzt auf das zweite.`,
  pickedBy: (names) => `Gewählt von ${names}`,
  infectTitle: 'Urwolf',
  infectText:
    'Willst du das Opfer infizieren, statt es zu töten? Es überlebt und wird heimlich zum Werwolf. Das geht nur einmal im Spiel.',
  infectPass: 'Nicht infizieren',
  bigBadWolfTitle: 'Großer böser Wolf',
  bigBadWolfText: 'Wähle allein ein zweites Opfer.',
  whiteWolfTitle: 'Weißer Werwolf',
  whiteWolfText: 'Heute Nacht darfst du allein einen Werwolf töten.',
  whiteWolfPass: 'Niemanden töten',
  serialKillerTitle: 'Serienmörder',
  serialKillerText: 'Wen tötest du heute Nacht?',
  witchTitle: 'Hexe',
  witchVictims: (names) => `Die Werwölfe haben ${names} angegriffen.`,
  witchNoVictim: 'Heute Nacht wurde niemand angegriffen.',
  witchHealHeading: 'Heiltrank',
  witchHealHint: 'Tippe ein Opfer an, um es zu retten, oder lass es.',
  witchHeal: (name) => `${name} retten`,
  witchPoisonHeading: 'Gift',
  witchPoisonHint: 'Tippe jemanden an, um ihn zu vergiften, oder lass es.',
  witchDone: 'Fertig',
  grandmaTitle: 'Grummelige Oma',
  grandmaText: 'Wer darf morgen nicht abstimmen?',
  grandmaLastNote: (name) => `${name} hast du letzte Nacht gewählt.`,
  piperTitle: 'Rattenfänger',
  piperText: (max) =>
    max > 1
      ? 'Wen verzauberst du heute Nacht? Du kannst bis zu zwei Personen wählen.'
      : 'Wen verzauberst du heute Nacht?',
  hunterTitle: 'Jäger',
  hunterText: 'Du bist gestorben. Wen nimmst du mit?',
  shoot: 'Schießen',
  confirm: 'Bestätigen',
  seerResultTitle: 'Deine Vision',
  seerResultText: (name) => `${name} ist`,
  foxResultTitle: 'Deine Spürnase',
  foxQuestion: (name) => `Sitzt bei ${name} oder nebenan ein Werwolf?`,
  detectiveResultTitle: 'Deine Ermittlung',
  detectiveQuestion: (a, b) => `Sind ${a} und ${b} im selben Team?`,
  yes: 'Ja',
  no: 'Nein',
  understood: 'Verstanden',

  dayTitle: 'Tag',
  morningHeading: 'Heute Nacht',
  noDeaths: 'Heute Nacht ist niemand gestorben.',
  causes: {
    love: 'starb vor Kummer',
    hunter: 'vom Jäger erschossen',
    rust: 'am rostigen Schwert gestorben',
    serial_killer: 'vom Serienmörder getötet',
  },
  bearGrowls: 'Der Bär brummt.',
  bearQuiet: 'Der Bär bleibt still.',
  silencedToday: (name) => `${name} darf heute nicht abstimmen.`,
  cannotVoteToday: 'darf heute nicht abstimmen',
  hunterChoosing: (name) => `${name} war Jäger und wählt, wen er mitnimmt.`,
  discussText: 'Diskutiert, wer ein Werwolf sein könnte.',
  aliveHeading: (count) => `Am Leben (${count})`,
  deadHeading: 'Tot',
  cannotVoteNote: 'darf nicht abstimmen',
  startVote: 'Abstimmung starten',

  voteTitle: 'Abstimmung',
  secondVoteTitle: 'Zweite Abstimmung',
  voteText: 'Wer soll das Dorf verlassen?',
  secondVoteText: 'Es wird gleich noch einmal abgestimmt. Wer soll das Dorf verlassen?',
  voteDouble: 'Deine Stimme zählt doppelt.',
  abstain: 'Enthalten',
  castVote: 'Abstimmen',
  yourVote: (name) => `Deine Stimme: ${name}`,
  youAbstained: 'Du hast dich enthalten.',
  cannotVote: 'Du darfst nicht abstimmen.',
  votedHeading: 'Abgestimmt',
  waitingHeading: 'Noch offen',
  endVote: 'Abstimmung beenden',

  resultTitle: 'Ergebnis',
  secondResultTitle: 'Zweites Ergebnis',
  votesCount: (count) => `${count} ${count === 1 ? 'Stimme' : 'Stimmen'}`,
  abstainedCount: (count) => `${count} ${count === 1 ? 'Enthaltung' : 'Enthaltungen'}`,
  eliminated: (name) => `${name} muss gehen.`,
  scapegoatDied: (name) => `Gleichstand. Der Sündenbock ${name} muss gehen.`,
  tie: 'Gleichstand. Niemand muss gehen.',
  noVotes: 'Keine Stimmen. Niemand muss gehen.',
  idiotRevealed: (name) =>
    `${name} ist der Dorftrottel. Er bleibt im Spiel, darf aber nicht mehr abstimmen.`,
  alsoDied: 'Außerdem gestorben',
  judgeButton: 'Zweite Abstimmung starten',
  judgeHint: 'Nur du siehst diesen Knopf. Niemand erfährt, wer die zweite Abstimmung startet.',
  continueToNight: 'Weiter zur Nacht',

  winTitles: {
    village: 'Das Dorf gewinnt',
    wolves: 'Die Werwölfe gewinnen',
    lovers: 'Die Verliebten gewinnen',
    angel: 'Der Engel gewinnt',
    piper: 'Der Rattenfänger gewinnt',
    white_werewolf: 'Der Weiße Werwolf gewinnt',
    serial_killer: 'Der Serienmörder gewinnt',
    none: 'Niemand gewinnt',
  },
  winTexts: {
    village: 'Kein Werwolf und kein Mörder lebt mehr.',
    wolves: 'Die Werwölfe haben das Dorf übernommen.',
    lovers: 'Nur noch die beiden Verliebten sind übrig.',
    angel: 'Das Dorf hat den Engel in der ersten Abstimmung rausgewählt. Genau das wollte er.',
    piper: 'Alle, die noch leben, sind verzaubert.',
    white_werewolf: 'Er ist als Letzter übrig.',
    serial_killer: 'Niemand konnte ihn aufhalten.',
    none: 'Am Ende hat niemand überlebt.',
  },
  everyoneHeading: 'Alle Rollen',
  won: 'gewonnen',
  dead: 'tot',
  dealtAs: (role) => `ausgeteilt als ${role}`,
  lovers: (a, b) => `Verliebt: ${a} und ${b}`,
  playAgain: 'Nochmal spielen',
  waitingForNewRound: 'Die Spielleitung kann eine neue Runde starten.',

  quit: 'Beenden',
  quitTitle: 'Spiel verlassen?',
  quitDescription: 'Über den Link kannst du mit deinem Namen wieder einsteigen.',
  keepPlaying: 'Weiterspielen',

  teams: { village: 'Dorf', wolves: 'Werwölfe', solo: 'Einzelgänger' },
  roles: {
    werewolf: {
      name: 'Werwolf',
      plural: 'Werwölfe',
      short: 'Frisst nachts mit dem Rudel ein Opfer.',
      ability:
        'Jede Nacht wählt ihr Werwölfe gemeinsam ein Opfer. Ihr gewinnt, wenn ihr mindestens so viele seid wie der Rest.',
    },
    villager: {
      name: 'Dorfbewohner',
      plural: 'Dorfbewohner',
      short: 'Keine Fähigkeit, nur Verstand.',
      ability:
        'Du hast keine besondere Fähigkeit. Finde mit den anderen die Werwölfe und stimme sie raus.',
    },
    seer: {
      name: 'Seherin',
      plural: 'Seherinnen',
      short: 'Sieht jede Nacht die Rolle einer Person.',
      ability: 'Jede Nacht schaust du dir eine Person an und erfährst ihre Rolle.',
    },
    witch: {
      name: 'Hexe',
      plural: 'Hexen',
      short: 'Hat einen Heiltrank und einen Gifttrank.',
      ability:
        'Du siehst nachts, wen die Werwölfe angegriffen haben. Einmal im Spiel kannst du ein Opfer retten und einmal jemanden vergiften.',
    },
    protector: {
      name: 'Beschützer',
      plural: 'Beschützer',
      short: 'Schützt nachts eine Person vor den Werwölfen.',
      ability:
        'Jede Nacht schützt du eine Person vor den Werwölfen, auch dich selbst. Nur nicht zweimal hintereinander dieselbe.',
    },
    hunter: {
      name: 'Jäger',
      plural: 'Jäger',
      short: 'Nimmt beim Sterben jemanden mit.',
      ability: 'Wenn du stirbst, egal wie, erschießt du sofort eine Person deiner Wahl.',
    },
    cupid: {
      name: 'Amor',
      plural: 'Amor',
      short: 'Verliebt in der ersten Nacht zwei Personen.',
      ability:
        'In der ersten Nacht wählst du zwei Verliebte, gern auch dich. Stirbt eine Person, stirbt die andere vor Kummer.',
    },
    elder: {
      name: 'Ältester',
      plural: 'Älteste',
      short: 'Überlebt den ersten Angriff der Werwölfe.',
      ability:
        'Den ersten Angriff der Werwölfe überlebst du. Gift und Abstimmung töten dich trotzdem sofort.',
    },
    idiot: {
      name: 'Dorftrottel',
      plural: 'Dorftrottel',
      short: 'Überlebt die Abstimmung, verliert aber die Stimme.',
      ability:
        'Wirst du rausgewählt, wird deine Rolle aufgedeckt. Du bleibst im Spiel, darfst aber nicht mehr abstimmen.',
    },
    wild_child: {
      name: 'Wildes Kind',
      plural: 'Wilde Kinder',
      short: 'Wird zum Werwolf, wenn sein Vorbild stirbt.',
      ability: 'In der ersten Nacht wählst du ein Vorbild. Stirbt es, wirst du zum Werwolf.',
    },
    big_bad_wolf: {
      name: 'Großer böser Wolf',
      plural: 'Große böse Wölfe',
      short: 'Reißt ein zweites Opfer, solange kein Wolf tot ist.',
      ability:
        'Du jagst mit dem Rudel. Danach wählst du allein ein zweites Opfer, solange noch niemand aus dem Wolfsteam gestorben ist.',
    },
    wolf_cub: {
      name: 'Wolfsjunges',
      plural: 'Wolfsjunge',
      short: 'Stirbt es, reißen die Wölfe zwei Opfer.',
      ability:
        'Du jagst mit dem Rudel. Stirbst du, wählen die Werwölfe in der nächsten Nacht zwei Opfer.',
    },
    infect_father: {
      name: 'Urwolf',
      plural: 'Urwölfe',
      short: 'Kann einmal ein Opfer zum Werwolf machen.',
      ability:
        'Du jagst mit dem Rudel. Einmal im Spiel kannst du das Opfer infizieren, statt es zu töten. Es überlebt und gehört heimlich zu den Werwölfen.',
    },
    wolf_seer: {
      name: 'Wolfsseher',
      plural: 'Wolfsseher',
      short: 'Sieht nachts eine Rolle, jagt aber nicht mit.',
      ability:
        'Du gehörst zu den Werwölfen, jagst aber nicht mit. Jede Nacht siehst du die genaue Rolle einer Person. Sind alle anderen Wölfe tot, wirst du zum Werwolf.',
    },
    traitor: {
      name: 'Verräter',
      plural: 'Verräter',
      short: 'Kennt die Werwölfe, sie kennen ihn nicht.',
      ability:
        'Du gewinnst mit den Werwölfen, hast aber keine Nachtaktion. Du weißt, wer die Werwölfe sind, sie wissen nichts von dir. Für Seherin, Fuchs und Detektiv gehörst du zum Dorf, und die Werwölfe können dich fressen.',
    },
    fox: {
      name: 'Fuchs',
      plural: 'Füchse',
      short: 'Riecht nachts, ob ein Wolf in der Nähe ist.',
      ability:
        'Jede Nacht wählst du eine Person und erfährst, ob sie oder einer ihrer zwei lebenden Sitznachbarn zu den Werwölfen gehört. Lautet die Antwort nein, verlierst du deine Fähigkeit.',
    },
    bear_tamer: {
      name: 'Bärenführer',
      plural: 'Bärenführer',
      short: 'Sein Bär brummt, wenn ein Wolf neben ihm sitzt.',
      ability:
        'Jeden Morgen erfahren alle, ob dein Bär brummt. Er brummt, wenn einer deiner zwei lebenden Sitznachbarn zu den Werwölfen gehört. Das gilt nur, solange du lebst.',
    },
    knight: {
      name: 'Ritter mit dem rostigen Schwert',
      plural: 'Ritter',
      short: 'Fressen ihn die Wölfe, stirbt einer von ihnen.',
      ability:
        'Fressen dich die Werwölfe, stirbt am Ende der nächsten Nacht der erste lebende Werwolf nach dir in der Sitzreihenfolge.',
    },
    scapegoat: {
      name: 'Sündenbock',
      plural: 'Sündenböcke',
      short: 'Stirbt bei Gleichstand in der Abstimmung.',
      ability: 'Endet eine Abstimmung mit Gleichstand, musst du gehen statt niemand.',
    },
    mayor: {
      name: 'Bürgermeister',
      plural: 'Bürgermeister',
      short: 'Allen bekannt, seine Stimme zählt doppelt.',
      ability:
        'Alle wissen von Anfang an, dass du Bürgermeister bist. Deine Stimme zählt doppelt. Stirbst du, gibt es keinen neuen.',
    },
    detective: {
      name: 'Detektiv',
      plural: 'Detektive',
      short: 'Prüft nachts, ob zwei Personen im selben Team sind.',
      ability:
        'Jede Nacht wählst du zwei andere Personen und erfährst, ob sie im selben Team sind: Dorf, Werwölfe oder Einzelgänger.',
    },
    priest: {
      name: 'Priester',
      plural: 'Priester',
      short: 'Segnet einmal eine Person gegen den Tod in der Nacht.',
      ability:
        'Einmal im Spiel segnest du nachts eine Person, auch dich selbst. Sie überlebt den nächsten Angriff in der Nacht, egal ob von Werwölfen, Serienmörder oder Gift. Der Segen hält, bis er gebraucht wird.',
    },
    sisters: {
      name: 'Schwester',
      plural: 'Schwestern',
      short: 'Zwei Schwestern, die sich kennen.',
      ability:
        'Ihr seid zwei Schwestern und wisst von Anfang an voneinander. Sonst habt ihr keine Fähigkeit.',
    },
    brothers: {
      name: 'Bruder',
      plural: 'Brüder',
      short: 'Drei Brüder, die sich kennen.',
      ability:
        'Ihr seid drei Brüder und wisst von Anfang an voneinander. Sonst habt ihr keine Fähigkeit.',
    },
    cursed: {
      name: 'Verfluchter',
      plural: 'Verfluchte',
      short: 'Wird zum Werwolf, wenn die Wölfe ihn angreifen.',
      ability:
        'Du gehörst zum Dorf, bis die Werwölfe dich angreifen. Dann stirbst du nicht, sondern wirst heimlich selbst zum Werwolf. Für die Seherin bist du bis dahin ein Dorfbewohner.',
    },
    red_riding_hood: {
      name: 'Rotkäppchen',
      plural: 'Rotkäppchen',
      short: 'Für Wölfe unantastbar, solange der Jäger lebt.',
      ability:
        'Solange der Jäger lebt, können dich die Werwölfe nicht töten, auch nicht der Große böse Wolf.',
    },
    wanderer: {
      name: 'Nachtwandlerin',
      plural: 'Nachtwandlerinnen',
      short: 'Schläft jede Nacht bei jemand anderem.',
      ability:
        'Jede Nacht schläfst du bei einer anderen Person. Greifen die Werwölfe dein Zuhause an, bist du nicht da und überlebst. Schläfst du bei einem Werwolf oder bei ihrem Opfer, stirbst du mit.',
    },
    grumpy_grandma: {
      name: 'Grummelige Oma',
      plural: 'Grummelige Omas',
      short: 'Nimmt nachts jemandem die Stimme für den Tag.',
      ability:
        'Jede Nacht wählst du eine Person, die am nächsten Tag nicht abstimmen darf. Nicht dich selbst und nicht zweimal hintereinander dieselbe. Am Morgen erfahren es alle.',
    },
    stuttering_judge: {
      name: 'Stotternder Richter',
      plural: 'Stotternde Richter',
      short: 'Kann einmal eine zweite Abstimmung starten.',
      ability:
        'Einmal im Spiel kannst du nach einem Abstimmungsergebnis sofort eine zweite Abstimmung am selben Tag starten. Niemand erfährt, dass du es warst.',
    },
    apprentice_seer: {
      name: 'Seherlehrling',
      plural: 'Seherlehrlinge',
      short: 'Wird zur Seherin, wenn diese stirbt.',
      ability:
        'Stirbt die Seherin, übernimmst du ihre Rolle und siehst ab der nächsten Nacht selbst Rollen.',
    },
    lycan: {
      name: 'Lykanthrop',
      plural: 'Lykanthropen',
      short: 'Gehört zum Dorf, wirkt aber wie ein Wolf.',
      ability:
        'Du gehörst zum Dorf und hast keine Fähigkeit. Seherin, Wolfsseher, Fuchs, Detektiv und Bärenführer halten dich aber für einen Werwolf.',
    },
    beholder: {
      name: 'Beobachter',
      plural: 'Beobachter',
      short: 'Weiß, wer die Seherin ist.',
      ability: 'Du weißt von Anfang an, wer die Seherin ist und wer der Seherlehrling.',
    },
    white_werewolf: {
      name: 'Weißer Werwolf',
      plural: 'Weiße Werwölfe',
      short: 'Jagt mit dem Rudel, will aber allein übrig bleiben.',
      ability:
        'Die Werwölfe halten dich für einen von ihnen, und du jagst mit. In jeder zweiten Nacht darfst du zusätzlich allein einen Werwolf töten. Du gewinnst nur, wenn du als Letzter übrig bist.',
    },
    serial_killer: {
      name: 'Serienmörder',
      plural: 'Serienmörder',
      short: 'Tötet jede Nacht, Wölfe können ihm nichts.',
      ability:
        'Jede Nacht tötest du eine Person. Die Werwölfe können dich nicht töten. Du gewinnst, wenn du mit höchstens einer anderen Person übrig bist.',
    },
    piper: {
      name: 'Rattenfänger',
      plural: 'Rattenfänger',
      short: 'Verzaubert nachts bis zu zwei Personen.',
      ability:
        'Jede Nacht verzauberst du bis zu zwei Personen. Sie erfahren davon und wissen, wer noch verzaubert ist. Sind alle anderen Lebenden verzaubert, gewinnst du sofort.',
    },
    angel: {
      name: 'Engel',
      plural: 'Engel',
      short: 'Gewinnt, wenn er in der ersten Abstimmung rausfliegt.',
      ability:
        'Wirst du in der allerersten Abstimmung rausgewählt, gewinnst du allein und das Spiel endet sofort. Überstehst du sie, gehörst du ab dann zum Dorf und gewinnst mit ihm.',
    },
  },
  errors: {
    INVALID_CODE: 'Der Code besteht aus 4 Buchstaben.',
    GAME_NOT_FOUND: 'Dieses Spiel gibt es nicht.',
    NOT_JOINED: 'Du bist nicht in diesem Spiel.',
    SERVER_ERROR: 'Etwas ist schiefgelaufen. Versuch es nochmal.',
    NETWORK: 'Keine Verbindung. Versuch es nochmal.',
    INVALID_NAME: 'Gib einen Namen mit höchstens 20 Zeichen ein.',
    NAME_TAKEN: 'Der Name ist schon vergeben.',
    GAME_FULL: 'Das Spiel ist voll.',
    GAME_STARTED: 'Das Spiel läuft schon. Nur wer schon dabei war, kann wieder einsteigen.',
    NOT_HOST: 'Das darf nur die Spielleitung.',
    NOT_LOBBY: 'Das Spiel hat schon begonnen.',
    INVALID_ROLES: 'Diese Rollen gehen nicht.',
    CANNOT_KICK_SELF: 'Du kannst dich nicht selbst entfernen.',
    PLAYER_NOT_FOUND: 'Diese Person ist nicht mehr da.',
    NOT_FINISHED: 'Das Spiel läuft noch.',
    INVALID_ACTION: 'Das geht so nicht.',
    WRONG_PHASE: 'Das geht gerade nicht.',
    NOT_YOUR_TURN: 'Du bist gerade nicht dran.',
    DEAD: 'Du bist schon tot.',
    INVALID_TARGET: 'Diese Person kannst du nicht wählen.',
    REPEAT_PROTECT: 'Dieselbe Person darfst du nicht zweimal hintereinander schützen.',
    POTION_USED: 'Diesen Trank hast du schon benutzt.',
    POWER_USED: 'Diese Fähigkeit hast du schon benutzt.',
    NO_VICTIM: 'Es gibt niemanden zu retten.',
    CANNOT_VOTE: 'Du darfst nicht abstimmen.',
    HUNTER_PENDING: 'Der Jäger muss erst schießen.',
    TOO_EARLY: 'Überspringen geht erst nach einer Minute.',
    NOTHING_TO_SKIP: 'Es gibt nichts zu überspringen.',
    NOT_PLAYING: 'Das Spiel läuft nicht.',
  },
  errorFallback: 'Etwas ist schiefgelaufen. Versuch es nochmal.',
};

const en: Dictionary = {
  title: 'Werewolf',
  subtitle: 'Everyone plays on their own phone. The app narrates, you just have to lie.',
  rules: 'Rules',
  rulesTitle: 'Rules',
  rulesList: [
    'One person creates the game, everyone else joins with the code. You need at least 3 people, it gets really good from 8.',
    'Everyone secretly gets a role. There is the village, the werewolves, and solo roles that only play for themselves. The werewolves know each other.',
    'At night everyone closes their eyes. Whoever is up gets woken by their phone and acts silently.',
    'In the morning you learn who died and see their role. Depending on the roles you also learn whether the bear growls and who cannot vote today.',
    'During the day you discuss and vote on who has to leave the village. The mayor’s vote counts double. On a tie nobody leaves, unless there is a scapegoat.',
    'The village wins when no werewolf, no White Werewolf and no Serial Killer is left alive.',
    'The werewolves win once they are at least as many as everyone else and neither the White Werewolf nor the Serial Killer is alive. The Minion wins with them.',
    'Solo roles win alone, as their role describes. Lovers from different sides win together if they are the last two alive.',
    'Some roles change during the game, for example when the Accursed Wolf-Father infects someone. Your phone tells you under My role.',
    'If you are dead, you watch and keep quiet.',
  ],
  rulesRolesHeading: 'Roles',
  rulesConfirm: 'Got it',
  language: 'Language',
  loading: 'Loading',
  connectionLost: 'No connection. Still trying.',

  createHeading: 'New game',
  createHint: 'You host the game and play along.',
  nameLabel: 'Your name',
  namePlaceholder: 'Name',
  create: 'Create game',
  joinHeading: 'Join',
  joinHint: 'Enter the code you were given.',
  codeLabel: 'Code',
  join: 'Join',

  joinGameTitle: (code) => `Game ${code}`,
  joinGameHint: 'Enter your name to join.',
  rejoinHeading: 'Rejoin',
  rejoinHint: 'Got disconnected? Tap your name.',
  rejoinAs: (name) => `Rejoin as ${name}`,
  gameRunning: 'This game is already running. New people can join in the next round.',
  gameGoneTitle: 'Game not found',
  gameGoneText: 'This game does not exist anymore. Create a new one or check the code.',
  backToStart: 'Back to start',

  codeHeading: 'Code',
  copyLink: 'Copy link',
  linkCopied: 'Link copied',
  shareHint: 'The others join with the code or the link.',
  playersHeading: (count) => `Players (${count})`,
  you: 'you',
  host: 'host',
  offline: 'offline',
  kick: 'Remove',
  kickLabel: (name) => `Remove ${name}`,
  rolesHeading: 'Roles',
  rolesCount: (total, players) => `${total} / ${players} roles`,
  rolesOk: 'All set, you can start.',
  rolesErrors: {
    TOO_FEW_PLAYERS: 'You need at least 3 players.',
    TOO_MANY_PLAYERS: 'At most 20 players.',
    ROLE_COUNT_MISMATCH: 'There has to be exactly one role per player.',
    NO_WOLVES: 'You need at least one Werewolf, Big Bad Wolf, Wolf Cub or Accursed Wolf-Father.',
    TOO_MANY_WOLVES:
      'Werewolves have to be fewer than half the players. The White Werewolf counts, the Minion does not.',
    ROLE_LIMIT: 'This role exists only once.',
    GROUP_SIZE: 'Sisters only come in twos, brothers only in threes.',
    TOO_MANY_SOLOS: 'At most 3 solo roles per game.',
  },
  resetPreset: 'Use suggestion',
  decrease: (role) => `Remove ${role}`,
  increase: (role) => `Add ${role}`,
  waitingForHost: 'Waiting for the host to start.',
  rolesInGame: 'Roles in this game',
  start: 'Start game',

  revealTitle: 'Your role',
  revealHint: 'Hold your phone so nobody can read along.',
  tapToReveal: 'Tap to see your role',
  tapToHide: 'Tap to hide',
  teamLine: (team) => `Team: ${team}`,
  packHeading: 'Your pack',
  traitorWolvesHeading: 'The werewolves',
  siblingsHeading: { sisters: 'Your sister', brothers: 'Your brothers' },
  ready: 'Ready',
  waitingForOthers: 'Waiting for the others',
  waitingFor: (names) => `Waiting for ${names}`,

  myRole: 'My role',
  close: 'Close',
  dealtRole: (role) => `Dealt role: ${role}`,
  transformed: {
    infected:
      'The Accursed Wolf-Father infected you. You are a werewolf now and win with the werewolves.',
    cursed: 'The werewolves attacked you and the curse took hold. You are a werewolf now.',
    apprentice: 'The seer is dead. You are the seer now and see one role every night.',
    wolf_seer: 'All other wolves are dead. You are a werewolf now and hunt every night.',
  },
  loverInfo: (name) => `You are in love with ${name}. If one of you dies, the other dies of grief.`,
  loversMixed: 'You are on different sides. You win together if you are the last two alive.',
  loversSame: 'You are on the same team and win with your team.',
  wildChildModel: (name) => `Your role model: ${name}`,
  wildChildConverted: 'Your role model is dead. You are a werewolf now.',
  seerResultsHeading: 'What you have seen',
  seerResultLine: (name, role) => `${name}: ${role}`,
  foxLine: (name, wolf) => `${name}: ${wolf ? 'a werewolf nearby' : 'no werewolf nearby'}`,
  foxPowerLost: 'You lost your power.',
  detectiveLine: (a, b, same) => `${a} and ${b}: ${same ? 'same team' : 'different teams'}`,
  nightLabel: (round) => `Night ${round}`,
  healLeft: 'Healing potion left',
  healUsed: 'Healing potion used',
  poisonLeft: 'Poison left',
  poisonUsed: 'Poison used',
  protectorLast: (name) => `Protected last night: ${name}`,
  priestAvailable: 'Your blessing is still unused.',
  priestBlessed: (name) => `${name} is blessed.`,
  priestSpent: 'Your blessing is used up.',
  infectLeft: 'You can infect once per game.',
  infectUsed: 'You already infected someone.',
  judgeLeft: 'Once per game, after a vote result, you can start a second vote.',
  judgeUsed: 'You already started the second vote.',
  charmedSelf: 'The Piper has charmed you.',
  charmedHeading: 'Charmed',
  charmedNone: 'Nobody is charmed yet.',
  beholderSeer: (name) => `The seer is ${name}.`,
  beholderApprentice: (name) => `The apprentice seer is ${name}.`,
  beholderNoSeer: 'There is no seer in this game.',

  nightTitle: 'Night',
  nightText: 'Close your eyes. Your phone wakes you when it is your turn.',
  youAreOut: 'You are out. Watch, but do not give anything away.',
  skipText: 'Someone is taking very long.',
  skipButton: 'Skip turn',

  cupidTitle: 'Cupid',
  cupidText: 'Pick two people who fall in love. You may pick yourself.',
  wildChildTitle: 'Wild Child',
  wildChildText: 'Pick your role model. If they die, you become a werewolf.',
  wandererTitle: 'Night Wanderer',
  wandererText:
    'Whose home do you sleep at tonight? If it is a werewolf or their victim, you die too.',
  protectorTitle: 'Protector',
  protectorText: 'Who do you protect from the werewolves tonight?',
  protectorLastNote: (name) => `You protected ${name} last night.`,
  priestTitle: 'Priest',
  priestText: 'Do you want to bless someone tonight? You only have one blessing all game.',
  priestPass: 'Not tonight',
  seerTitle: 'Seer',
  seerText: 'Whose role do you want to see?',
  wolfSeerTitle: 'Wolf Seer',
  wolfSeerText: 'Whose role do you want to see?',
  foxTitle: 'Fox',
  foxText: 'Pick a person. You learn whether they or one of their two neighbours is a werewolf.',
  detectiveTitle: 'Detective',
  detectiveText: 'Pick two people. You learn whether they are on the same team.',
  wolvesTitle: 'Werewolves',
  wolvesText: 'Agree on a victim. Everyone has to pick the same person.',
  wolvesTwoKills: 'The Wolf Cub is dead. Tonight you take two victims, one after the other.',
  wolvesSecond: (name) => `First victim: ${name}. Now agree on the second.`,
  pickedBy: (names) => `Picked by ${names}`,
  infectTitle: 'Accursed Wolf-Father',
  infectText:
    'Do you want to infect the victim instead of killing them? They survive and secretly become a werewolf. You can do this once per game.',
  infectPass: 'Do not infect',
  bigBadWolfTitle: 'Big Bad Wolf',
  bigBadWolfText: 'Pick a second victim on your own.',
  whiteWolfTitle: 'White Werewolf',
  whiteWolfText: 'Tonight you may kill one werewolf on your own.',
  whiteWolfPass: 'Kill nobody',
  serialKillerTitle: 'Serial Killer',
  serialKillerText: 'Who do you kill tonight?',
  witchTitle: 'Witch',
  witchVictims: (names) => `The werewolves attacked ${names}.`,
  witchNoVictim: 'Nobody was attacked tonight.',
  witchHealHeading: 'Healing potion',
  witchHealHint: 'Tap a victim to save them, or leave it.',
  witchHeal: (name) => `Save ${name}`,
  witchPoisonHeading: 'Poison',
  witchPoisonHint: 'Tap someone to poison them, or leave it.',
  witchDone: 'Done',
  grandmaTitle: 'Grumpy Grandma',
  grandmaText: 'Who is not allowed to vote tomorrow?',
  grandmaLastNote: (name) => `You picked ${name} last night.`,
  piperTitle: 'Piper',
  piperText: (max) =>
    max > 1
      ? 'Who do you charm tonight? You can pick up to two people.'
      : 'Who do you charm tonight?',
  hunterTitle: 'Hunter',
  hunterText: 'You died. Who do you take with you?',
  shoot: 'Shoot',
  confirm: 'Confirm',
  seerResultTitle: 'Your vision',
  seerResultText: (name) => `${name} is`,
  foxResultTitle: 'Your nose',
  foxQuestion: (name) => `Is there a werewolf at ${name} or next to them?`,
  detectiveResultTitle: 'Your investigation',
  detectiveQuestion: (a, b) => `Are ${a} and ${b} on the same team?`,
  yes: 'Yes',
  no: 'No',
  understood: 'Got it',

  dayTitle: 'Day',
  morningHeading: 'Last night',
  noDeaths: 'Nobody died last night.',
  causes: {
    love: 'died of grief',
    hunter: 'shot by the hunter',
    rust: 'died from the rusty sword',
    serial_killer: 'killed by the serial killer',
  },
  bearGrowls: 'The bear growls.',
  bearQuiet: 'The bear stays quiet.',
  silencedToday: (name) => `${name} cannot vote today.`,
  cannotVoteToday: 'cannot vote today',
  hunterChoosing: (name) => `${name} was the hunter and is choosing who to take along.`,
  discussText: 'Discuss who might be a werewolf.',
  aliveHeading: (count) => `Alive (${count})`,
  deadHeading: 'Dead',
  cannotVoteNote: 'cannot vote',
  startVote: 'Start vote',

  voteTitle: 'Vote',
  secondVoteTitle: 'Second vote',
  voteText: 'Who should leave the village?',
  secondVoteText: 'There is another vote right away. Who should leave the village?',
  voteDouble: 'Your vote counts double.',
  abstain: 'Abstain',
  castVote: 'Vote',
  yourVote: (name) => `Your vote: ${name}`,
  youAbstained: 'You abstained.',
  cannotVote: 'You cannot vote.',
  votedHeading: 'Voted',
  waitingHeading: 'Waiting',
  endVote: 'End vote',

  resultTitle: 'Result',
  secondResultTitle: 'Second result',
  votesCount: (count) => `${count} ${count === 1 ? 'vote' : 'votes'}`,
  abstainedCount: (count) => `${count} ${count === 1 ? 'abstention' : 'abstentions'}`,
  eliminated: (name) => `${name} has to leave.`,
  scapegoatDied: (name) => `A tie. The scapegoat ${name} has to leave.`,
  tie: 'A tie. Nobody has to leave.',
  noVotes: 'No votes. Nobody has to leave.',
  idiotRevealed: (name) =>
    `${name} is the Village Idiot. They stay in the game but can no longer vote.`,
  alsoDied: 'Also died',
  judgeButton: 'Start a second vote',
  judgeHint: 'Only you see this button. Nobody learns who starts the second vote.',
  continueToNight: 'Continue to night',

  winTitles: {
    village: 'The village wins',
    wolves: 'The werewolves win',
    lovers: 'The lovers win',
    angel: 'The Angel wins',
    piper: 'The Piper wins',
    white_werewolf: 'The White Werewolf wins',
    serial_killer: 'The Serial Killer wins',
    none: 'Nobody wins',
  },
  winTexts: {
    village: 'No werewolf and no killer is left alive.',
    wolves: 'The werewolves have taken over the village.',
    lovers: 'Only the two lovers are left.',
    angel: 'The village voted the Angel out in the very first vote. Exactly what he wanted.',
    piper: 'Everyone still alive is charmed.',
    white_werewolf: 'He is the last one standing.',
    serial_killer: 'Nobody could stop him.',
    none: 'In the end nobody survived.',
  },
  everyoneHeading: 'All roles',
  won: 'won',
  dead: 'dead',
  dealtAs: (role) => `dealt as ${role}`,
  lovers: (a, b) => `In love: ${a} and ${b}`,
  playAgain: 'Play again',
  waitingForNewRound: 'The host can start a new round.',

  quit: 'Quit',
  quitTitle: 'Leave the game?',
  quitDescription: 'You can rejoin with your name using the link.',
  keepPlaying: 'Keep playing',

  teams: { village: 'Village', wolves: 'Werewolves', solo: 'Solo' },
  roles: {
    werewolf: {
      name: 'Werewolf',
      plural: 'Werewolves',
      short: 'Eats a victim with the pack at night.',
      ability:
        'Every night you werewolves pick a victim together. You win once you are at least as many as everyone else.',
    },
    villager: {
      name: 'Villager',
      plural: 'Villagers',
      short: 'No power, just your wits.',
      ability: 'You have no special power. Find the werewolves with the others and vote them out.',
    },
    seer: {
      name: 'Seer',
      plural: 'Seers',
      short: 'Sees one person’s role each night.',
      ability: 'Every night you look at one person and learn their role.',
    },
    witch: {
      name: 'Witch',
      plural: 'Witches',
      short: 'Has one healing potion and one poison.',
      ability:
        'At night you see who the werewolves attacked. Once per game you can save a victim, and once you can poison someone.',
    },
    protector: {
      name: 'Protector',
      plural: 'Protectors',
      short: 'Protects one person from the werewolves at night.',
      ability:
        'Every night you protect one person from the werewolves, yourself included. Just not the same person twice in a row.',
    },
    hunter: {
      name: 'Hunter',
      plural: 'Hunters',
      short: 'Takes someone along when dying.',
      ability: 'When you die, however it happens, you instantly shoot a person of your choice.',
    },
    cupid: {
      name: 'Cupid',
      plural: 'Cupids',
      short: 'Makes two people fall in love on the first night.',
      ability:
        'On the first night you pick two lovers, yourself included if you like. If one dies, the other dies of grief.',
    },
    elder: {
      name: 'Elder',
      plural: 'Elders',
      short: 'Survives the first werewolf attack.',
      ability:
        'You survive the first werewolf attack. Poison and the vote still kill you right away.',
    },
    idiot: {
      name: 'Village Idiot',
      plural: 'Village Idiots',
      short: 'Survives the vote but loses their vote.',
      ability:
        'If you are voted out, your role is revealed. You stay in the game but can no longer vote.',
    },
    wild_child: {
      name: 'Wild Child',
      plural: 'Wild Children',
      short: 'Becomes a werewolf if their role model dies.',
      ability: 'On the first night you pick a role model. If they die, you become a werewolf.',
    },
    big_bad_wolf: {
      name: 'Big Bad Wolf',
      plural: 'Big Bad Wolves',
      short: 'Takes a second victim while no wolf has died.',
      ability:
        'You hunt with the pack. Afterwards you pick a second victim on your own, as long as nobody from the wolf team has died yet.',
    },
    wolf_cub: {
      name: 'Wolf Cub',
      plural: 'Wolf Cubs',
      short: 'If it dies, the wolves take two victims.',
      ability:
        'You hunt with the pack. If you die, the werewolves pick two victims the next night.',
    },
    infect_father: {
      name: 'Accursed Wolf-Father',
      plural: 'Accursed Wolf-Fathers',
      short: 'Can turn one victim into a werewolf.',
      ability:
        'You hunt with the pack. Once per game you can infect the victim instead of killing them. They survive and secretly join the werewolves.',
    },
    wolf_seer: {
      name: 'Wolf Seer',
      plural: 'Wolf Seers',
      short: 'Sees one role each night but does not hunt.',
      ability:
        'You are on the werewolf team but do not hunt. Every night you see one person’s exact role. Once all other wolves are dead, you become a werewolf.',
    },
    traitor: {
      name: 'Minion',
      plural: 'Minions',
      short: 'Knows the werewolves, they do not know him.',
      ability:
        'You win with the werewolves but have no night action. You know who the werewolves are, they do not know you. The seer, fox and detective see you as village, and the werewolves can eat you.',
    },
    fox: {
      name: 'Fox',
      plural: 'Foxes',
      short: 'Sniffs out at night whether a wolf is nearby.',
      ability:
        'Every night you pick a person and learn whether they or one of their two living neighbours is on the werewolf team. If the answer is no, you lose your power.',
    },
    bear_tamer: {
      name: 'Bear Tamer',
      plural: 'Bear Tamers',
      short: 'His bear growls when a wolf sits next to him.',
      ability:
        'Every morning everyone learns whether your bear growls. It growls when one of your two living neighbours is on the werewolf team. This only works while you are alive.',
    },
    knight: {
      name: 'Rusty Knight',
      plural: 'Rusty Knights',
      short: 'If the wolves eat him, one of them dies.',
      ability:
        'If the werewolves eat you, the first living werewolf after you in seat order dies at the end of the next night.',
    },
    scapegoat: {
      name: 'Scapegoat',
      plural: 'Scapegoats',
      short: 'Dies when a vote ends in a tie.',
      ability: 'If a vote ends in a tie, you have to leave instead of nobody.',
    },
    mayor: {
      name: 'Mayor',
      plural: 'Mayors',
      short: 'Known to all, his vote counts double.',
      ability:
        'Everyone knows from the start that you are the mayor. Your vote counts double. If you die, nobody takes over.',
    },
    detective: {
      name: 'Detective',
      plural: 'Detectives',
      short: 'Checks at night whether two people are on the same team.',
      ability:
        'Every night you pick two other people and learn whether they are on the same team: village, werewolves or solo.',
    },
    priest: {
      name: 'Priest',
      plural: 'Priests',
      short: 'Blesses one person against death at night, once.',
      ability:
        'Once per game you bless a person at night, yourself included. They survive the next attack at night, whether from werewolves, the serial killer or poison. The blessing lasts until it is needed.',
    },
    sisters: {
      name: 'Sister',
      plural: 'Sisters',
      short: 'Two sisters who know each other.',
      ability:
        'You are two sisters and know each other from the start. Apart from that you have no power.',
    },
    brothers: {
      name: 'Brother',
      plural: 'Brothers',
      short: 'Three brothers who know each other.',
      ability:
        'You are three brothers and know each other from the start. Apart from that you have no power.',
    },
    cursed: {
      name: 'Cursed',
      plural: 'Cursed',
      short: 'Becomes a werewolf when the wolves attack him.',
      ability:
        'You are on the village team until the werewolves attack you. Then you do not die but secretly become a werewolf yourself. Until then the seer sees you as a villager.',
    },
    red_riding_hood: {
      name: 'Red Riding Hood',
      plural: 'Red Riding Hoods',
      short: 'Safe from the wolves while the hunter lives.',
      ability:
        'As long as the hunter is alive, the werewolves cannot kill you, not even the Big Bad Wolf.',
    },
    wanderer: {
      name: 'Night Wanderer',
      plural: 'Night Wanderers',
      short: 'Sleeps at someone else’s home every night.',
      ability:
        'Every night you sleep at another person’s home. If the werewolves attack your home, you are not there and survive. If you sleep at a werewolf’s home or at their victim’s, you die too.',
    },
    grumpy_grandma: {
      name: 'Grumpy Grandma',
      plural: 'Grumpy Grandmas',
      short: 'Takes away someone’s vote for the next day.',
      ability:
        'Every night you pick a person who cannot vote the next day. Not yourself and not the same person twice in a row. Everyone learns it in the morning.',
    },
    stuttering_judge: {
      name: 'Stuttering Judge',
      plural: 'Stuttering Judges',
      short: 'Can start a second vote once.',
      ability:
        'Once per game, after a vote result, you can start a second vote on the same day right away. Nobody learns it was you.',
    },
    apprentice_seer: {
      name: 'Apprentice Seer',
      plural: 'Apprentice Seers',
      short: 'Becomes the seer when the seer dies.',
      ability: 'When the seer dies, you take over and see roles yourself from the next night on.',
    },
    lycan: {
      name: 'Lycan',
      plural: 'Lycans',
      short: 'On the village team, but looks like a wolf.',
      ability:
        'You are on the village team and have no power. But the seer, wolf seer, fox, detective and bear tamer take you for a werewolf.',
    },
    beholder: {
      name: 'Beholder',
      plural: 'Beholders',
      short: 'Knows who the seer is.',
      ability: 'You know from the start who the seer is, and who the apprentice seer is.',
    },
    white_werewolf: {
      name: 'White Werewolf',
      plural: 'White Werewolves',
      short: 'Hunts with the pack but wants to be the last one left.',
      ability:
        'The werewolves think you are one of them, and you hunt with them. Every second night you may also kill one werewolf on your own. You only win if you are the last one alive.',
    },
    serial_killer: {
      name: 'Serial Killer',
      plural: 'Serial Killers',
      short: 'Kills every night, the wolves cannot touch him.',
      ability:
        'Every night you kill one person. The werewolves cannot kill you. You win when at most one other person is left alive with you.',
    },
    piper: {
      name: 'Piper',
      plural: 'Pipers',
      short: 'Charms up to two people every night.',
      ability:
        'Every night you charm up to two people. They learn about it and know who else is charmed. Once everyone else alive is charmed, you win right away.',
    },
    angel: {
      name: 'Angel',
      plural: 'Angels',
      short: 'Wins if voted out in the first vote.',
      ability:
        'If you are voted out in the very first vote, you win alone and the game ends right away. If you survive it, you join the village and win with them.',
    },
  },
  errors: {
    INVALID_CODE: 'The code is 4 letters.',
    GAME_NOT_FOUND: 'This game does not exist.',
    NOT_JOINED: 'You are not in this game.',
    SERVER_ERROR: 'Something went wrong. Try again.',
    NETWORK: 'No connection. Try again.',
    INVALID_NAME: 'Enter a name with at most 20 characters.',
    NAME_TAKEN: 'That name is taken.',
    GAME_FULL: 'This game is full.',
    GAME_STARTED: 'This game is already running. Only people who were in it can rejoin.',
    NOT_HOST: 'Only the host can do that.',
    NOT_LOBBY: 'The game has already started.',
    INVALID_ROLES: 'These roles do not work.',
    CANNOT_KICK_SELF: 'You cannot remove yourself.',
    PLAYER_NOT_FOUND: 'That person is gone.',
    NOT_FINISHED: 'The game is still running.',
    INVALID_ACTION: 'That does not work.',
    WRONG_PHASE: 'That is not possible right now.',
    NOT_YOUR_TURN: 'It is not your turn.',
    DEAD: 'You are already dead.',
    INVALID_TARGET: 'You cannot pick that person.',
    REPEAT_PROTECT: 'You cannot protect the same person twice in a row.',
    POTION_USED: 'You already used that potion.',
    POWER_USED: 'You already used that power.',
    NO_VICTIM: 'There is nobody to save.',
    CANNOT_VOTE: 'You cannot vote.',
    HUNTER_PENDING: 'The hunter has to shoot first.',
    TOO_EARLY: 'Skipping is possible after one minute.',
    NOTHING_TO_SKIP: 'There is nothing to skip.',
    NOT_PLAYING: 'The game is not running.',
  },
  errorFallback: 'Something went wrong. Try again.',
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };

export function errorMessage(t: Dictionary, code: string) {
  return t.errors[code] ?? t.rolesErrors[code as RolesError] ?? t.errorFallback;
}
