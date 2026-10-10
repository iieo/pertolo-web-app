'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { createBet } from '../create/actions';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { UserMultiSelect, UserOption } from './user-multi-select';
import {
  errorClass,
  hintClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './styles';

const createBetSchema = z.object({
  title: z.string().min(3, 'Titel muss mindestens 3 Zeichen lang sein').max(200),
  description: z.string().max(500).optional(),
});

type CreateBetFormData = z.infer<typeof createBetSchema>;

const VISIBILITY = [
  {
    value: false,
    label: 'Öffentlich',
    description: 'Alle sehen die Wette, außer du schließt jemanden aus.',
  },
  { value: true, label: 'Privat', description: 'Nur Personen, die du auswählst, sehen die Wette.' },
];

export function CreateBetForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(['', '']);
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBetFormData>({
    resolver: zodResolver(createBetSchema),
  });

  function addOption() {
    if (options.length >= 10) return;
    setOptions([...options, '']);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  }

  function updateOption(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  async function onSubmit(data: CreateBetFormData) {
    const filledOptions = options.filter((o) => o.trim());
    if (filledOptions.length < 2) {
      toast.error('Mindestens 2 Optionen erforderlich');
      return;
    }

    setLoading(true);
    try {
      const visibility = isPrivate ? ('private' as const) : ('public' as const);
      const userIds = selectedUsers.map((u) => u.id);

      const requestData: Parameters<typeof createBet>[0] = {
        title: data.title,
        description: data.description,
        options: filledOptions,
        visibility,
      };

      if (isPrivate) {
        requestData.allowedUserIds = userIds;
      } else {
        requestData.blacklistedUserIds = userIds;
      }

      const result = await createBet(requestData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success('Wette erstellt!');
      router.push(`/bet/${result.data.betId}`);
    } catch {
      toast.error('Fehler beim Erstellen der Wette');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className={labelClass}>
          Frage
        </label>
        <input
          id="title"
          placeholder="Regnet es morgen?"
          aria-invalid={!!errors.title}
          className={inputClass}
          {...register('title')}
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className={labelClass}>
          Beschreibung <span className="font-normal text-white/60">(optional)</span>
        </label>
        <input
          id="description"
          placeholder="Zusätzlicher Kontext"
          className={inputClass}
          {...register('description')}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className={cn(labelClass, 'mb-2')}>Optionen</legend>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              aria-label={`Option ${index + 1}`}
              className={inputClass}
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                aria-label={`Option ${index + 1} entfernen`}
                className="flex size-14 shrink-0 items-center justify-center rounded-xl text-white/60 transition-colors duration-150 outline-none hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white motion-reduce:transition-none"
              >
                <X size={20} aria-hidden />
              </button>
            )}
          </div>
        ))}
        {options.length < 10 && (
          <button type="button" onClick={addOption} className={cn(secondaryButtonClass, 'mt-2')}>
            Option hinzufügen
          </button>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className={cn(labelClass, 'mb-2')}>Sichtbarkeit</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {VISIBILITY.map((item) => {
            const selected = isPrivate === item.value;
            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  if (selected) return;
                  setIsPrivate(item.value);
                  setSelectedUsers([]);
                }}
                className={cn(
                  'flex min-h-14 flex-col gap-1 rounded-xl border p-4 text-left transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none',
                  selected
                    ? 'border-[#52B788] bg-[#52B788] text-black'
                    : 'border-white/20 text-white hover:bg-white/10',
                )}
              >
                <span className="text-base font-semibold">{item.label}</span>
                <span className="text-sm leading-snug">{item.description}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <span id="access-label" className={labelClass}>
          {isPrivate ? 'Wer darf die Wette sehen?' : 'Wer darf die Wette nicht sehen?'}
        </span>
        <p className={hintClass}>
          {isPrivate
            ? 'Nur ausgewählte Benutzer können diese Wette sehen und abschließen.'
            : 'Ausgewählte Benutzer können diese Wette nicht sehen. Leer lassen, damit sie für alle sichtbar ist.'}
        </p>
        <div className="mt-2">
          <UserMultiSelect
            selected={selectedUsers}
            onChange={setSelectedUsers}
            placeholder="Benutzer suchen"
            labelledBy="access-label"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? 'Wird erstellt…' : 'Wette erstellen'}
      </button>
    </form>
  );
}
