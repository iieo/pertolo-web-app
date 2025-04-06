import ItemForm from './item-form';
import Link from 'next/link';

export default async function ItemCreatePage() {
  return (
    <main className="h-full flex flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/item" className="text-blue-500 hover:text-blue-600">
            ← Back to Items
          </Link>
        </div>
        <ItemForm />
      </div>
    </main>
  );
}
