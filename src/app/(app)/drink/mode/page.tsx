import { getGameModes } from './actions';
import CategoryPicker from './category-picker';

export const dynamic = 'force-dynamic';

export default async function GameModeScreen() {
  const result = await getGameModes();

  return (
    <CategoryPicker
      categories={result.success ? result.data : []}
      loadError={
        !result.success
          ? 'Die Kategorien konnten nicht geladen werden.'
          : result.data.length === 0
            ? 'Keine Kategorien gefunden. Bitte zuerst das Seed-Script ausführen.'
            : null
      }
    />
  );
}
