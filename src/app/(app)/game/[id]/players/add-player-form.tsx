'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { dbAddPlayer } from './actions';
import { useRouter } from 'next/navigation';

const AddPlayerFormSchema = z.object({
  hostName: z
    .string()
    .min(1, { message: 'Players name cannot be empty' })
    .max(50, 'Players name max 50 chars'),
});
type AddPlayerFormData = z.infer<typeof AddPlayerFormSchema>;

function AddPlayerForm({ gameId }: { gameId: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors: createErrors },
    reset,
  } = useForm<AddPlayerFormData>({
    resolver: zodResolver(AddPlayerFormSchema),
  });

  async function onSubmit(data: AddPlayerFormData) {
    const name = data.hostName.trim();

    const maybePlayer = await dbAddPlayer(gameId, name);
    if (maybePlayer.success) {
      console.log('Player added successfully:', maybePlayer.data);
      router.refresh();
    } else {
      console.error('Error adding player:', maybePlayer.error);
    }

    reset();
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="hostName">Player Name:</label>
          <input
            type="text"
            id="hostName"
            {...register('hostName')}
            className={`border ${createErrors.hostName ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
          />
          {createErrors.hostName && <p className="text-red-500">{createErrors.hostName.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Player
        </button>
      </form>
    </div>
  );
}

export default AddPlayerForm;
