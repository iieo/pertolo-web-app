import { db } from '@/db';
import { drinkCategoryTable, drinkTaskTable } from '@/db/schema';
import { DefaultTask } from '@/types/task';
import { exit } from 'process';

const defaultTasks: DefaultTask[] = [
  {
    type: 'default',
    content:
      '{{player}} muss entscheiden. Wer von {{player}} und {{player}} am ehesten berühmt wird. Derjenige verteilt 3 Schlucke.',
  },
];

async function importData() {
  const gameMode = {
    name: 'Normal',
    description: 'Standartaufgaben',
  };

  const gameModeRow = (await db.insert(drinkCategoryTable).values(gameMode).returning())[0];

  if (!gameModeRow) {
    console.error('Failed to insert game mode');
    return;
  }

  await db.insert(drinkTaskTable).values(
    defaultTasks.map((content) => {
      return {
        content: content,
        categoryId: gameModeRow.id,
      };
    }),
  );

  console.log('Imported default tasks.');
  exit(0);
}

importData();
