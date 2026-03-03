'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBet } from '../create/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserMultiSelect, UserOption } from './user-multi-select';

const createBetSchema = z.object({
  title: z.string().min(3, 'Titel muss mindestens 3 Zeichen lang sein').max(200),
  description: z.string().max(500).optional(),
});

type CreateBetFormData = z.infer<typeof createBetSchema>;

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
      const userIds = selectedUsers.map(u => u.id);

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white/70">
          Frage / Titel
        </Label>
        <Input
          id="title"
          placeholder="Regnet es morgen?"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white/70">
          Beschreibung (optional)
        </Label>
        <Input
          id="description"
          placeholder="Zusätzlicher Kontext..."
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...register('description')}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-white/70">Optionen</Label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
                className="shrink-0 text-white/40 hover:text-red-400"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        ))}
        {options.length < 10 && (
          <Button
            type="button"
            variant="ghost"
            onClick={addOption}
            className="w-full border border-dashed border-white/10 text-white/40 hover:text-white/70"
          >
            <Plus size={16} className="mr-2" />
            Option hinzufügen
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
        <div>
          <p className="text-sm font-medium text-white">Private Wette</p>
          <p className="text-xs text-white/40">Einschränken, wer diese Wette sehen kann</p>
        </div>
        <Switch checked={isPrivate} onCheckedChange={(v) => { setIsPrivate(v); setSelectedUsers([]); }} />
      </div>

      <div className="space-y-3">
        <Label className="text-white/70">
          {isPrivate
            ? 'Wer darf die Wette sehen? (Whitelist)'
            : 'Wer darf die Wette nicht sehen? (Blacklist)'}
        </Label>
        <UserMultiSelect
          selected={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Benutzer suchen..."
        />
        <p className="text-xs text-white/40">
          {isPrivate
            ? 'Nur ausgewählte Benutzer können diese Wette sehen und abschließen.'
            : 'Ausgewählte Benutzer können diese Wette nicht sehen. Leer lassen, damit sie für alle sichtbar ist.'}
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-black font-bold hover:bg-amber-400"
      >
        <Send size={18} className="mr-2" />
        {loading ? 'Wird erstellt...' : 'Wette erstellen'}
      </Button>
    </form>
  );
}
