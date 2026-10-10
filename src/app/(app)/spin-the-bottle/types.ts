export type Mode = 'bottle' | 'picker';

export type PickerSplit = 'winner' | '2' | '3' | '4';

export const MODES: readonly Mode[] = ['bottle', 'picker'];

export const PICKER_SPLITS: readonly PickerSplit[] = ['winner', '2', '3', '4'];

export function teamCount(split: PickerSplit) {
  return split === 'winner' ? 1 : Number(split);
}
