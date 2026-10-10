'use client';

import { BackLink } from '@/components/game/back-link';
import { SetupScreen, StartButton } from '@/components/game/setup';

const RULES = [
  'Der aktuelle Spieler hält das Handy und liest das angezeigte Wort laut für die Gruppe vor.',
  'Dann tippt er auf den Bildschirm und liest sein Ergebnis heimlich. Die Gruppe darf es nicht sehen.',
  'Bei Wahrheit liest er die echte Bedeutung selbstbewusst vor.',
  'Bei Bluff erfindet er spontan eine überzeugende, falsche Bedeutung.',
  'Die Gruppe stimmt ab: Wahrheit oder Bluff? Liegt sie falsch, gewinnt der Spieler die Runde.',
  'Ein weiteres Tippen zeigt das nächste Wort.',
];

export function StartPhase({ onStart }: { onStart: () => void }) {
  return (
    <SetupScreen
      title="Bluff"
      subtitle="Wahrheit oder Bluff: Erkennen deine Freunde den Unterschied?"
      back={<BackLink locale="de" />}
      footer={
        <StartButton
          label="Starten"
          onClick={() => {
            onStart();
          }}
        />
      }
    >
      <section className="flex flex-col gap-4" aria-labelledby="rules-heading">
        <h2 id="rules-heading" className="text-base font-semibold text-white/60 md:text-lg">
          Spielregeln
        </h2>
        <ol className="flex max-w-2xl list-decimal flex-col gap-4 pl-6 text-base leading-relaxed text-white/80 md:text-lg">
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </section>
    </SetupScreen>
  );
}
