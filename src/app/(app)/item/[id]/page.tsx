import { dbGetItemById } from '@/db/functions/item';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const pageContextSchema = z.object({
  id: z.string().uuid(),
});

export default async function Page({ params }: { params: Promise<unknown> }) {
  const validatedParams = pageContextSchema.parse(await params);
  const item = await dbGetItemById({ itemId: validatedParams.id });

  if (item === undefined) {
    notFound();
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link href="/item" className="text-blue-500 hover:underline">
          Back to Items
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
      <p className="whitespace-pre-wrap">{item.description}</p>
    </div>
  );
}
