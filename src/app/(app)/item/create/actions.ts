'use server';

// TODO: Note that every exported async function marked with 'use server' in this file is a server action and MUST be treated as a publicly exposed API endpoint.
// Therefore you should e.g. NEVER pass a user ID to these functions and insteads use the getUser() function to get the current user.

import { getUserOrRedirect } from '@/auth/utils';
import { db } from '@/db';
import { ItemModel, itemTable } from '@/db/schema';
import { Result } from '@/util/error';

export async function addItemAction({
  name,
  description,
}: {
  name: string;
  description: string;
}): Promise<Result<ItemModel>> {
  const user = await getUserOrRedirect();

  const insertedItems = await db
    .insert(itemTable)
    .values({ name, description, userId: user.id })
    .returning();
  const insertedItem = insertedItems[0];

  if (insertedItem === undefined) {
    return [undefined, new Error('Could not insert the item')];
  }

  return [insertedItem, undefined];
}
