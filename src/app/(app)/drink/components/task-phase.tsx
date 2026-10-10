'use client';

import { useDrinkGame } from '../game-provider';
import {
  type CardProps,
  CategoryCard,
  DoubleCard,
  GroupCard,
  NeverCard,
  QuestionCard,
  RuleCard,
  TaskCard,
  VersusCard,
  VoteCard,
} from './cards';
import { RouletteCard } from './roulette-card';
import { TimerCard } from './timer-card';

export function TaskPhase() {
  const { currentCard, currentIndex } = useDrinkGame();
  if (!currentCard) return null;
  // Keyed by position, so timers and the roulette start fresh on every card.
  return <Card key={currentIndex} card={currentCard} index={currentIndex} />;
}

function Card(props: CardProps) {
  switch (props.card.kind) {
    case 'task':
      return <TaskCard {...props} />;
    case 'versus':
      return <VersusCard {...props} />;
    case 'never':
      return <NeverCard {...props} />;
    case 'vote':
      return <VoteCard {...props} />;
    case 'group':
      return <GroupCard {...props} />;
    case 'question':
      return <QuestionCard {...props} />;
    case 'rule':
    case 'curse':
    case 'ruleEnd':
    case 'curseEnd':
      return <RuleCard {...props} />;
    case 'category':
      return <CategoryCard {...props} />;
    case 'timer':
      return <TimerCard {...props} />;
    case 'roulette':
      return <RouletteCard {...props} />;
    case 'double':
      return <DoubleCard {...props} />;
  }
}
