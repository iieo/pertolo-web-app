'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { searchUsers } from '../create/actions';

export type UserOption = {
  id: string;
  name: string;
  email: string;
};

interface UserMultiSelectProps {
  selected: UserOption[];
  onChange: (selected: UserOption[]) => void;
  placeholder?: string;
  labelledBy?: string;
}

export function UserMultiSelect({
  selected,
  onChange,
  placeholder = 'Benutzer auswählen',
  labelledBy,
}: UserMultiSelectProps) {
  const listId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [debouncedSearchTerm] = useDebounce(inputValue, 300);
  const [options, setOptions] = React.useState<UserOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    async function fetchUsers() {
      if (debouncedSearchTerm.length < 2) {
        setOptions([]);
        return;
      }
      setIsLoading(true);
      const result = await searchUsers(debouncedSearchTerm);
      if (active && result.success) {
        setOptions(result.data);
      }
      setIsLoading(false);
    }

    fetchUsers();

    return () => {
      active = false;
    };
  }, [debouncedSearchTerm]);

  const handleUnselect = (userToRemove: UserOption) => {
    onChange(selected.filter((user) => user.id !== userToRemove.id));
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-labelledby={labelledBy}
            className="flex h-14 w-full items-center justify-between gap-4 rounded-xl border border-white/20 px-4 text-left text-base text-white/40 transition-colors duration-150 outline-none hover:border-white/40 focus-visible:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
            onClick={() => setOpen(!open)}
          >
            <span className="truncate">{placeholder}</span>
            <span className="shrink-0 text-sm text-white/60">
              {selected.length > 0 ? `${selected.length} ausgewählt` : ''}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          id={listId}
          className="w-(--radix-popover-trigger-width) rounded-xl border-white/20 bg-neutral-950 p-0 text-white shadow-none"
        >
          <Command className="bg-transparent text-white" shouldFilter={false}>
            <CommandInput
              placeholder="Name eingeben"
              value={inputValue}
              onValueChange={setInputValue}
              className="h-12 text-base text-white placeholder:text-white/40"
            />
            <CommandList>
              <CommandEmpty className="px-4 py-6 text-base text-white/60">
                {isLoading ? 'Sucht…' : 'Keine Benutzer gefunden.'}
              </CommandEmpty>
              <CommandGroup className="text-white">
                {options.map((option) => {
                  const isSelected = selected.some((s) => s.id === option.id);
                  return (
                    <CommandItem
                      key={option.id}
                      value={`${option.name} ${option.email}`}
                      onSelect={() => {
                        if (isSelected) {
                          handleUnselect(option);
                        } else {
                          onChange([...selected, option]);
                        }
                        setInputValue('');
                      }}
                      className="min-h-12 gap-4 rounded-lg px-3 py-2 text-base text-white data-[selected=true]:bg-white/10 data-[selected=true]:text-white aria-selected:bg-white/10 aria-selected:text-white"
                    >
                      <Check
                        size={20}
                        aria-hidden
                        className={cn('shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate">{option.name}</span>
                        <span className="truncate text-sm text-white/60">{option.email}</span>
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
          {selected.map((user) => (
            <li key={user.id} className="flex items-center justify-between gap-4">
              <span className="min-w-0 truncate text-base">{user.name}</span>
              <button
                type="button"
                onClick={() => handleUnselect(user)}
                aria-label={`${user.name} entfernen`}
                className="-mr-2 flex min-h-12 shrink-0 items-center rounded-xl px-2 text-sm font-medium text-white/60 underline decoration-white/30 underline-offset-4 outline-none hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              >
                Entfernen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
