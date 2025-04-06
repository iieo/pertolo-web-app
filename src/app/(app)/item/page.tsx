import { getUserOrRedirect } from '@/auth/utils';
import { dbGetItemsByUserId } from '@/db/functions/item';
import Link from 'next/link';

export default async function ItemPage() {
  const user = await getUserOrRedirect();
  const items = await dbGetItemsByUserId({ userId: user.id });

  return (
    <main className="h-full flex flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Items</h1>
          <Link
            href="/item/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Item
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center">You have not created any items yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Link href={`/item/${item.id}`} key={item.id}>
                <div className="border rounded-lg p-4 shadow-sm">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
