'use client';

import { getErrorMessage } from '@/util/error';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorMessage = getErrorMessage(error);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-purple-900 to-gray-900 rounded-2xl shadow-2xl p-8 border-none">
          <h1 className="text-center text-3xl font-extrabold text-red-200 mb-4 drop-shadow-lg">
            Something went wrong
          </h1>
          <div className="p-4 mb-6">
            <p className="text-red-100 text-center">{errorMessage}</p>
          </div>
          <button
            className="w-full py-2 px-4 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition-colors"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
