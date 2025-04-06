import Link from 'next/link';

export default function Home() {
  return (
    <main className="h-full flex flex-col items-center p-4">
      <Link href="/item" className="text-blue-500 hover:underline">
        Go to Item Page
      </Link>
    </main>
  );
}
