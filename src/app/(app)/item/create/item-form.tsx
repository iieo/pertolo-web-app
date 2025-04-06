'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addItemAction } from './actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/util/error';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

export default function ItemForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
  });

  const router = useRouter();

  async function onSubmit(data: ItemFormData) {
    try {
      const [item, error] = await addItemAction({
        name: data.name,
        description: data.description ?? '',
      });

      if (error !== undefined) {
        toast.error(error.message);
        return;
      }

      toast.success('Item created successfully');
      router.push(`/item/${item.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <label>Name</label>
      <input {...register('name')} type="text" className="border-2 rounded-md p-2" />
      <span className="text-red-400 text-xs">{errors.name?.message ?? ''}</span>

      <label>Description</label>
      <textarea {...register('description')} className="border-2 rounded-md p-2" />
      <span className="text-red-400 text-xs">{errors.description?.message ?? ''}</span>

      <button type="submit" className="p-2 rounded-md border-2 w-fit self-center bg-slate-300">
        Create Item
      </button>
    </form>
  );
}
