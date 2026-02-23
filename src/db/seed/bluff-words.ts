import { db } from '@/db';
import { bluffWordsTable } from '@/db/schema';
import { exit } from 'process';

const germanBluffWords = [
  {
    word: 'Petrichor',
    pronunciation: 'PE-tri-kor',
    definition: 'Der angenehme, erdige Geruch, der entsteht, wenn Regen auf trockenen Boden fällt.',
  },
  {
    word: 'Borborygmus',
    pronunciation: 'bor-bo-RIG-mus',
    definition:
      'Das grollende oder gurgelnde Geräusch, das durch die Bewegung von Flüssigkeit und Gas im Darm erzeugt wird.',
  },
  {
    word: 'Mumpitz',
    pronunciation: 'MUM-pits',
    definition: 'Unsinn, törichtes Zeug oder eine unsinnige Behauptung.',
  },
  {
    word: 'Klabautermann',
    pronunciation: 'Kla-BAU-ter-mann',
    definition: 'Ein unsichtbarer Schiffsgeist der Seeleuten hilft oder Unheil ankündigt.',
  },
  {
    word: 'Schabracke',
    pronunciation: 'Scha-BRA-cke',
    definition: 'Eine alte, abgenutzte Decke oder (abwertend) eine unansehnliche ältere Frau.',
  },
  {
    word: 'Fisimatenten',
    pronunciation: 'Fi-si-ma-TEN-ten',
    definition: 'Ausflüchte, unnötige Schwierigkeiten oder Umstände.',
  },
  {
    word: 'Papperlapapp',
    pronunciation: 'Pap-per-la-PAPP',
    definition: 'Ausruf der Ablehnung oder des Zweifels; "Unsinn!".',
  },
  {
    word: 'Ohrensessel',
    pronunciation: 'O-HREN-ses-sel',
    definition: 'Ein bequemer, gepolsterter Sessel mit meist ausladenden Wangen im Kopfbereich.',
  },
  {
    word: 'Apricität',
    pronunciation: 'a-pri-tsi-TÄT',
    definition: 'Die Wärme der Sonne an einem kalten Wintertag.',
  },
  {
    word: 'Phosphene',
    pronunciation: 'FOS-fe:ne',
    definition:
      'Die ring- oder sternförmigen Leuchterscheinungen, die man bei geschlossenen Augen sieht, oft durch Druck auf die Augäpfel verursacht.',
  },
  {
    word: 'Limerenz',
    pronunciation: 'LI-me-renz',
    definition:
      'Ein unfreiwilliger Zustand intensiver romantischer Verliebtheit, gekennzeichnet durch obsessives Denken und ein verzweifeltes Bedürfnis nach Gegenliebe.',
  },
  {
    word: 'Smellfungus',
    pronunciation: 'SMEL-fun-gus',
    definition:
      'Jemand, der an allem etwas auszusetzen hat und sich ständig über seine Umgebung beschwert.',
  },
  {
    word: 'Logomachie',
    pronunciation: 'lo-go-ma-CHIE',
    definition:
      'Ein Wortstreit oder eine Debatte, bei der die Streitenden Wörter in verschiedenen Bedeutungen verwenden, ohne es zu merken.',
  },
  {
    word: 'Mumpsimus',
    pronunciation: 'MUMP-si-mus',
    definition:
      'Ein hartnäckiges Festhalten an einem falschen Glauben oder Brauch, selbst nachdem er widerlegt wurde.',
  },
  {
    word: 'Resistentialismus',
    pronunciation: 're-zis-ten-tia-LIS-mus',
    definition:
      'Die Theorie, dass unbelebte Dinge absichtlich Widerstand leisten und gegen Menschen arbeiten.',
  },
  {
    word: 'Acnestis',
    pronunciation: 'ak-NES-tis',
    definition:
      'Der Teil des Rückens zwischen den Schulterblättern, den eine Person nicht erreichen kann, um sich zu kratzen.',
  },
  {
    word: 'Hiraeth',
    pronunciation: 'HIE-raith',
    definition:
      'Ein walisisches Wort für eine tiefe, wehmütige Sehnsucht nach einem Zuhause, in das man nie zurückkehren kann.',
  },
  {
    word: 'Grawlix',
    pronunciation: 'GRAW-liks',
    definition:
      'Die typografischen Symbole (wie @#$%!), die in Comics verwendet werden, um Fluchwörter darzustellen.',
  },
  {
    word: 'Mondegreen',
    pronunciation: 'MON-de-green',
    definition:
      'Eine verhörte oder falsch verstandene Phrase – besonders in Liedtexten – die eine neue, unbeabsichtigte Bedeutung erzeugt.',
  },
];

async function seedBluffWords() {
  await db.insert(bluffWordsTable).values(germanBluffWords);
  console.log('Seeded German bluff words.');
  exit(0);
}

seedBluffWords();
