import { db } from '@/db';
import { wavelengthSpectrumsTable } from '@/db/schema';

import { WavelengthClient } from './wavelength-client';

export const dynamic = 'force-dynamic';

export default async function WavelengthGame() {
  const spectrums = await db
    .select({
      id: wavelengthSpectrumsTable.id,
      left: wavelengthSpectrumsTable.left,
      right: wavelengthSpectrumsTable.right,
      leftEn: wavelengthSpectrumsTable.leftEn,
      rightEn: wavelengthSpectrumsTable.rightEn,
      category: wavelengthSpectrumsTable.category,
    })
    .from(wavelengthSpectrumsTable);

  if (spectrums.length === 0) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-black px-6 text-center text-white/70">
        Keine Skalen gefunden. Bitte zuerst das Seed-Script ausführen!
      </div>
    );
  }

  return <WavelengthClient spectrums={spectrums} />;
}
