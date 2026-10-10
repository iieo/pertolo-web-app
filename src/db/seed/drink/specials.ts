import type { DefaultTask } from '@/types/task';

export type SpecialTask = {
  category: 'Normal' | 'Party' | 'Duell' | 'Wahrheit' | 'Chaos' | 'Wild' | 'Sexual';
  task: DefaultTask;
};

type Category = SpecialTask['category'];
type Kind = NonNullable<DefaultTask['kind']>;
type Extra = Pick<DefaultTask, 'rounds' | 'seconds' | 'endContent' | 'endContentEn'>;

const card =
  (category: Category) =>
  (kind: Kind, content: string, contentEn: string, extra: Extra = {}): SpecialTask => ({
    category,
    task: { type: 'default', kind, content, contentEn, ...extra },
  });

const normal = card('Normal');
const party = card('Party');
const duell = card('Duell');
const wahrheit = card('Wahrheit');
const chaos = card('Chaos');
const wild = card('Wild');
const sexual = card('Sexual');

const normalSpecials: SpecialTask[] = [
  normal(
    'timer',
    "{{player}}, nenne so viele Obstsorten wie möglich. Pro Sorte verteilst du 1 Schluck.",
    "{{player}}, name as many fruits as you can. Hand out 1 sip for each one.",
    { seconds: 20 },
  ),
  normal(
    'timer',
    "{{player}}, zähl so viele Länder auf, die mit B beginnen, wie du schaffst. Sind es weniger als 5, trinkst du {{sips}} Schlucke.",
    "{{player}}, list as many countries starting with B as you can. Fewer than 5 and you drink {{sips}} sips.",
    { seconds: 30 },
  ),
  normal(
    'timer',
    "{{player}}, zeig auf 5 rote Dinge im Raum. Schaffst du es, verteilst du 3 Schlucke, sonst trinkst du 2.",
    "{{player}}, point at 5 red things in the room. Make it and you hand out 3 sips, otherwise you drink 2.",
    { seconds: 15 },
  ),
  normal(
    'timer',
    "{{player}}, erklär {{player}} ein Wort deiner Wahl, ohne es zu sagen. Wird es erraten, verteilt ihr beide 2 Schlucke, sonst trinkt ihr beide 2.",
    "{{player}}, describe a word of your choice to {{player}} without saying it. If they get it, you both hand out 2 sips. If not, you both drink 2.",
    { seconds: 30 },
  ),
  normal(
    'timer',
    "Reihum nennt jeder ein Tier, das im Wasser lebt, bis die Zeit abläuft. Wer zögert oder eins wiederholt, trinkt {{sips}} Schlucke.",
    "Go around the circle naming animals that live in water until time runs out. Anyone who hesitates or repeats one drinks {{sips}} sips.",
    { seconds: 25 },
  ),
  normal(
    'timer',
    "{{player}}, sag das Alphabet rückwärts von Z bis M auf. Schaffst du es, verteilst du 3 Schlucke, sonst trinkst du 3.",
    "{{player}}, say the alphabet backwards from Z to M. Make it and you hand out 3 sips, otherwise you drink 3.",
    { seconds: 10 },
  ),
  normal(
    'timer',
    "{{player}}, stell dich auf ein Bein und bleib so, bis die Zeit abläuft. Setzt du den Fuß ab, trinkst du 2 Schlucke.",
    "{{player}}, stand on one leg until time runs out. If your foot touches the floor, drink 2 sips.",
    { seconds: 30 },
  ),
  normal(
    'timer',
    "{{player}}, nenne so viele Dinge, die man in einer Küche findet, wie du kannst. Pro Sache verteilst du 1 Schluck, höchstens 6.",
    "{{player}}, name as many things you'd find in a kitchen as you can. Hand out 1 sip per item, up to 6.",
    { seconds: 25 },
  ),
  normal(
    'roulette',
    "Das Roulette hat entschieden: {{player}} ist Schiedsrichter und darf 4 Schlucke beliebig aufteilen.",
    "The wheel has spoken: {{player}} is the referee and gets to split 4 sips however they like.",
  ),
  normal(
    'roulette',
    "Das Roulette hat {{player}} gewählt. Diese Person trinkt {{sips}} Schlucke und sucht sich jemanden aus, der mittrinkt.",
    "The wheel picked {{player}}. They drink {{sips}} sips and choose someone to drink along.",
  ),
  normal(
    'roulette',
    "{{player}} wurde ausgelost: Diese Person trinkt 1 Schluck und verteilt danach 3.",
    "{{player}} got picked: drink 1 sip, then hand out 3.",
  ),
  normal(
    'roulette',
    "Glückstreffer für {{player}}: Diese Person bekommt einen Joker und darf damit einmal im Spiel eine Aufgabe ablehnen, ohne zu trinken.",
    "Lucky break for {{player}}: they get a joker and can use it once this game to skip a task without drinking.",
  ),
  normal(
    'roulette',
    "Das Roulette zeigt auf {{player}}: Diese Person denkt sich einen Namen für die Runde heute Abend aus. Gefällt er allen, verteilt sie 3 Schlucke, sonst trinkt sie 2.",
    "The wheel lands on {{player}}: come up with a name for tonight's crew. If everyone likes it, hand out 3 sips. If not, drink 2.",
  ),
  normal(
    'double',
    "{{player}}, Doppelt oder nichts: {{player}} versteckt einen kleinen Gegenstand in einer Hand. Rätst du die richtige, verteilst du 4 Schlucke, sonst trinkst du 4.",
    "{{player}}, double or nothing: {{player}} hides a small object in one hand. Guess the right hand and you hand out 4 sips, otherwise you drink 4.",
  ),
  normal(
    'double',
    "{{player}}, Doppelt oder nichts: Lass {{player}} eine Münze werfen und sag vorher Kopf oder Zahl an. Liegst du richtig, verteilst du 4 Schlucke, sonst trinkst du 4.",
    "{{player}}, double or nothing: have {{player}} flip a coin and call heads or tails first. Call it right and you hand out 4 sips, otherwise you drink 4.",
  ),
  normal(
    'double',
    "{{player}}, Doppelt oder nichts: Schätz, wie viele Apps auf deinem Startbildschirm sind, dann zählt {{player}} nach. Liegst du höchstens 2 daneben, verteilst du 6 Schlucke, sonst trinkst du 3.",
    "{{player}}, double or nothing: guess how many apps are on your home screen, then {{player}} counts. Within 2 and you hand out 6 sips, otherwise you drink 3.",
  ),
  normal(
    'double',
    "{{player}}, Doppelt oder nichts: Errate mit einem Versuch die Lieblingsfarbe von {{player}}. Richtig, verteilst du {{sips}} Schlucke. Falsch, trinkst du {{sips}}.",
    "{{player}}, double or nothing: guess {{player}}'s favorite color in one try. Get it right and you hand out {{sips}} sips. Get it wrong and you drink {{sips}}.",
  ),
  normal(
    'rule',
    "Niemand darf das Wort \"trinken\" sagen. Wer es tut, trinkt 1 Schluck.",
    "Nobody may say the word \"drink\". Whoever does, takes 1 sip.",
    {
      rounds: 5,
      endContent: "Das Wort \"trinken\" ist wieder erlaubt.",
      endContentEn: "You can say \"drink\" again.",
    },
  ),
  normal(
    'rule',
    "Niemand darf mit Namen angesprochen werden. Wer einen Namen sagt, trinkt 1 Schluck.",
    "Nobody may be called by their name. Say a name and you drink 1 sip.",
    {
      rounds: 6,
      endContent: "Namen sind wieder erlaubt.",
      endContentEn: "Names are allowed again.",
    },
  ),
  normal(
    'rule',
    "Gläser werden nur noch mit beiden Händen gehalten. Wer sein Glas mit einer Hand nimmt, trinkt 1 Schluck.",
    "Glasses may only be held with both hands. Grab yours with one hand and you drink 1 sip.",
    {
      rounds: 5,
      endContent: "Die Zwei-Hände-Regel ist vorbei.",
      endContentEn: "The two-hands rule is over.",
    },
  ),
  normal(
    'rule',
    "Wer lacht, muss danach kurz salutieren. Wer es vergisst, trinkt 1 Schluck.",
    "Whoever laughs has to salute right after. Forget and you drink 1 sip.",
    {
      rounds: 4,
      endContent: "Ihr dürft wieder lachen, ohne zu salutieren.",
      endContentEn: "You can laugh without saluting again.",
    },
  ),
  normal(
    'curse',
    "{{player}} muss jeden Satz mit \"oder?\" beenden. Jedes vergessene \"oder?\" kostet 1 Schluck.",
    "{{player}} has to end every sentence with \"right?\". Every missed \"right?\" costs 1 sip.",
    {
      rounds: 4,
      endContent: "Der Oder-Fluch ist gebrochen.",
      endContentEn: "The \"right?\" curse is broken.",
    },
  ),
  normal(
    'curse',
    "{{player}} muss jeden Satz mit \"Mit Verlaub\" beginnen. Jedes Vergessen kostet 1 Schluck.",
    "{{player}} has to start every sentence with \"If I may\". Every slip costs 1 sip.",
    {
      rounds: 5,
      endContent: "Mit Verlaub, der Fluch ist vorbei.",
      endContentEn: "If I may: the curse is over.",
    },
  ),
  normal(
    'curse',
    "{{player}} darf Fragen nicht beantworten, sondern nur mit einer Gegenfrage reagieren. Jede normale Antwort kostet 2 Schlucke.",
    "{{player}} can't answer questions, only reply with another question. Every normal answer costs 2 sips.",
    {
      rounds: 3,
      endContent: "Der Gegenfragen-Fluch ist vorbei.",
      endContentEn: "The counter-question curse is over.",
    },
  ),
  normal(
    'versus',
    "{{player}} gegen {{player}}: Nennt abwechselnd Dinge aus dem Supermarkt, in alphabetischer Reihenfolge. Wer hängt, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Take turns naming things from the supermarket in alphabetical order. Whoever gets stuck drinks {{sips}} sips.",
  ),
  normal(
    'versus',
    "{{player}} gegen {{player}}: Schätzt die genaue Uhrzeit, ohne auf eine Uhr zu sehen. Wer weiter danebenliegt, trinkt 2 Schlucke.",
    "{{player}} vs. {{player}}: Guess the exact time without looking at a clock. Whoever is further off drinks 2 sips.",
  ),
  normal(
    'versus',
    "{{player}} gegen {{player}}: Nennt abwechselnd US-Bundesstaaten. Wer zuerst passt, trinkt 3 Schlucke.",
    "{{player}} vs. {{player}}: Take turns naming US states. Whoever passes first drinks 3 sips.",
  ),
  normal(
    'vote',
    "Wer würde am ehesten beim Einkaufen genau das vergessen, wofür die Person eigentlich losgegangen ist? Auf drei zeigen alle. Wer die meisten Stimmen hat, trinkt 2 Schlucke.",
    "Who is most likely to come home from the store without the one thing they went for? Everyone points on three. Most votes drinks 2 sips.",
  ),
  normal(
    'vote',
    "Wer hat den besten Musikgeschmack in der Runde? Auf drei zeigen alle. Wer gewählt wird, verteilt {{sips}} Schlucke.",
    "Who has the best taste in music here? Everyone points on three. Whoever gets picked hands out {{sips}} sips.",
  ),
  normal(
    'vote',
    "Lieber nie wieder Käse oder nie wieder Schokolade? Auf drei sagen alle ihre Wahl. Die Minderheit trinkt 2 Schlucke.",
    "Never eat cheese again or never eat chocolate again? Everyone answers on three. The minority drinks 2 sips.",
  ),
  normal(
    'vote',
    "Wer würde in einer Quizshow am weitesten kommen? Auf drei zeigen alle. Wer gewählt wird, verteilt {{sips}} Schlucke.",
    "Who would go furthest on a quiz show? Everyone points on three. Whoever gets picked hands out {{sips}} sips.",
  ),
  normal(
    'never',
    "eine Pflanze sterben lassen, obwohl ich sie gegossen habe. Wer schon, trinkt 1 Schluck.",
    "killed a plant even though I watered it. If you have, drink 1 sip.",
  ),
  normal(
    'never',
    "im falschen Zug gesessen und es erst nach ein paar Stationen gemerkt. Wer schon, trinkt {{sips}} Schlucke.",
    "sat on the wrong train and only noticed a few stops later. If you have, drink {{sips}} sips.",
  ),
  normal(
    'never',
    "eine Treppe hochgerannt, weil hinter mir das Licht ausging. Wer schon, trinkt {{sips}} Schlucke.",
    "run up the stairs because the lights went off behind me. If you have, drink {{sips}} sips.",
  ),
  normal(
    'group',
    "Alle, die heute zwei verschiedene Socken tragen, trinken {{sips}} Schlucke.",
    "Everyone wearing mismatched socks today drinks {{sips}} sips.",
  ),
  normal(
    'group',
    "Alle, deren Handyakku gerade unter 20 Prozent ist, trinken 2 Schlucke.",
    "Everyone whose phone battery is below 20 percent right now drinks 2 sips.",
  ),
  normal(
    'group',
    "Alle, die schon mal bei einem Film eingeschlafen sind, den sie selbst ausgesucht haben, trinken {{sips}} Schlucke.",
    "Everyone who has fallen asleep during a movie they picked themselves drinks {{sips}} sips.",
  ),
  normal(
    'question',
    "{{player}}, welches Essen könntest du jeden Tag essen, ohne dass es dir langweilig wird? Antworte oder trink 1 Schluck.",
    "{{player}}, what food could you eat every single day without getting bored? Answer or drink 1 sip.",
  ),
  normal(
    'question',
    "{{player}}, welcher Song ist dein heimlicher Lieblingssong, den du sonst niemandem zeigst? Antworte ehrlich oder trink {{sips}} Schlucke.",
    "{{player}}, what's your secret favorite song that you never admit to? Answer honestly or drink {{sips}} sips.",
  ),
  normal(
    'category',
    "Dinge, die man in einer Bäckerei kaufen kann. {{player}} beginnt, dann geht es reihum. Wer zögert oder etwas wiederholt, trinkt 2 Schlucke.",
    "Things you can buy at a bakery. {{player}} starts, then go around the circle. Anyone who hesitates or repeats drinks 2 sips.",
  ),
];

const partySpecials: SpecialTask[] = [
  party(
    'timer',
    "{{player}} gibt einen Song vor und alle summen ihn gemeinsam, bis die Zeit abläuft. Wer zuerst lacht oder aufhört, trinkt {{sips}} Schlucke.",
    "{{player}} picks a song and everyone hums it together until time runs out. First to laugh or stop drinks {{sips}} sips.",
    { seconds: 30 },
  ),
  party(
    'timer',
    "Tanzpause! Alle stehen auf und tanzen, bis die Zeit abläuft. Wer sich zuerst hinsetzt, trinkt 3 Schlucke.",
    "Dance break! Everyone gets up and dances until time runs out. First to sit down drinks 3 sips.",
    { seconds: 45 },
  ),
  party(
    'timer',
    "Reihum ruft jeder so schnell wie möglich einen Grund, heute anzustoßen. Wem nichts einfällt, trinkt 2 Schlucke. Wenn die Zeit um ist, stoßen alle an.",
    "Go around and shout out a reason to toast tonight, as fast as you can. Draw a blank and drink 2 sips. When time is up, everyone clinks glasses.",
    { seconds: 20 },
  ),
  party(
    'timer',
    "Zählt gemeinsam laut von 1 aufwärts, immer nur eine Person auf einmal und ohne Absprache. Sagen zwei gleichzeitig eine Zahl, beginnt ihr von vorn. Schafft ihr 15, verteilt jeder 2 Schlucke, sonst trinken alle 2.",
    "Count up from 1 out loud as a group, one person at a time, no planning. If two people speak at once, start over. Reach 15 and everyone hands out 2 sips, otherwise everyone drinks 2.",
    { seconds: 30 },
  ),
  party(
    'timer',
    "Die ganze Runde spielt pantomimisch eine Band auf der Bühne, bis die Zeit abläuft. Wer zuerst aus der Rolle fällt, trinkt {{sips}} Schlucke.",
    "The whole group air-plays a band on stage until time runs out. First to break character drinks {{sips}} sips.",
    { seconds: 60 },
  ),
  party(
    'timer',
    "{{player}}, nenne so viele Songs wie möglich, in deren Titel das Wort Liebe vorkommt. Für jeden verteilst du 1 Schluck.",
    "{{player}}, name as many songs as you can with the word love in the title. Hand out 1 sip for each one.",
    { seconds: 20 },
  ),
  party(
    'timer',
    "Reihum beschreibt jeder den bisherigen Abend in einem einzigen Wort, immer schneller, bis die Zeit abläuft. Wer zögert oder ein Wort wiederholt, trinkt 2 Schlucke.",
    "Go around describing the night so far in a single word, faster and faster, until time runs out. Anyone who hesitates or repeats a word drinks 2 sips.",
    { seconds: 40 },
  ),
  party(
    'roulette',
    "Das Roulette hat {{player}} zum DJ gewählt. Diese Person bestimmt den nächsten Song und alle stoßen darauf an.",
    "The wheel made {{player}} the DJ. They choose the next song and everyone toasts to it.",
  ),
  party(
    'roulette',
    "{{player}} wurde gezogen und wählt ein Motto, etwa Piraten oder Schlager. Alle stoßen im Stil des Mottos an und trinken {{sips}} Schlucke.",
    "{{player}} got picked and chooses a theme, like pirates or pop stars. Everyone toasts in that style and drinks {{sips}} sips.",
  ),
  party(
    'roulette',
    "Das Roulette zeigt auf {{player}}: Diese Person ist Partygast des Jahres und bekommt Applaus von allen. Danach verteilt sie {{sips}} Schlucke.",
    "The wheel lands on {{player}}: party guest of the year. Everyone applauds, then they hand out {{sips}} sips.",
  ),
  party(
    'roulette',
    "{{player}} hat Glück und darf {{sips}} Schlucke an die ganze Runde verteilen, jede Person bekommt höchstens 2.",
    "{{player}} got lucky and hands out {{sips}} sips across the group, no more than 2 per person.",
  ),
  party(
    'roulette',
    "Das Roulette hat {{player}} erwischt. Die ganze Runde singt dieser Person ein spontanes Loblied, danach trinkt sie 2 Schlucke.",
    "The wheel caught {{player}}. The whole group makes up a song in their honor, then they drink 2 sips.",
  ),
  party(
    'double',
    "{{player}}, Doppelt oder nichts: Sag voraus, wie viele Leute ihr Glas noch mehr als halb voll haben. Dann heben sie die Hand. Liegst du richtig, trinken alle anderen 2 Schlucke, sonst trinkst du 4.",
    "{{player}}, double or nothing: predict how many people still have a glass that's more than half full. Then they raise their hands. If you're right, everyone else drinks 2 sips, otherwise you drink 4.",
  ),
  party(
    'double',
    "{{player}}, Doppelt oder nichts: Sag voraus, ob die Mehrheit gleich lieber Pizza oder Döner ruft. Auf drei rufen alle. Liegst du richtig, verteilst du 6 Schlucke, sonst trinkst du 3.",
    "{{player}}, double or nothing: predict whether most people will shout pizza or burgers. Everyone shouts on three. Get it right and you hand out 6 sips, otherwise you drink 3.",
  ),
  party(
    'rule',
    "Jedes Mal, wenn jemand trinkt, rufen alle anderen \"Hoch die Tassen!\". Wer nicht mitruft, trinkt 1 Schluck.",
    "Every time someone drinks, everyone else shouts \"Bottoms up!\". Stay quiet and you drink 1 sip.",
    {
      rounds: 5,
      endContent: "Die Anfeuer-Regel ist vorbei.",
      endContentEn: "The cheering rule is over.",
    },
  ),
  party(
    'rule',
    "Wer auf sein Handy schaut, trinkt 1 Schluck.",
    "Look at your phone and you drink 1 sip.",
    {
      rounds: 6,
      endContent: "Handys sind wieder erlaubt.",
      endContentEn: "Phones are allowed again.",
    },
  ),
  party(
    'rule',
    "Vor jedem Schluck wird kurz mit den Hüften gewackelt. Wer es vergisst, trinkt 1 Schluck extra.",
    "Shake your hips before every sip. Forget and you drink 1 extra sip.",
    {
      rounds: 4,
      endContent: "Ihr dürft wieder ohne Hüftschwung trinken.",
      endContentEn: "You can drink without the hip shake again.",
    },
  ),
  party(
    'rule',
    "Alle reden nur noch mit Partystimme, also laut und völlig begeistert. Wer normal spricht, trinkt 1 Schluck.",
    "Everyone talks in a party voice: loud and wildly excited. Speak normally and you drink 1 sip.",
    {
      rounds: 5,
      endContent: "Ihr dürft wieder normal reden.",
      endContentEn: "Normal voices are back.",
    },
  ),
  party(
    'rule',
    "Ruft jemand \"Prost!\", müssen alle sofort anstoßen. Wer als Letztes anstößt, trinkt 2 Schlucke.",
    "When someone shouts \"Cheers!\", everyone has to clink glasses right away. Last one to clink drinks 2 sips.",
    {
      rounds: 6,
      endContent: "Die Prost-Regel ist vorbei.",
      endContentEn: "The cheers rule is over.",
    },
  ),
  party(
    'curse',
    "{{player}} ist das Echo der Runde und wiederholt das letzte Wort jeder vorgelesenen Aufgabe laut. Jedes vergessene Echo kostet 1 Schluck.",
    "{{player}} is the group's echo and repeats the last word of every task out loud. Every missed echo costs 1 sip.",
    {
      rounds: 4,
      endContent: "Das Echo ist verstummt.",
      endContentEn: "The echo has gone quiet.",
    },
  ),
  party(
    'curse',
    "{{player}} muss jedes Mal applaudieren, wenn jemand trinkt. Jeder verpasste Applaus kostet 1 Schluck.",
    "{{player}} has to applaud every time someone drinks. Every missed round of applause costs 1 sip.",
    {
      rounds: 5,
      endContent: "Der Applaus-Fluch ist vorbei.",
      endContentEn: "The applause curse is over.",
    },
  ),
  party(
    'group',
    "Alle, die heute schon getanzt haben, verteilen 2 Schlucke. Alle anderen trinken 2.",
    "Everyone who has danced today hands out 2 sips. Everyone else drinks 2.",
  ),
  party(
    'group',
    "Alle, die schon mal bis zum Sonnenaufgang gefeiert haben, trinken {{sips}} Schlucke.",
    "Everyone who has partied until sunrise drinks {{sips}} sips.",
  ),
  party(
    'group',
    "Alle heben das Glas und {{player}} zählt von fünf runter. Bei null trinken alle gleichzeitig {{sips}} Schlucke.",
    "Everyone raises their glass while {{player}} counts down from five. At zero, everyone drinks {{sips}} sips together.",
  ),
  party(
    'group',
    "Alle stehen auf und stoßen über der Tischmitte an. Wer als Letztes dabei ist, trinkt {{sips}} Schlucke.",
    "Everyone stands up and clinks glasses over the middle of the table. Last one in drinks {{sips}} sips.",
  ),
  party(
    'group',
    "Alle, die gerade etwas Schwarzes tragen, trinken 1 Schluck. Wer ganz in Schwarz ist, trinkt 3.",
    "Everyone wearing something black drinks 1 sip. Anyone dressed head to toe in black drinks 3.",
  ),
  party(
    'group',
    "Alle rufen auf drei gleichzeitig ihr Traumurlaubsziel. Wer dasselbe ruft wie jemand anderes, trinkt mit dieser Person 2 Schlucke.",
    "On three, everyone shouts their dream vacation spot. If you match someone, drink 2 sips together.",
  ),
  party(
    'group',
    "Alle, die heute schon ein Selfie gemacht haben, trinken 1 Schluck. Wer es in die Story gepostet hat, trinkt 3.",
    "Everyone who took a selfie today drinks 1 sip. If it went in your story, drink 3.",
  ),
  party(
    'group',
    "Alle trommeln einen Beat auf den Tisch, bis {{player}} \"Stopp!\" ruft. Wer weitertrommelt, trinkt 2 Schlucke.",
    "Everyone drums a beat on the table until {{player}} shouts \"Stop!\". Whoever keeps going drinks 2 sips.",
  ),
  party(
    'vote',
    "Wer ist heute Abend die größte Partykanone? Auf drei zeigen alle. Wer gewählt wird, verteilt {{sips}} Schlucke.",
    "Who is tonight's biggest party animal? Everyone points on three. Whoever gets picked hands out {{sips}} sips.",
  ),
  party(
    'vote',
    "Wer tanzt am ehesten noch, wenn schon das Licht angeht? Auf drei zeigen alle. Diese Person trinkt 2 Schlucke.",
    "Who is most likely to still be dancing when the lights come on? Everyone points on three. That person drinks 2 sips.",
  ),
  party(
    'vote',
    "{{player}} schlägt zwei Songs vor und alle stimmen per Handzeichen ab, welcher als Nächstes läuft. Die Minderheit trinkt 2 Schlucke.",
    "{{player}} suggests two songs and everyone votes by show of hands on which plays next. The minority drinks 2 sips.",
  ),
  party(
    'vote',
    "Wer hat heute das beste Outfit? Auf drei zeigen alle. Wer gewählt wird, verteilt {{sips}} Schlucke.",
    "Who has the best outfit tonight? Everyone points on three. Whoever gets picked hands out {{sips}} sips.",
  ),
  party(
    'category',
    "Partyspiele. {{player}} beginnt, reihum nennt jeder eins. Wer zögert oder wiederholt, trinkt 2 Schlucke.",
    "Party games. {{player}} starts, then everyone names one in turn. Anyone who hesitates or repeats drinks 2 sips.",
  ),
  party(
    'category',
    "Dinge, die auf jeder Hausparty passieren. {{player}} beginnt, dann geht es reihum. Wer stockt, trinkt {{sips}} Schlucke.",
    "Things that happen at every house party. {{player}} starts, then go around. Whoever stalls drinks {{sips}} sips.",
  ),
  party(
    'category',
    "Songs, in deren Titel eine Stadt vorkommt. {{player}} beginnt, dann geht es reihum. Wer passen muss, trinkt 2 Schlucke.",
    "Songs with a city in the title. {{player}} starts, then go around. Whoever has to pass drinks 2 sips.",
  ),
  party(
    'category',
    "Dinge, die man auf einem Festival braucht. {{player}} beginnt, dann geht es reihum. Wer zögert, trinkt {{sips}} Schlucke.",
    "Things you need at a festival. {{player}} starts, then go around. Whoever hesitates drinks {{sips}} sips.",
  ),
  party(
    'never',
    "auf einer Party die Musik umgestellt, weil ich unbedingt meinen Song hören wollte. Wer schon, trinkt {{sips}} Schlucke.",
    "changed the music at a party because I just had to hear my song. If you have, drink {{sips}} sips.",
  ),
  party(
    'never',
    "bei einem Konzert in der ersten Reihe gestanden. Wer schon, trinkt {{sips}} Schlucke.",
    "been in the front row at a concert. If you have, drink {{sips}} sips.",
  ),
  party(
    'versus',
    "{{player}} gegen {{player}}: Tanzbattle, jeder hat einen kurzen Auftritt. Die Runde entscheidet per Applaus. Wer verliert, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Dance battle, one short turn each. The group decides by applause. The loser drinks {{sips}} sips.",
  ),
];

const duellSpecials: SpecialTask[] = [
  duell(
    'versus',
    "{{player}} gegen {{player}}: Wer zuerst auf fünf Dinge im Raum zeigt, die mit K beginnen, verteilt 3 Schlucke. Der andere trinkt 2.",
    "{{player}} vs. {{player}}: First to point at five things in the room starting with S hands out 3 sips. The other drinks 2.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Schließt die Augen und steht auf, wenn ihr glaubt, dass 30 Sekunden vorbei sind. Wer weiter danebenliegt, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Close your eyes and stand up when you think 30 seconds have passed. Whoever is further off drinks {{sips}} sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Schnippt abwechselnd einen Bierdeckel oder eine Münze über den Tisch. Wer weniger weit kommt, trinkt 2 Schlucke.",
    "{{player}} vs. {{player}}: Take turns flicking a coaster or a coin across the table. Shorter distance drinks 2 sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Sagt dreimal schnell \"Der Potsdamer Postkutscher putzt den Potsdamer Postkutschkasten\". Wer sich zuerst verhaspelt, trinkt 3 Schlucke.",
    "{{player}} vs. {{player}}: Say \"red lorry, yellow lorry\" five times fast. First to stumble drinks 3 sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Nennt abwechselnd Wörter, die sich auf \"Haus\" reimen. Wer zuerst passt, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Take turns naming words that rhyme with \"cat\". Whoever passes first drinks {{sips}} sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Wer zuerst einen Schuh aus- und wieder angezogen hat, gewinnt. Wer verliert, trinkt 3 Schlucke.",
    "{{player}} vs. {{player}}: First to take off one shoe and put it back on wins. The loser drinks 3 sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Stellt euch gegenseitig eine Quizfrage über euch selbst. Wer falsch antwortet, trinkt 2 Schlucke. Liegen beide falsch, trinken beide.",
    "{{player}} vs. {{player}}: Ask each other one quiz question about yourself. A wrong answer costs 2 sips. If both are wrong, both drink.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Bildet das längste Wort nur aus den Buchstaben eures eigenen Vornamens. Wer das kürzere hat, trinkt 2 Schlucke.",
    "{{player}} vs. {{player}}: Make the longest word you can using only the letters of your own first name. Shorter word drinks 2 sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Zeichnet abwechselnd mit dem Finger ein Tier in die Luft, das der andere erraten muss. Wer zuerst falsch rät, trinkt 2 Schlucke.",
    "{{player}} vs. {{player}}: Take turns drawing an animal in the air with your finger for the other to guess. First wrong guess drinks 2 sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Wer kann länger einen Ton halten? Wer zuerst Luft holt, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Who can hold a note longer? First to take a breath drinks {{sips}} sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Zählt gleichzeitig rückwärts von 20 bis 1. Die Runde ist Jury. Wer langsamer ist oder sich verzählt, trinkt 2 Schlucke.",
    "{{player}} vs. {{player}}: Count backwards from 20 to 1 at the same time. The group judges. Slower or wrong drinks 2 sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Nennt abwechselnd berühmte Paare aus Filmen und Serien. Wer zuerst passt, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Take turns naming famous couples from movies and TV. Whoever passes first drinks {{sips}} sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Imitiert abwechselnd ein Tier. Die Runde entscheidet, wer überzeugender war. Wer verliert, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Take turns doing an animal impression. The group decides who was more convincing. The loser drinks {{sips}} sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Sagt auf drei gleichzeitig ein Wort, das zum Sommer passt. Sagt ihr dasselbe, verteilt ihr beide {{sips}} Schlucke. Nach drei Fehlversuchen trinken beide 2.",
    "{{player}} vs. {{player}}: On three, both say a word that goes with summer. Say the same word and you both hand out {{sips}} sips. After three misses, you both drink 2.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Zeichnet mit geschlossenen Augen ein Haus auf eine Serviette. Die Runde entscheidet. Wer verliert, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Draw a house on a napkin with your eyes closed. The group decides. The loser drinks {{sips}} sips.",
  ),
  duell(
    'versus',
    "{{player}} gegen {{player}}: Haltet eine Rede von genau einem Satz, warum ihr dieses Duell gewinnen solltet. Die Runde stimmt ab. Wer verliert, trinkt 3 Schlucke.",
    "{{player}} vs. {{player}}: Give a one-sentence speech on why you deserve to win this duel. The group votes. The loser drinks 3 sips.",
  ),
  duell(
    'double',
    "{{player}}, Doppelt oder nichts gegen {{player}}: Eine Runde Schere, Stein, Papier. Gewinnst du, trinkt dein Gegenüber 6 Schlucke, verlierst du, trinkst du 6.",
    "{{player}}, double or nothing against {{player}}: One round of rock, paper, scissors. Win and your opponent drinks 6 sips. Lose and you drink 6.",
  ),
  duell(
    'double',
    "{{player}}, Doppelt oder nichts: {{player}} denkt sich eine Zahl von 1 bis 5. Triffst du sie, verteilst du 8 Schlucke, sonst trinkst du 3.",
    "{{player}}, double or nothing: {{player}} thinks of a number from 1 to 5. Guess it and you hand out 8 sips, otherwise you drink 3.",
  ),
  duell(
    'double',
    "{{player}}, Doppelt oder nichts: {{player}} versteckt eine Münze in einer Faust, zweimal hintereinander. Rätst du beide Male richtig, verteilst du 8 Schlucke, sonst trinkst du 4.",
    "{{player}}, double or nothing: {{player}} hides a coin in one fist, twice in a row. Guess right both times and you hand out 8 sips, otherwise you drink 4.",
  ),
  duell(
    'double',
    "{{player}}, Doppelt oder nichts: Wette, ob {{player}} gleich lieber Sommer oder Winter sagt. Richtig, verteilst du {{sips}} Schlucke. Falsch, trinkst du {{sips}}.",
    "{{player}}, double or nothing: bet on whether {{player}} will pick summer or winter. Right and you hand out {{sips}} sips. Wrong and you drink {{sips}}.",
  ),
  duell(
    'double',
    "{{player}}, Doppelt oder nichts: Schätz die Schuhgröße von {{player}}. Genau richtig, verteilst du 6 Schlucke. Daneben, trinkst du 3.",
    "{{player}}, double or nothing: guess {{player}}'s shoe size. Spot on and you hand out 6 sips. Off and you drink 3.",
  ),
  duell(
    'double',
    "{{player}}, Doppelt oder nichts: Errate, ob {{player}} einen zweiten Vornamen hat und wie er lautet. Richtig, verteilst du 6 Schlucke. Falsch, trinkst du 3.",
    "{{player}}, double or nothing: guess whether {{player}} has a middle name, and what it is. Right and you hand out 6 sips. Wrong and you drink 3.",
  ),
  duell(
    'double',
    "{{player}}, Doppelt oder nichts: Du und {{player}} streckt auf drei je 0 bis 5 Finger aus. Sag vorher die Summe an. Triffst du sie, verteilst du 8 Schlucke, sonst trinkst du 3.",
    "{{player}}, double or nothing: you and {{player}} each hold out 0 to 5 fingers on three. Call the total first. Nail it and you hand out 8 sips, otherwise you drink 3.",
  ),
  duell(
    'double',
    "{{player}}, Doppelt oder nichts: Sag in einem Atemzug alle Wochentage und alle Monate auf. Schaffst du es, trinkt {{player}} {{sips}} Schlucke, sonst trinkst du doppelt so viele.",
    "{{player}}, double or nothing: say every day of the week and every month in one breath. Make it and {{player}} drinks {{sips}} sips, otherwise you drink double that.",
  ),
  duell(
    'timer',
    "{{player}} gegen {{player}}: Nennt abwechselnd Marken, bis die Zeit abläuft. Wer beim Ablauf dran ist, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Take turns naming brands until time runs out. Whoever is up when it ends drinks {{sips}} sips.",
    { seconds: 30 },
  ),
  duell(
    'timer',
    "{{player}} gegen {{player}}: Nennt abwechselnd Wörter mit drei Silben. Wer beim Ablauf dran ist, trinkt 3 Schlucke.",
    "{{player}} vs. {{player}}: Take turns naming three-syllable words. Whoever is up when time runs out drinks 3 sips.",
    { seconds: 20 },
  ),
  duell(
    'timer',
    "{{player}} gegen {{player}}: Notiert im Handy so viele Tiere mit M wie möglich. Wer mehr hat, verteilt 4 Schlucke, der andere trinkt 2.",
    "{{player}} vs. {{player}}: Type as many animals starting with M into your phone as you can. More wins and hands out 4 sips, the other drinks 2.",
    { seconds: 45 },
  ),
  duell(
    'timer',
    "{{player}} gegen {{player}}: Erzählt gleichzeitig die Handlung eures Lieblingsfilms, bis die Zeit abläuft. Wer zuerst stockt oder lacht, trinkt 3 Schlucke.",
    "{{player}} vs. {{player}}: Both tell the plot of your favorite movie at the same time until time runs out. First to stall or laugh drinks 3 sips.",
    { seconds: 40 },
  ),
  duell(
    'timer',
    "{{player}} gegen {{player}}: Sagt abwechselnd Wörter, die mit \"Sch\" beginnen. Wer am Ende mehr gefunden hat, verteilt 3 Schlucke.",
    "{{player}} vs. {{player}}: Take turns saying words that start with \"str\". Whoever found more by the end hands out 3 sips.",
    { seconds: 15 },
  ),
  duell(
    'timer',
    "{{player}} gegen {{player}}: Nennt abwechselnd Dinge, die rund sind. Wer hängt oder beim Ablauf dran ist, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Take turns naming things that are round. Whoever gets stuck or is up when time runs out drinks {{sips}} sips.",
    { seconds: 30 },
  ),
  duell(
    'timer',
    "{{player}} gegen {{player}}: Nennt abwechselnd Sportarten mit Ball. Wer beim Ablauf dran ist, trinkt 3 Schlucke.",
    "{{player}} vs. {{player}}: Take turns naming sports played with a ball. Whoever is up when time runs out drinks 3 sips.",
    { seconds: 25 },
  ),
  duell(
    'timer',
    "{{player}} gegen {{player}}: Unterhaltet euch nur in Reimen, bis die Zeit abläuft. Wer keinen Reim findet, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Talk to each other only in rhymes until time runs out. Whoever can't find a rhyme drinks {{sips}} sips.",
    { seconds: 40 },
  ),
  duell(
    'roulette',
    "Das Roulette hat {{player}} gewählt: Diese Person fordert jemanden zu einem Duell nach Wahl heraus. Wer verliert, trinkt 4 Schlucke.",
    "The wheel picked {{player}}: challenge anyone you like to a duel of your choice. The loser drinks 4 sips.",
  ),
  duell(
    'roulette',
    "{{player}} wurde gezogen und ist Schiedsrichter beim nächsten Duell. Bei knappen Entscheidungen bestimmt diese Person, wer trinkt.",
    "{{player}} got picked to referee the next duel. In close calls, they decide who drinks.",
  ),
  duell(
    'roulette',
    "Das Roulette zeigt auf {{player}}: Diese Person spielt Schere, Stein, Papier gegen die linke Nachbarperson. Wer verliert, trinkt {{sips}} Schlucke.",
    "The wheel lands on {{player}}: play rock, paper, scissors against the person on your left. The loser drinks {{sips}} sips.",
  ),
  duell(
    'roulette',
    "{{player}} wurde ausgelost und tritt gegen alle an: Auf drei zeigt jeder Schere, Stein oder Papier. Alle, die gegen diese Person verlieren, trinken 2 Schlucke. Verliert sie gegen alle, trinkt sie 5.",
    "{{player}} got picked to take on everyone: on three, all show rock, paper or scissors. Everyone who loses to them drinks 2 sips. If they lose to everyone, they drink 5.",
  ),
  duell(
    'curse',
    "{{player}} muss jedes Duell annehmen, das jemand vorschlägt. Wer gegen diese Person verliert, trinkt 2 Schlucke, und umgekehrt.",
    "{{player}} has to accept every duel anyone proposes. Whoever loses to them drinks 2 sips, and the same goes the other way.",
    {
      rounds: 4,
      endContent: "Die Duellpflicht ist vorbei.",
      endContentEn: "The duel duty is over.",
    },
  ),
  duell(
    'curse',
    "{{player}} trinkt bei jedem Duell mit, egal wer verliert. Gewinnt diese Person selbst eins, ist der Fluch sofort gebrochen.",
    "{{player}} drinks along in every duel, no matter who loses. If they win one themselves, the curse breaks right away.",
    {
      rounds: 5,
      endContent: "Der Mittrink-Fluch ist vorbei.",
      endContentEn: "The drink-along curse is over.",
    },
  ),
  duell(
    'category',
    "Dinge, die man in einem Hotelzimmer findet. {{player}} und {{player}} nennen abwechselnd eins. Wer zögert oder wiederholt, trinkt 3 Schlucke.",
    "Things you find in a hotel room. {{player}} and {{player}} take turns naming one. Whoever hesitates or repeats drinks 3 sips.",
  ),
  duell(
    'category',
    "Dinge, die man auf einem Weihnachtsmarkt kaufen kann. {{player}} gegen {{player}}, immer abwechselnd. Wer stockt, trinkt {{sips}} Schlucke.",
    "Things you can buy at a Christmas market. {{player}} vs. {{player}}, taking turns. Whoever stalls drinks {{sips}} sips.",
  ),
];

const wahrheitSpecials: SpecialTask[] = [
  wahrheit(
    'never',
    "einem Haustier mehr erzählt als meinen Freunden. Wer schon, trinkt 2 Schlucke.",
    "told a pet more than I've told my friends. If you have, drink 2 sips.",
  ),
  wahrheit(
    'never',
    "eine Nachricht gelesen und dann absichtlich tagelang nicht geantwortet. Wer schon, trinkt {{sips}} Schlucke.",
    "read a message and then deliberately left it unanswered for days. If you have, drink {{sips}} sips.",
  ),
  wahrheit(
    'never',
    "so getan, als hätte ich ein Buch gelesen, über das alle reden. Wer schon, trinkt 2 Schlucke.",
    "pretended to have read a book everyone was talking about. If you have, drink 2 sips.",
  ),
  wahrheit(
    'never',
    "eine Ausrede erfunden, um nicht zu einer Party zu müssen. Wer schon, trinkt {{sips}} Schlucke.",
    "made up an excuse to get out of a party. If you have, drink {{sips}} sips.",
  ),
  wahrheit(
    'never',
    "bei einem Kinderfilm geweint. Wer schon, trinkt 1 Schluck.",
    "cried at a kids' movie. If you have, drink 1 sip.",
  ),
  wahrheit(
    'never',
    "im Supermarkt eine fremde Person angesprochen, weil ich sie für jemand Bekanntes gehalten habe. Wer schon, trinkt 2 Schlucke.",
    "started talking to a stranger at the store because I thought I knew them. If you have, drink 2 sips.",
  ),
  wahrheit(
    'never',
    "mein eigenes Spiegelbild in einem Schaufenster angelächelt. Wer schon, trinkt 2 Schlucke.",
    "smiled at my own reflection in a shop window. If you have, drink 2 sips.",
  ),
  wahrheit(
    'never',
    "beim Arzt geflunkert, wie viel ich wirklich trinke. Wer schon, trinkt {{sips}} Schlucke.",
    "fibbed to a doctor about how much I really drink. If you have, drink {{sips}} sips.",
  ),
  wahrheit(
    'never',
    "geschrieben, ich sei schon unterwegs, obwohl ich noch im Bett lag. Wer schon, trinkt {{sips}} Schlucke.",
    "texted that I was on my way while I was still in bed. If you have, drink {{sips}} sips.",
  ),
  wahrheit(
    'never',
    "einen Liedtext jahrelang falsch mitgesungen, ohne es zu merken. Wer schon, trinkt 1 Schluck.",
    "sung the wrong lyrics to a song for years without noticing. If you have, drink 1 sip.",
  ),
  wahrheit(
    'never',
    "einen Film bewertet, den ich nie gesehen habe. Wer schon, trinkt {{sips}} Schlucke.",
    "rated a movie I've never actually seen. If you have, drink {{sips}} sips.",
  ),
  wahrheit(
    'never',
    "beim Brettspiel heimlich geschummelt. Wer schon, trinkt {{sips}} Schlucke.",
    "secretly cheated at a board game. If you have, drink {{sips}} sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, welche kleine Lüge erzählst du am häufigsten? Antworte ehrlich oder trink {{sips}} Schlucke.",
    "{{player}}, what's the little white lie you tell most often? Answer honestly or drink {{sips}} sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, wofür hast du zuletzt viel zu viel Geld ausgegeben? Antworte oder trink {{sips}} Schlucke.",
    "{{player}}, what did you last spend way too much money on? Answer or drink {{sips}} sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, welche Fähigkeit würdest du gern über Nacht beherrschen? Antworte oder trink 1 Schluck.",
    "{{player}}, what skill would you love to master overnight? Answer or drink 1 sip.",
  ),
  wahrheit(
    'question',
    "{{player}}, wen in dieser Runde hast du beim ersten Treffen völlig falsch eingeschätzt? Antworte ehrlich oder trink {{sips}} Schlucke.",
    "{{player}}, who here did you completely misjudge when you first met? Answer honestly or drink {{sips}} sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, was ist das Kindischste, das du immer noch gern machst? Antworte oder trink 2 Schlucke.",
    "{{player}}, what's the most childish thing you still love doing? Answer or drink 2 sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, welche Nachricht in deinem Handy dürfte hier niemand lesen? Erzähl grob, worum es geht, oder trink {{sips}} Schlucke.",
    "{{player}}, which message on your phone should nobody here ever read? Tell us roughly what it's about or drink {{sips}} sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, wann hast du zuletzt so richtig über dich selbst gelacht? Erzähl es oder trink 2 Schlucke.",
    "{{player}}, when did you last have a really good laugh at yourself? Tell us or drink 2 sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, was ist deine unbeliebteste Meinung über Essen? Antworte oder trink 2 Schlucke.",
    "{{player}}, what's your most unpopular food opinion? Answer or drink 2 sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, welches Geheimnis aus deiner Kindheit kennen nicht mal deine Eltern? Antworte ehrlich oder trink {{sips}} Schlucke.",
    "{{player}}, what childhood secret do not even your parents know? Answer honestly or drink {{sips}} sips.",
  ),
  wahrheit(
    'question',
    "{{player}}, welche Gewohnheit von dir würde dein früheres Ich total überraschen? Antworte oder trink 2 Schlucke.",
    "{{player}}, which of your habits would totally surprise your younger self? Answer or drink 2 sips.",
  ),
  wahrheit(
    'vote',
    "Wer in der Runde kann am schlechtesten lügen? Auf drei zeigen alle. Wer gewählt wird, trinkt {{sips}} Schlucke.",
    "Who here is the worst liar? Everyone points on three. Whoever gets picked drinks {{sips}} sips.",
  ),
  wahrheit(
    'vote',
    "Wer hat am ehesten einen geheimen Zweitaccount? Auf drei zeigen alle. Wer gewählt wird, trinkt {{sips}} Schlucke.",
    "Who is most likely to have a secret second account? Everyone points on three. Whoever gets picked drinks {{sips}} sips.",
  ),
  wahrheit(
    'vote',
    "Wer würde ein Geheimnis am längsten für sich behalten? Auf drei zeigen alle. Wer gewählt wird, verteilt 3 Schlucke.",
    "Who would keep a secret the longest? Everyone points on three. Whoever gets picked hands out 3 sips.",
  ),
  wahrheit(
    'vote',
    "Wer hat die meisten ungelesenen Nachrichten? Erst zeigen alle auf drei, dann wird nachgeschaut. Lag die Runde richtig, trinkt diese Person 3 Schlucke, sonst trinken alle 1.",
    "Who has the most unread messages? Everyone points on three, then check. If the group was right, that person drinks 3 sips, otherwise everyone drinks 1.",
  ),
  wahrheit(
    'vote',
    "Wer gibt am ehesten viel zu viel Trinkgeld? Auf drei zeigen alle. Wer gewählt wird, verteilt 2 Schlucke.",
    "Who is most likely to tip way too much? Everyone points on three. Whoever gets picked hands out 2 sips.",
  ),
  wahrheit(
    'vote',
    "Wer schaut sich am ehesten das Profil der neuen Beziehung vom Ex an? Auf drei zeigen alle. Wer gewählt wird, trinkt {{sips}} Schlucke.",
    "Who is most likely to check out their ex's new partner online? Everyone points on three. Whoever gets picked drinks {{sips}} sips.",
  ),
  wahrheit(
    'vote',
    "Wer liest bei einem Buch am ehesten heimlich zuerst das Ende? Auf drei zeigen alle. Wer gewählt wird, sagt ehrlich, ob es stimmt, oder trinkt 2 Schlucke.",
    "Who is most likely to secretly read the end of a book first? Everyone points on three. Whoever gets picked says honestly if it's true or drinks 2 sips.",
  ),
  wahrheit(
    'vote',
    "Wer erzählt die besten Geschichten, die vermutlich zur Hälfte erfunden sind? Auf drei zeigen alle. Wer gewählt wird, trinkt 2 Schlucke.",
    "Who tells the best stories that are probably half made up? Everyone points on three. Whoever gets picked drinks 2 sips.",
  ),
  wahrheit(
    'double',
    "{{player}}, Doppelt oder nichts: Sag voraus, ob {{player}} gleich zugibt, schon mal heimlich in das Handy von jemandem geschaut zu haben. Liegst du richtig, verteilst du 6 Schlucke, sonst trinkst du 3.",
    "{{player}}, double or nothing: predict whether {{player}} will admit to having secretly looked at someone's phone. Get it right and you hand out 6 sips, otherwise you drink 3.",
  ),
  wahrheit(
    'double',
    "{{player}}, Doppelt oder nichts: Schätz, wie viele hier schon mal bei einem Spiel geschummelt haben. Dann heben alle ehrlich die Hand. Liegst du genau richtig, verteilst du 8 Schlucke, sonst trinkst du 3.",
    "{{player}}, double or nothing: guess how many people here have cheated at a game. Then everyone honestly raises a hand. Exactly right and you hand out 8 sips, otherwise you drink 3.",
  ),
  wahrheit(
    'double',
    "{{player}}, Doppelt oder nichts: {{player}} erzählt zwei Wahrheiten und eine Lüge. Findest du die Lüge, verteilst du {{sips}} Schlucke, sonst trinkst du {{sips}}.",
    "{{player}}, double or nothing: {{player}} tells two truths and a lie. Spot the lie and you hand out {{sips}} sips, otherwise you drink {{sips}}.",
  ),
  wahrheit(
    'roulette',
    "Das Roulette hat {{player}} gewählt: Jede Person darf dieser Person eine ehrliche Frage stellen. Jede verweigerte Antwort kostet 2 Schlucke.",
    "The wheel picked {{player}}: everyone gets to ask them one honest question. Every refused answer costs 2 sips.",
  ),
  wahrheit(
    'roulette',
    "{{player}} wurde gezogen und stellt eine Frage, die alle reihum ehrlich beantworten. Wer passt, trinkt {{sips}} Schlucke.",
    "{{player}} got picked and asks a question everyone answers honestly in turn. Anyone who passes drinks {{sips}} sips.",
  ),
  wahrheit(
    'roulette',
    "Das Roulette zeigt auf {{player}}: Diese Person erzählt, wen sie hier am längsten kennt und wie ihr euch kennengelernt habt, oder trinkt 3 Schlucke.",
    "The wheel lands on {{player}}: tell us who here you've known the longest and how you met, or drink 3 sips.",
  ),
  wahrheit(
    'timer',
    "{{player}}, zähl ohne Nachdenken Dinge auf, die du an dir magst. Sind es weniger als 5, trinkst du 2 Schlucke.",
    "{{player}}, list things you like about yourself without overthinking it. Fewer than 5 and you drink 2 sips.",
    { seconds: 30 },
  ),
  wahrheit(
    'timer',
    "Die Runde stellt {{player}} schnelle Fragen, die nur ehrlich mit Ja oder Nein beantwortet werden dürfen. Jedes Zögern kostet 1 Schluck.",
    "The group fires quick questions at {{player}}, who may only answer honestly with yes or no. Every hesitation costs 1 sip.",
    { seconds: 20 },
  ),
  wahrheit(
    'curse',
    "{{player}} muss jede Frage absolut ehrlich beantworten. Wer diese Person bei einer Ausrede erwischt, darf ihr 2 Schlucke geben.",
    "{{player}} has to answer every question with total honesty. Catch them dodging and you can give them 2 sips.",
    {
      rounds: 4,
      endContent: "Der Ehrlichkeits-Fluch ist vorbei.",
      endContentEn: "The honesty curse is over.",
    },
  ),
  wahrheit(
    'curse',
    "{{player}} darf keine Frage mit Ja oder Nein beantworten. Jedes Ja oder Nein kostet 1 Schluck.",
    "{{player}} can't answer any question with yes or no. Every yes or no costs 1 sip.",
    {
      rounds: 5,
      endContent: "Ja und Nein sind wieder erlaubt.",
      endContentEn: "Yes and no are allowed again.",
    },
  ),
];

const chaosSpecials: SpecialTask[] = [
  chaos(
    'rule',
    "Wer eine Aufgabe vorliest, muss das wie ein Zirkusdirektor tun. Wer normal vorliest, trinkt 1 Schluck.",
    "Whoever reads a task out loud has to do it like a circus ringmaster. Read it normally and you drink 1 sip.",
    {
      rounds: 6,
      endContent: "Die Zirkusvorstellung ist vorbei.",
      endContentEn: "The circus show is over.",
    },
  ),
  chaos(
    'rule',
    "Vor jedem Schluck wird mit dem Glas ein kleiner Kreis in die Luft gemalt. Wer es vergisst, trinkt 1 Schluck extra.",
    "Before every sip, draw a little circle in the air with your glass. Forget and you drink 1 extra sip.",
    {
      rounds: 4,
      endContent: "Die Kreise in der Luft sind vorbei.",
      endContentEn: "No more circles in the air.",
    },
  ),
  chaos(
    'rule',
    "Zahlen dürfen nicht ausgesprochen werden, man zeigt sie mit den Fingern. Nur beim Vorlesen der Aufgaben ist es erlaubt. Wer eine Zahl sagt, trinkt 1 Schluck.",
    "Numbers may not be spoken, only shown on your fingers. Reading tasks out loud is the only exception. Say a number and you drink 1 sip.",
    {
      rounds: 6,
      endContent: "Zahlen dürfen wieder ausgesprochen werden.",
      endContentEn: "You can say numbers again.",
    },
  ),
  chaos(
    'rule',
    "Jedes Mal, wenn jemand lacht, rufen alle anderen \"Ruhe!\". Wer als Letztes ruft, trinkt 1 Schluck.",
    "Every time someone laughs, everyone else shouts \"Silence!\". The last one to shout drinks 1 sip.",
    {
      rounds: 5,
      endContent: "Ihr dürft wieder in Ruhe lachen.",
      endContentEn: "You can laugh in peace again.",
    },
  ),
  chaos(
    'rule',
    "Das eigene Glas darf nicht abgestellt werden und bleibt immer in der Hand. Wer es abstellt, trinkt 1 Schluck.",
    "Your glass may not touch the table and stays in your hand at all times. Put it down and you drink 1 sip.",
    {
      rounds: 5,
      endContent: "Die Gläser dürfen wieder auf den Tisch.",
      endContentEn: "Glasses can go back on the table.",
    },
  ),
  chaos(
    'rule',
    "Wer etwas sagen will, muss sich vorher melden wie in der Schule. Wer ohne Meldung spricht, trinkt 1 Schluck.",
    "Anyone who wants to speak has to raise their hand first, like in school. Speak without raising it and you drink 1 sip.",
    {
      rounds: 6,
      endContent: "Ihr dürft wieder ohne Melden reden.",
      endContentEn: "You can speak without raising your hand again.",
    },
  ),
  chaos(
    'rule',
    "Statt \"ja\" sagt man \"jawohl\" und statt \"nein\" sagt man \"niemals\". Wer sich vertut, trinkt 1 Schluck.",
    "Instead of \"yes\" you say \"aye aye\" and instead of \"no\" you say \"never\". Slip up and you drink 1 sip.",
    {
      rounds: 4,
      endContent: "Ja und Nein sind wieder ganz normal.",
      endContentEn: "Yes and no are back to normal.",
    },
  ),
  chaos(
    'rule',
    "Wer trinken muss, darf 1 Schluck davon an die rechte Nachbarperson weiterreichen, muss dabei aber laut \"Tschüss!\" rufen.",
    "Whoever has to drink may pass 1 of those sips to the person on their right, but has to shout \"Bye!\" while doing it.",
    {
      rounds: 5,
      endContent: "Die Tschüss-Regel ist vorbei.",
      endContentEn: "The bye rule is over.",
    },
  ),
  chaos(
    'rule',
    "Nach jedem Satz klatscht die sprechende Person einmal in die Hände. Wer es vergisst, trinkt 1 Schluck.",
    "Whoever is speaking claps once after every sentence. Forget and you drink 1 sip.",
    {
      rounds: 3,
      endContent: "Die Klatsch-Regel ist vorbei.",
      endContentEn: "The clapping rule is over.",
    },
  ),
  chaos(
    'rule',
    "Niemand darf mit dem Finger zeigen. Bei Abstimmungen zeigt man mit dem Ellenbogen. Wer trotzdem den Finger benutzt, trinkt 1 Schluck.",
    "Nobody may point with a finger. For votes, you point with your elbow. Use a finger anyway and you drink 1 sip.",
    {
      rounds: 6,
      endContent: "Ihr dürft wieder mit dem Finger zeigen.",
      endContentEn: "Finger pointing is allowed again.",
    },
  ),
  chaos(
    'rule',
    "Vor jedem Schluck ruft man ein Tier, das noch nicht genannt wurde. Wer eins wiederholt, trinkt 1 Schluck extra.",
    "Before every sip, shout an animal that hasn't been named yet. Repeat one and you drink 1 extra sip.",
    {
      rounds: 5,
      endContent: "Der Zoo hat geschlossen.",
      endContentEn: "The zoo is closed.",
    },
  ),
  chaos(
    'rule',
    "Jede Person heißt jetzt wie ihre rechte Nachbarperson. Wer jemanden beim echten Namen nennt, trinkt 1 Schluck.",
    "Everyone now goes by the name of the person on their right. Call someone by their real name and you drink 1 sip.",
    {
      rounds: 4,
      endContent: "Alle bekommen ihren eigenen Namen zurück.",
      endContentEn: "Everyone gets their own name back.",
    },
  ),
  chaos(
    'curse',
    "{{player}} ist der Hofsänger und muss jede Antwort singen. Jede gesprochene Antwort kostet 1 Schluck.",
    "{{player}} is the court singer and has to sing every answer. Every spoken answer costs 1 sip.",
    {
      rounds: 5,
      endContent: "Der Gesangsfluch ist vorbei.",
      endContentEn: "The singing curse is over.",
    },
  ),
  chaos(
    'curse',
    "{{player}} hat kein Gedächtnis mehr und muss sich bei jeder neuen Aufgabe der Runde neu vorstellen. Vergisst diese Person es, trinkt sie 1 Schluck.",
    "{{player}} has lost their memory and has to introduce themselves to the group before every new task. Forget and they drink 1 sip.",
    {
      rounds: 4,
      endContent: "Das Gedächtnis ist zurück.",
      endContentEn: "The memory is back.",
    },
  ),
  chaos(
    'curse',
    "{{player}} ist der Wetterfrosch und macht vor jeder neuen Aufgabe eine Vorhersage, etwa \"Heute ziehen dunkle Schlucke auf\". Jede vergessene Vorhersage kostet 1 Schluck.",
    "{{player}} is the weather forecaster and gives a forecast before every new task, like \"Heavy sips moving in tonight\". Every missed forecast costs 1 sip.",
    {
      rounds: 6,
      endContent: "Die Wettervorhersage ist beendet.",
      endContentEn: "That's the end of the forecast.",
    },
  ),
  chaos(
    'curse',
    "{{player}} hat Schluckauf und muss vor jedem Satz einmal \"hicks\" sagen. Jedes vergessene Hicks kostet 1 Schluck.",
    "{{player}} has the hiccups and has to say \"hic\" before every sentence. Every missed hic costs 1 sip.",
    {
      rounds: 5,
      endContent: "Der Schluckauf ist weg.",
      endContentEn: "The hiccups are gone.",
    },
  ),
  chaos(
    'curse',
    "{{player}} trinkt jeden Schluck doppelt, darf aber auch alles, was diese Person verteilt, verdoppeln.",
    "{{player}} drinks every sip twice, but can also double anything they hand out.",
    {
      rounds: 3,
      endContent: "Die doppelte Wirkung ist verflogen.",
      endContentEn: "The double effect has worn off.",
    },
  ),
  chaos(
    'curse',
    "{{player}} ist allergisch gegen das Wort \"Bier\" und muss jedes Mal niesen, wenn es fällt. Verpasst diese Person ein Niesen, trinkt sie 1 Schluck.",
    "{{player}} is allergic to the word \"beer\" and has to sneeze whenever someone says it. Every missed sneeze costs 1 sip.",
    {
      rounds: 6,
      endContent: "Die Bier-Allergie ist geheilt.",
      endContentEn: "The beer allergy is cured.",
    },
  ),
  chaos(
    'curse',
    "{{player}} muss jeden Schluck mit einem lauten \"Aaah, herrlich!\" beenden. Jedes vergessene Aaah kostet 1 Schluck.",
    "{{player}} has to finish every sip with a loud \"Aaah, delightful!\". Every missed aaah costs 1 sip.",
    {
      rounds: 4,
      endContent: "Der Herrlich-Fluch ist vorbei.",
      endContentEn: "The delightful curse is over.",
    },
  ),
  chaos(
    'curse',
    "{{player}} ist das Orakel: Fragen am Tisch darf nur diese Person beantworten. Wer schneller antwortet, trinkt 1 Schluck.",
    "{{player}} is the oracle: only they may answer questions at the table. Anyone who answers first drinks 1 sip.",
    {
      rounds: 5,
      endContent: "Das Orakel hat genug gesprochen.",
      endContentEn: "The oracle has spoken enough.",
    },
  ),
  chaos(
    'curse',
    "{{player}} darf keine Zähne zeigen. Wer diese Person grinsen sieht, darf ihr 1 Schluck geben.",
    "{{player}} isn't allowed to show their teeth. Catch them grinning and you can give them 1 sip.",
    {
      rounds: 4,
      endContent: "Ab jetzt darf wieder gegrinst werden.",
      endContentEn: "Grinning is allowed again.",
    },
  ),
  chaos(
    'curse',
    "{{player}} spricht wie Yoda: Das Verb kommt immer ans Ende. Jeder normale Satz kostet 1 Schluck.",
    "{{player}} talks like Yoda, with the words in a twisted order. Every normal sentence costs 1 sip.",
    {
      rounds: 5,
      endContent: "Vorbei der Fluch nun ist.",
      endContentEn: "Over, the curse now is.",
    },
  ),
  chaos(
    'curse',
    "{{player}} kommentiert jede neue Aufgabe mit \"Oh nein, nicht schon wieder!\". Jeder verpasste Kommentar kostet 1 Schluck.",
    "{{player}} reacts to every new task with \"Oh no, not again!\". Every missed reaction costs 1 sip.",
    {
      rounds: 3,
      endContent: "Endlich nicht schon wieder.",
      endContentEn: "Finally, not again.",
    },
  ),
  chaos(
    'curse',
    "Immer wenn {{player}} lacht, müssen alle mitlachen. Wer nicht mitlacht, trinkt 1 Schluck.",
    "Whenever {{player}} laughs, everyone has to laugh along. Anyone who doesn't drinks 1 sip.",
    {
      rounds: 6,
      endContent: "Das Lachen ist nicht mehr ansteckend.",
      endContentEn: "The laughter is no longer contagious.",
    },
  ),
  chaos(
    'roulette',
    "Das Roulette hat entschieden: {{player}} trinkt {{sips}} Schlucke und darf danach zwei Leute die Plätze tauschen lassen.",
    "The wheel has spoken: {{player}} drinks {{sips}} sips and then gets to make two people swap seats.",
  ),
  chaos(
    'roulette',
    "{{player}} wurde gezogen und darf eine Regel streichen, die gerade gilt. Gibt es keine, verteilt diese Person {{sips}} Schlucke.",
    "{{player}} got picked and can cancel one rule that's currently active. If there isn't one, they hand out {{sips}} sips.",
  ),
  chaos(
    'roulette',
    "Das Roulette zeigt auf {{player}}: Diese Person tauscht den Platz mit jemandem ihrer Wahl und beide trinken 2 Schlucke.",
    "The wheel lands on {{player}}: swap seats with anyone you like, then you both drink 2 sips.",
  ),
  chaos(
    'roulette',
    "{{player}} ist auserwählt und bestimmt, wer ab jetzt die Aufgaben vorliest. Die gewählte Person trinkt zur Begrüßung 1 Schluck.",
    "{{player}} is the chosen one and decides who reads the tasks from now on. The new reader drinks 1 welcome sip.",
  ),
  chaos(
    'roulette',
    "Das Roulette hat gesprochen: {{player}} wird Richter und benennt sofort zwei Leute, die je {{sips}} Schlucke trinken.",
    "The wheel has spoken: {{player}} becomes the judge and names two people who each drink {{sips}} sips.",
  ),
  chaos(
    'roulette',
    "{{player}} wurde gewählt. Alle anderen stoßen auf diese Person an und trinken 1 Schluck, sie selbst trinkt {{sips}}.",
    "{{player}} got picked. Everyone else toasts to them and drinks 1 sip, while they drink {{sips}}.",
  ),
  chaos(
    'roulette',
    "Das Roulette zeigt auf {{player}}: Diese Person bleibt verschont, aber ihre beiden Nachbarn trinken je {{sips}} Schlucke.",
    "The wheel lands on {{player}}: they get off free, but both of their neighbors drink {{sips}} sips each.",
  ),
  chaos(
    'roulette',
    "{{player}} hat beim Roulette gewonnen und bekommt einen Schutzschild: Die nächste Aufgabe, die diese Person trifft, darf sie an jemand anderen weitergeben.",
    "{{player}} won the wheel and gets a shield: the next task that hits them can be passed on to someone else.",
  ),
  chaos(
    'roulette',
    "Das Roulette landet bei {{player}}: Diese Person nennt eine Zahl von 1 bis 6, und genau so viele Schlucke trinkt die Person gegenüber.",
    "The wheel lands on {{player}}: name a number from 1 to 6, and the person across from you drinks exactly that many sips.",
  ),
  chaos(
    'roulette',
    "{{player}} ist der Pechvogel des Roulettes und trinkt 2 Schlucke. Dafür stellt diese Person sofort eine neue Regel auf, die für drei Aufgaben gilt.",
    "{{player}} is the wheel's unlucky one and drinks 2 sips. In return, they set a new rule that lasts for three tasks.",
  ),
  chaos(
    'double',
    "{{player}}, Doppelt oder nichts: Sag voraus, ob in der nächsten Aufgabe ein Name vorkommt. Liegst du richtig, verteilst du {{sips}} Schlucke, sonst trinkst du {{sips}}.",
    "{{player}}, double or nothing: predict whether the next task will mention a name. Get it right and you hand out {{sips}} sips, otherwise you drink {{sips}}.",
  ),
  chaos(
    'double',
    "{{player}}, Doppelt oder nichts: Du und {{player}} sagt auf drei gleichzeitig eine Zahl von 1 bis 10. Liegen die Zahlen höchstens 1 auseinander, verteilt ihr beide 5 Schlucke, sonst trinkst du 5.",
    "{{player}}, double or nothing: you and {{player}} both say a number from 1 to 10 on three. If they're at most 1 apart, you both hand out 5 sips, otherwise you drink 5.",
  ),
  chaos(
    'timer',
    "Alle tauschen die Plätze, bis die Zeit abläuft, und jeder muss danach neben jemand Neuem sitzen. Wer wieder neben derselben Person landet, trinkt 2 Schlucke.",
    "Everyone swaps seats before time runs out and has to end up next to someone new. Anyone back next to the same person drinks 2 sips.",
    { seconds: 30 },
  ),
  chaos(
    'timer',
    "Alle reden gleichzeitig über ihr Lieblingsessen, bis die Zeit abläuft. Wer zuerst aufhört oder lacht, trinkt {{sips}} Schlucke.",
    "Everyone talks about their favorite food at the same time until time runs out. First to stop or laugh drinks {{sips}} sips.",
    { seconds: 20 },
  ),
  chaos(
    'group',
    "Alle stehen auf, drehen sich einmal um die eigene Achse und setzen sich wieder. Wer zuletzt sitzt, trinkt {{sips}} Schlucke.",
    "Everyone stands up, spins around once and sits back down. Last one seated drinks {{sips}} sips.",
  ),
  chaos(
    'group',
    "Alle, die gerade unter einer Regel oder einem Fluch stehen, trinken {{sips}} Schlucke. Wer frei ist, verteilt 1 Schluck.",
    "Everyone currently under a rule or a curse drinks {{sips}} sips. Anyone who's free hands out 1 sip.",
  ),
];

const wildSpecials: SpecialTask[] = [
  wild(
    'timer',
    "{{player}}, halte eine flammende Wahlkampfrede, warum du die beste Person am Tisch bist. Applaudiert danach die Mehrheit, verteilst du 5 Schlucke, sonst trinkst du 3.",
    "{{player}}, give a fiery campaign speech on why you're the best person at this table. If most people applaud after, hand out 5 sips, otherwise drink 3.",
    { seconds: 30 },
  ),
  wild(
    'timer',
    "{{player}}, zähl so viele Ausreden auf, warum du morgen nicht zur Arbeit oder Uni kannst. Sind es weniger als 5, trinkst du {{sips}} Schlucke, sonst verteilst du sie.",
    "{{player}}, list as many excuses as you can for skipping work or class tomorrow. Fewer than 5 and you drink {{sips}} sips, otherwise you hand them out.",
    { seconds: 20 },
  ),
  wild(
    'timer',
    "{{player}} und {{player}}, spielt eine Seifenoper über die verbotene Liebe zwischen Toaster und Kühlschrank, bis die Zeit abläuft. Wer zuerst lacht, trinkt 4 Schlucke.",
    "{{player}} and {{player}}, act out a soap opera about the forbidden love between a toaster and a fridge until time runs out. First to laugh drinks 4 sips.",
    { seconds: 45 },
  ),
  wild(
    'timer',
    "{{player}}, nenne so viele Länder, in denen du schon warst, wie möglich. Pro Land verteilst du 1 Schluck. Schaffst du keine 3, trinkst du {{sips}}.",
    "{{player}}, name as many countries you've been to as you can. Hand out 1 sip per country. Fewer than 3 and you drink {{sips}}.",
    { seconds: 15 },
  ),
  wild(
    'timer',
    "Alle bleiben still, bis die Zeit abläuft. Nur {{player}} darf alles tun, um die anderen zum Lachen zu bringen, ohne jemanden anzufassen. Wer lacht, trinkt {{sips}} Schlucke.",
    "Everyone stays silent until time runs out. Only {{player}} may do anything to make the others laugh, without touching anyone. Whoever laughs drinks {{sips}} sips.",
    { seconds: 60 },
  ),
  wild(
    'roulette',
    "Das Roulette hat {{player}} gewählt: Diese Person zeigt der Runde ihre letzte Suchanfrage oder trinkt {{sips}} Schlucke.",
    "The wheel picked {{player}}: show the group your most recent search or drink {{sips}} sips.",
  ),
  wild(
    'roulette',
    "{{player}} wurde ausgelost, bestimmt jemanden, der 5 Schlucke trinkt, und trinkt danach selbst 2.",
    "{{player}} got picked, chooses someone to drink 5 sips and then drinks 2 themselves.",
  ),
  wild(
    'roulette',
    "Das Roulette zeigt auf {{player}}: Diese Person gibt der Runde einen harmlosen Befehl, den alle sofort ausführen. Wer sich weigert, trinkt 4 Schlucke.",
    "The wheel lands on {{player}}: give the group a harmless command that everyone carries out right away. Anyone who refuses drinks 4 sips.",
  ),
  wild(
    'roulette',
    "{{player}} wurde gezogen und denkt sich eine harmlose Mutprobe für jemanden aus. Wird sie verweigert, trinkt die gewählte Person 5 Schlucke.",
    "{{player}} got picked and comes up with a harmless dare for someone. If they refuse, they drink 5 sips.",
  ),
  wild(
    'roulette',
    "Das Roulette hat {{player}} getroffen: Diese Person ruft eine Eigenschaft aus, und alle, auf die sie zutrifft, trinken 3 Schlucke. Trifft sie auf niemanden zu, trinkt die Person selbst 5.",
    "The wheel hit {{player}}: call out a trait, and everyone it applies to drinks 3 sips. If it fits nobody, you drink 5 yourself.",
  ),
  wild(
    'double',
    "{{player}}, Doppelt oder nichts: Errätst du den Geburtsmonat von {{player}}, verteilst du 8 Schlucke, sonst trinkst du 4.",
    "{{player}}, double or nothing: guess {{player}}'s birth month and you hand out 8 sips, otherwise you drink 4.",
  ),
  wild(
    'double',
    "{{player}}, Doppelt oder nichts: {{player}} denkt sich eine Zahl von 1 bis 10 und du hast zwei Versuche. Triffst du, trinkt dein Gegenüber 6 Schlucke, sonst trinkst du 6.",
    "{{player}}, double or nothing: {{player}} picks a number from 1 to 10 and you get two guesses. Hit it and your opponent drinks 6 sips, otherwise you drink 6.",
  ),
  wild(
    'double',
    "{{player}}, Doppelt oder nichts: Wer hat gerade mehr im Glas, {{player}} oder {{player}}? Liegst du richtig, verteilst du 6 Schlucke, sonst trinkst du 6.",
    "{{player}}, double or nothing: who has more in their glass right now, {{player}} or {{player}}? Get it right and you hand out 6 sips, otherwise you drink 6.",
  ),
  wild(
    'double',
    "{{player}}, Doppelt oder nichts: Wirf eine Münze. Bei Kopf verteilst du 10 Schlucke, bei Zahl trinkst du 5.",
    "{{player}}, double or nothing: flip a coin. Heads and you hand out 10 sips, tails and you drink 5.",
  ),
  wild(
    'double',
    "{{player}}, Doppelt oder nichts: Wette, dass du 10 Sekunden ernst bleibst, während {{player}} dich zum Lachen bringen will. Schaffst du es, verteilst du 8 Schlucke, sonst trinkst du 4.",
    "{{player}}, double or nothing: bet you can keep a straight face for 10 seconds while {{player}} tries to crack you up. Make it and you hand out 8 sips, otherwise you drink 4.",
  ),
  wild(
    'double',
    "{{player}}, Doppelt oder nichts: Trink jetzt {{sips}} Schlucke und rate dann, ob {{player}} heute schon mehr als 3 Drinks hatte. Richtig, verteilst du doppelt so viele. Falsch, trinkst du sie noch einmal.",
    "{{player}}, double or nothing: drink {{sips}} sips now, then guess whether {{player}} has had more than 3 drinks today. Right and you hand out double that. Wrong and you drink them again.",
  ),
  wild(
    'rule',
    "Wer trinken muss, trinkt 1 Schluck mehr als angesagt.",
    "Whoever has to drink takes 1 more sip than called for.",
    {
      rounds: 5,
      endContent: "Ab jetzt zählen die Schlucke wieder normal.",
      endContentEn: "Sips count normally again.",
    },
  ),
  wild(
    'rule',
    "Wer bei einer Aufgabe kneift, trinkt die doppelte Strafe.",
    "Anyone who chickens out of a task drinks double the penalty.",
    {
      rounds: 4,
      endContent: "Kneifen kostet wieder nur die normale Strafe.",
      endContentEn: "Chickening out costs the normal penalty again.",
    },
  ),
  wild(
    'rule',
    "Jedes Mal, wenn jemand flucht, trinken alle anderen 1 Schluck auf diese Person.",
    "Every time someone swears, everyone else drinks 1 sip in their honor.",
    {
      rounds: 6,
      endContent: "Fluchen ist wieder gratis.",
      endContentEn: "Swearing is free again.",
    },
  ),
  wild(
    'rule',
    "Bevor eine neue Aufgabe vorgelesen wird, stoßen alle an und trinken 1 Schluck.",
    "Before each new task is read out, everyone clinks glasses and drinks 1 sip.",
    {
      rounds: 3,
      endContent: "Die Anstoß-Regel ist vorbei.",
      endContentEn: "The toast rule is over.",
    },
  ),
  wild(
    'curse',
    "{{player}} trinkt bei jeder Aufgabe 1 Schluck mit, egal wen sie trifft.",
    "{{player}} drinks 1 sip along with every task, no matter who it hits.",
    {
      rounds: 4,
      endContent: "Der Mittrink-Fluch ist gebrochen.",
      endContentEn: "The drink-along curse is broken.",
    },
  ),
  wild(
    'curse',
    "{{player}} ist der Blitzableiter: Wenn jemand Schlucke verteilt, muss mindestens 1 davon an diese Person gehen.",
    "{{player}} is the lightning rod: whenever someone hands out sips, at least 1 of them has to go to them.",
    {
      rounds: 5,
      endContent: "Der Blitzableiter ist abgebaut.",
      endContentEn: "The lightning rod has been taken down.",
    },
  ),
  wild(
    'curse',
    "{{player}} muss vor jedem Satz um Sprecherlaubnis bitten. Wer gefragt wird, entscheidet. Ohne Erlaubnis zu sprechen kostet 2 Schlucke.",
    "{{player}} has to ask permission before every sentence. Whoever is asked decides. Speaking without permission costs 2 sips.",
    {
      rounds: 6,
      endContent: "Die Redefreiheit ist zurück.",
      endContentEn: "Free speech is back.",
    },
  ),
  wild(
    'curse',
    "{{player}} kommentiert jede Aufgabe wie ein Sportreporter im Finale. Jeder verpasste Kommentar kostet 2 Schlucke.",
    "{{player}} commentates every task like a sports announcer at a final. Every missed commentary costs 2 sips.",
    {
      rounds: 3,
      endContent: "Die Übertragung ist beendet.",
      endContentEn: "The broadcast has ended.",
    },
  ),
  wild(
    'versus',
    "{{player}} gegen {{player}}: Überbietet euch abwechselnd, wie viele Tiere mit A ihr nennen könnt. Wer das letzte Gebot nicht schafft, trinkt so viele Schlucke wie geboten.",
    "{{player}} vs. {{player}}: Take turns bidding how many animals starting with A you can name. Whoever can't deliver on the last bid drinks that many sips.",
  ),
  wild(
    'versus',
    "{{player}} gegen {{player}}: Haltet Blickkontakt und sagt euch dabei abwechselnd nette Dinge. Wer zuerst wegschaut oder lacht, trinkt 4 Schlucke.",
    "{{player}} vs. {{player}}: Hold eye contact while taking turns saying nice things to each other. First to look away or laugh drinks 4 sips.",
  ),
  wild(
    'versus',
    "{{player}} gegen {{player}}: Jeder hat einen Satz, um die Runde zu überzeugen, warum der andere trinken sollte. Die Runde stimmt ab. Wer verliert, trinkt 5 Schlucke.",
    "{{player}} vs. {{player}}: Each of you gets one sentence to convince the group why the other should drink. The group votes. The loser drinks 5 sips.",
  ),
  wild(
    'versus',
    "{{player}} gegen {{player}}: Schere, Stein, Papier, bis jemand drei Runden gewonnen hat. Jede verlorene Runde kostet 1 Schluck, wer das ganze Match verliert, trinkt zusätzlich {{sips}}.",
    "{{player}} vs. {{player}}: Rock, paper, scissors until someone wins three rounds. Every lost round costs 1 sip, and the match loser drinks {{sips}} more.",
  ),
  wild(
    'vote',
    "Wer würde am ehesten spontan nach Las Vegas fliegen und verheiratet zurückkommen? Auf drei zeigen alle. Wer gewählt wird, trinkt {{sips}} Schlucke.",
    "Who is most likely to fly to Vegas on a whim and come back married? Everyone points on three. Whoever gets picked drinks {{sips}} sips.",
  ),
  wild(
    'vote',
    "Wer schreibt heute Nacht am ehesten noch dem Ex? Auf drei zeigen alle. Wer gewählt wird, trinkt 4 Schlucke.",
    "Who is most likely to text their ex tonight? Everyone points on three. Whoever gets picked drinks 4 sips.",
  ),
  wild(
    'vote',
    "Wer hat das wildeste Leben, von dem wir nichts wissen? Auf drei zeigen alle. Wer gewählt wird, trinkt {{sips}} Schlucke.",
    "Who has the wildest secret life we know nothing about? Everyone points on three. Whoever gets picked drinks {{sips}} sips.",
  ),
  wild(
    'vote',
    "Wer würde für 1000 Euro eine Woche ganz ohne Handy leben? Alle, die es tun würden, heben die Hand. Die Minderheit trinkt {{sips}} Schlucke.",
    "Who would live without a phone for a week for 1,000 dollars? Everyone who would, raise your hand. The minority drinks {{sips}} sips.",
  ),
  wild(
    'never',
    "eine Party verlassen, ohne mich von irgendwem zu verabschieden. Wer schon, trinkt {{sips}} Schlucke.",
    "left a party without saying goodbye to anyone. If you have, drink {{sips}} sips.",
  ),
  wild(
    'never',
    "jemandem absichtlich eine falsche Telefonnummer gegeben. Wer schon, trinkt {{sips}} Schlucke.",
    "given someone a fake phone number on purpose. If you have, drink {{sips}} sips.",
  ),
  wild(
    'never',
    "mit jemandem bis zum Sonnenaufgang geredet, den ich erst am selben Abend kennengelernt habe. Wer schon, trinkt 4 Schlucke.",
    "talked until sunrise with someone I'd only met that night. If you have, drink 4 sips.",
  ),
  wild(
    'never',
    "mich an einen Abend nur noch durch die Fotos von anderen erinnert. Wer schon, trinkt {{sips}} Schlucke.",
    "only remembered a night thanks to other people's photos. If you have, drink {{sips}} sips.",
  ),
  wild(
    'question',
    "{{player}}, was ist das Verrückteste, das du je aus Liebe getan hast? Erzähl es oder trink 4 Schlucke.",
    "{{player}}, what's the craziest thing you've ever done for love? Tell us or drink 4 sips.",
  ),
  wild(
    'question',
    "{{player}}, welche Regel deiner Eltern hast du am häufigsten gebrochen? Antworte ehrlich oder trink {{sips}} Schlucke.",
    "{{player}}, which of your parents' rules did you break most often? Answer honestly or drink {{sips}} sips.",
  ),
  wild(
    'group',
    "Alle, die nach einer Party schon mal etwas bereut haben, das sie dort angefangen haben, trinken 4 Schlucke.",
    "Everyone who has ever regretted something they started at a party drinks 4 sips.",
  ),
  wild(
    'group',
    "Alle stoßen an und trinken {{sips}} Schlucke. Wer das Glas zuerst wieder abstellt, verteilt 2.",
    "Everyone clinks glasses and drinks {{sips}} sips. First to put their glass down hands out 2.",
  ),
];

const sexualSpecials: SpecialTask[] = [
  sexual(
    'never',
    "jemanden nur wegen der Stimme attraktiv gefunden. Wer schon, trinkt {{sips}} Schlucke.",
    "found someone attractive just because of their voice. If you have, drink {{sips}} sips.",
  ),
  sexual(
    'never',
    "ein Date gehabt, das erst am nächsten Morgen zu Ende war. Wer schon, trinkt {{sips}} Schlucke.",
    "been on a date that didn't end until the next morning. If you have, drink {{sips}} sips.",
  ),
  sexual(
    'never',
    "in einer Dating-App nach rechts gewischt, nur wegen eines Hundes auf dem Foto. Wer schon, trinkt 2 Schlucke.",
    "swiped right on a dating app just because of a dog in the photo. If you have, drink 2 sips.",
  ),
  sexual(
    'never',
    "eine Flirtnachricht stundenlang umgeschrieben, bevor ich sie abgeschickt habe. Wer schon, trinkt 2 Schlucke.",
    "rewritten a flirty text for hours before sending it. If you have, drink 2 sips.",
  ),
  sexual(
    'never',
    "nach einem Date sofort jemandem alles haarklein erzählt. Wer schon, trinkt {{sips}} Schlucke.",
    "told a friend every last detail right after a date. If you have, drink {{sips}} sips.",
  ),
  sexual(
    'never',
    "ein Outfit nur angezogen, weil ich wusste, dass mein Crush auch kommt. Wer schon, trinkt 2 Schlucke.",
    "picked an outfit only because I knew my crush would be there. If you have, drink 2 sips.",
  ),
  sexual(
    'never',
    "jemanden geküsst, nur um eine andere Person eifersüchtig zu machen. Wer schon, trinkt 3 Schlucke.",
    "kissed someone just to make someone else jealous. If you have, drink 3 sips.",
  ),
  sexual(
    'question',
    "{{player}}, was ist für dich der größte Abtörner bei einem Date? Antworte oder trink 2 Schlucke.",
    "{{player}}, what's the biggest turn-off on a date for you? Answer or drink 2 sips.",
  ),
  sexual(
    'question',
    "{{player}}, wo war der ungewöhnlichste Ort, an dem du jemanden geküsst hast? Antworte ehrlich oder trink {{sips}} Schlucke.",
    "{{player}}, where's the strangest place you've ever kissed someone? Answer honestly or drink {{sips}} sips.",
  ),
  sexual(
    'question',
    "{{player}}, wo schaust du bei anderen heimlich zuerst hin? Antworte oder trink 3 Schlucke.",
    "{{player}}, where do your eyes secretly go first when you check someone out? Answer or drink 3 sips.",
  ),
  sexual(
    'question',
    "{{player}}, wie viele Dates braucht es bei dir bis zum ersten Kuss? Antworte oder trink 2 Schlucke.",
    "{{player}}, how many dates does it take you to get to the first kiss? Answer or drink 2 sips.",
  ),
  sexual(
    'question',
    "{{player}}, was war das romantischste Date deines Lebens? Erzähl es oder trink {{sips}} Schlucke.",
    "{{player}}, what was the most romantic date of your life? Tell us or drink {{sips}} sips.",
  ),
  sexual(
    'question',
    "{{player}}, welche Fantasie würdest du erst nach dem dritten Drink zugeben? Verrat sie oder trink 4 Schlucke.",
    "{{player}}, what fantasy would you only admit to after your third drink? Spill it or drink 4 sips.",
  ),
  sexual(
    'vote',
    "Wer hat in dieser Runde den besten Flirtblick? Auf drei zeigen alle. Wer gewählt wird, zeigt ihn kurz oder trinkt 2 Schlucke.",
    "Who has the best flirty look in this group? Everyone points on three. Whoever gets picked shows it off or drinks 2 sips.",
  ),
  sexual(
    'vote',
    "Wer hat die meisten Dates im Jahr? Auf drei zeigen alle. Wer gewählt wird, trinkt {{sips}} Schlucke.",
    "Who goes on the most dates a year? Everyone points on three. Whoever gets picked drinks {{sips}} sips.",
  ),
  sexual(
    'vote',
    "Wer würde am ehesten bei einer Datingshow im Fernsehen mitmachen? Auf drei zeigen alle. Wer gewählt wird, trinkt {{sips}} Schlucke.",
    "Who is most likely to go on a TV dating show? Everyone points on three. Whoever gets picked drinks {{sips}} sips.",
  ),
  sexual(
    'vote',
    "Wer ist hier der heimliche Romantiker? Auf drei zeigen alle. Wer gewählt wird, verteilt 3 Schlucke.",
    "Who is the secret romantic here? Everyone points on three. Whoever gets picked hands out 3 sips.",
  ),
  sexual(
    'vote',
    "Wer sagt in einer Beziehung am ehesten zuerst \"Ich liebe dich\"? Auf drei zeigen alle. Wer gewählt wird, trinkt 2 Schlucke.",
    "Who is most likely to say \"I love you\" first in a relationship? Everyone points on three. Whoever gets picked drinks 2 sips.",
  ),
  sexual(
    'timer',
    "{{player}}, nenne so viele romantische Filme wie möglich. Pro Film verteilst du 1 Schluck.",
    "{{player}}, name as many romantic movies as you can. Hand out 1 sip for each one.",
    { seconds: 20 },
  ),
  sexual(
    'timer',
    "{{player}}, flirte mit dem Gegenstand, der dir am nächsten liegt, bis die Zeit abläuft. Lacht jemand, verteilst du {{sips}} Schlucke. Fällst du aus der Rolle, trinkst du {{sips}}.",
    "{{player}}, flirt with the object closest to you until time runs out. If someone laughs, hand out {{sips}} sips. If you break character, drink {{sips}}.",
    { seconds: 30 },
  ),
  sexual(
    'timer',
    "{{player}} und {{player}}, schaut euch tief in die Augen, bis die Zeit abläuft. Wer zuerst lacht, trinkt 3 Schlucke. Wer nicht mitmachen will, trinkt 2.",
    "{{player}} and {{player}}, gaze deep into each other's eyes until time runs out. First to laugh drinks 3 sips. Anyone who'd rather not drinks 2.",
    { seconds: 30 },
  ),
  sexual(
    'timer',
    "{{player}}, beschreib dein perfektes erstes Date in allen Details. Findet die Runde es überzeugend, verteilst du 3 Schlucke, sonst trinkst du 2.",
    "{{player}}, describe your perfect first date in full detail. If the group is convinced, hand out 3 sips, otherwise drink 2.",
    { seconds: 45 },
  ),
  sexual(
    'roulette',
    "Das Roulette hat {{player}} gewählt: Diese Person macht der rechten Nachbarperson ein ehrliches Kompliment über ihr Aussehen oder trinkt {{sips}} Schlucke.",
    "The wheel picked {{player}}: give the person on your right an honest compliment about their looks or drink {{sips}} sips.",
  ),
  sexual(
    'roulette',
    "Das Roulette zeigt auf {{player}}: Diese Person sucht sich jemanden aus, der ihr einen Anmachspruch sagen muss. Wer sich weigert, trinkt 3 Schlucke.",
    "The wheel lands on {{player}}: pick someone who has to deliver a pickup line to you. If they refuse, they drink 3 sips.",
  ),
  sexual(
    'roulette',
    "{{player}} wurde gezogen und darf jemanden zu einem langsamen Tanz auffordern. Wer nicht möchte, trinkt stattdessen 2 Schlucke.",
    "{{player}} got picked and can ask someone for a slow dance. Anyone who'd rather not drinks 2 sips instead.",
  ),
  sexual(
    'roulette',
    "Das Roulette hat {{player}} erwischt: Diese Person verrät, wen hier sie zuerst angesprochen hätte, wenn alle sich gerade in einer Bar kennenlernen würden, oder trinkt {{sips}} Schlucke.",
    "The wheel caught {{player}}: reveal who here you'd have approached first if you were all meeting in a bar tonight, or drink {{sips}} sips.",
  ),
  sexual(
    'double',
    "{{player}}, Doppelt oder nichts: Errate, wie {{player}} am liebsten flirtet: mit Blicken, Sprüchen oder Nachrichten. Richtig, verteilst du 6 Schlucke. Falsch, trinkst du 3.",
    "{{player}}, double or nothing: guess how {{player}} likes to flirt best: glances, lines or texts. Right and you hand out 6 sips. Wrong and you drink 3.",
  ),
  sexual(
    'double',
    "{{player}}, Doppelt oder nichts: Wette, dass {{player}} bei deinem besten Anmachspruch rot wird oder lacht. Passiert es, verteilst du {{sips}} Schlucke, sonst trinkst du {{sips}}.",
    "{{player}}, double or nothing: bet that {{player}} blushes or laughs at your best pickup line. If they do, hand out {{sips}} sips, otherwise drink {{sips}}.",
  ),
  sexual(
    'double',
    "{{player}}, Doppelt oder nichts: Schätz auf ein Jahr genau, wie alt {{player}} beim ersten Kuss war. Richtig, verteilst du 8 Schlucke. Falsch, trinkst du 4. Wer nicht antworten will, trinkt 2.",
    "{{player}}, double or nothing: guess within a year how old {{player}} was at their first kiss. Right and you hand out 8 sips. Wrong and you drink 4. Anyone who'd rather not answer drinks 2.",
  ),
  sexual(
    'rule',
    "Wer trinkt, zwinkert vorher jemandem am Tisch zu. Wer es vergisst, trinkt 1 Schluck extra.",
    "Before you drink, wink at someone at the table. Forget and you drink 1 extra sip.",
    {
      rounds: 5,
      endContent: "Ihr dürft wieder ohne Zwinkern trinken.",
      endContentEn: "You can drink without winking again.",
    },
  ),
  sexual(
    'rule',
    "Alle sprechen nur noch mit verführerischer Stimme. Wer normal redet, trinkt 1 Schluck.",
    "Everyone speaks only in a seductive voice. Talk normally and you drink 1 sip.",
    {
      rounds: 4,
      endContent: "Die verführerischen Stimmen haben Pause.",
      endContentEn: "The seductive voices can take a break.",
    },
  ),
  sexual(
    'rule',
    "Jede Antwort muss ein Kompliment an die Person enthalten, die gefragt hat. Wer es vergisst, trinkt 1 Schluck.",
    "Every answer has to include a compliment for whoever asked. Forget and you drink 1 sip.",
    {
      rounds: 6,
      endContent: "Die Komplimente-Regel ist vorbei.",
      endContentEn: "The compliment rule is over.",
    },
  ),
  sexual(
    'curse',
    "{{player}} darf nur noch in Anmachsprüchen reden. Jeder normale Satz kostet 1 Schluck.",
    "{{player}} may only speak in pickup lines. Every normal sentence costs 1 sip.",
    {
      rounds: 4,
      endContent: "Der Anmachspruch-Fluch ist vorbei.",
      endContentEn: "The pickup line curse is over.",
    },
  ),
  sexual(
    'curse',
    "{{player}} darf nur mit Zeilen aus Liebesfilmen oder Liebesliedern antworten. Jede normale Antwort kostet 1 Schluck.",
    "{{player}} may only answer with lines from love songs or romantic movies. Every normal answer costs 1 sip.",
    {
      rounds: 5,
      endContent: "Der Romantik-Fluch ist vorbei.",
      endContentEn: "The romance curse is over.",
    },
  ),
  sexual(
    'curse',
    "{{player}} muss alle, die gerade sprechen, verträumt anschauen. Wer diese Person beim Wegschauen erwischt, darf ihr 1 Schluck geben.",
    "{{player}} has to gaze dreamily at whoever is talking. Catch them looking away and you can give them 1 sip.",
    {
      rounds: 3,
      endContent: "Der verträumte Blick darf sich erholen.",
      endContentEn: "The dreamy gaze can rest now.",
    },
  ),
  sexual(
    'versus',
    "{{player}} gegen {{player}}: Sagt euch abwechselnd Anmachsprüche, bis jemand lacht. Wer zuerst lacht, trinkt {{sips}} Schlucke.",
    "{{player}} vs. {{player}}: Take turns hitting each other with pickup lines until someone laughs. First to laugh drinks {{sips}} sips.",
  ),
  sexual(
    'versus',
    "{{player}} gegen {{player}}: Haltet abwechselnd die kitschigste Liebeserklärung an die ganze Runde. Die Runde entscheidet per Applaus. Wer verliert, trinkt 3 Schlucke.",
    "{{player}} vs. {{player}}: Take turns giving the cheesiest declaration of love to the whole group. The group decides by applause. The loser drinks 3 sips.",
  ),
  sexual(
    'versus',
    "{{player}} gegen {{player}}: Wer spricht das Wort \"Erdbeere\" verführerischer aus? Die Runde entscheidet. Wer verliert, trinkt 2 Schlucke.",
    "{{player}} vs. {{player}}: Who can say the word \"strawberry\" more seductively? The group decides. The loser drinks 2 sips.",
  ),
  sexual(
    'group',
    "Alle, die gerade verliebt sind, trinken {{sips}} Schlucke.",
    "Everyone who is in love right now drinks {{sips}} sips.",
  ),
  sexual(
    'group',
    "Alle, die schon mal ein Date mit jemandem aus dieser Runde hatten, trinken {{sips}} Schlucke.",
    "Everyone who has ever been on a date with someone in this group drinks {{sips}} sips.",
  ),
];

export const specialTasks: SpecialTask[] = [
  ...normalSpecials,
  ...partySpecials,
  ...duellSpecials,
  ...wahrheitSpecials,
  ...chaosSpecials,
  ...wildSpecials,
  ...sexualSpecials,
];
