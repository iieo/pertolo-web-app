'use client';

import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';

import { BackLink } from '@/components/game/back-link';
import { focusRingClass } from '@/components/game/page-shell';
import {
  CategoryTile,
  RulesLink,
  SegmentedControl,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';
import { cn } from '@/lib/utils';

import { useGame } from '../game-provider';
import { categoryColor, RANDOM_COLOR } from '../palette';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 20;

const RULES = [
  'Everyone gets the same secret word, except the imposters.',
  'Pass the phone around. Each player taps to see their word in private, then taps again to hide it and hands the phone on.',
  'Take turns saying one word that fits the secret word. Do not make it too obvious.',
  'Imposters do not know the word. They have to blend in and guess it from the clues.',
  'Discuss and vote on who the imposter is.',
];

const IMPOSTER_OPTIONS = ['1', '2', '3'].map((value) => ({ value, label: value }));

const SHOW_CATEGORY_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
] as const;

export const SetupPhase = () => {
  const { gameState, setGameState, categories, loading, error, setPlayerCount, startGame } =
    useGame();

  const playerCount = gameState.players.length;
  const imposters = gameState.imposterCount;
  const civilians = playerCount - imposters;
  const showCategory = gameState.showCategoryToImposter ?? false;

  return (
    <SetupScreen
      title="Imposter"
      subtitle="Everyone shares a secret word. Except the imposters."
      back={<BackLink locale="en" />}
      rules={
        <RulesLink
          label="Rules"
          title="How to play"
          rules={RULES}
          confirmLabel="Got it"
          lang="en"
        />
      }
      settings={
        <SettingsSection>
          <PlayerStepper count={playerCount} onChange={setPlayerCount} />
          <SegmentedControl
            label="Imposters"
            value={String(imposters)}
            options={IMPOSTER_OPTIONS}
            onChange={(value) =>
              setGameState((prev) => ({ ...prev, imposterCount: Number(value) }))
            }
          />
          <SegmentedControl
            label="Show category to imposters"
            description="Makes it easier for imposters to blend in."
            value={showCategory ? 'on' : 'off'}
            options={SHOW_CATEGORY_OPTIONS}
            onChange={(value) =>
              setGameState((prev) => ({ ...prev, showCategoryToImposter: value === 'on' }))
            }
          />
        </SettingsSection>
      }
      footer={
        <div className="flex flex-col gap-4">
          {error && (
            <p role="alert" className="text-base font-medium text-white">
              {error}
            </p>
          )}
          <StartButton
            label={loading ? 'Starting…' : 'Start'}
            detail={`${imposters} ${imposters === 1 ? 'imposter' : 'imposters'}, ${civilians} ${
              civilians === 1 ? 'civilian' : 'civilians'
            }`}
            disabled={loading || playerCount < MIN_PLAYERS}
            onClick={() => {
              startGame();
            }}
          />
        </div>
      }
    >
      <section aria-label="Word category" className="flex flex-col">
        <CategoryTile
          name="Random"
          description="A random word pack is picked for you."
          color={RANDOM_COLOR}
          featured
          selected={!gameState.selectedCategoryId}
          onClick={() => setGameState((prev) => ({ ...prev, selectedCategoryId: null }))}
        />
        {categories.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {categories.map((category, i) => (
              <CategoryTile
                key={category.id}
                name={category.name}
                description={category.description ?? undefined}
                color={categoryColor(i)}
                selected={gameState.selectedCategoryId === category.id}
                onClick={() =>
                  setGameState((prev) => ({ ...prev, selectedCategoryId: category.id }))
                }
              />
            ))}
          </div>
        )}
      </section>
    </SetupScreen>
  );
};

function PlayerStepper({ count, onChange }: { count: number; onChange: (count: number) => void }) {
  const labelId = useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/15 py-4"
    >
      <span id={labelId} className="text-base font-semibold md:text-lg">
        Players
      </span>
      <div className="flex items-center gap-2">
        <StepButton
          label="Fewer players"
          disabled={count <= MIN_PLAYERS}
          onClick={() => onChange(count - 1)}
        >
          <Minus size={20} aria-hidden />
        </StepButton>
        <output
          aria-live="polite"
          className="min-w-[3ch] text-center text-xl font-bold tabular-nums md:text-2xl"
        >
          {count}
        </output>
        <StepButton
          label="More players"
          disabled={count >= MAX_PLAYERS}
          onClick={() => onChange(count + 1)}
        >
          <Plus size={20} aria-hidden />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-11 items-center justify-center rounded-lg border border-white/20 text-white transition-colors duration-150 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none',
        focusRingClass,
      )}
    >
      {children}
    </button>
  );
}
