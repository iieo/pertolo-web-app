'use client';

import * as React from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
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
}

export function UserMultiSelect({
    selected,
    onChange,
    placeholder = 'Benutzer auswählen...',
}: UserMultiSelectProps) {
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
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white h-auto min-h-[40px] px-3 py-2"
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length === 0 && (
                            <span className="text-white/30 font-normal">{placeholder}</span>
                        )}
                        {selected.map((user) => (
                            <Badge
                                key={user.id}
                                variant="secondary"
                                className="bg-white/10 text-white hover:bg-white/20 mb-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnselect(user);
                                }}
                            >
                                {user.name}
                                <div
                                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-white/20 p-0.5"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUnselect(user);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleUnselect(user);
                                    }}
                                >
                                    <X className="h-3 w-3 text-white/70" />
                                </div>
                            </Badge>
                        ))}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0 border-white/10 bg-zinc-950 text-white">
                <Command className="bg-transparent" shouldFilter={false}>
                    <CommandInput
                        placeholder="Benutzer suchen..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        className="text-white placeholder:text-white/40"
                    />
                    <CommandList>
                        <CommandEmpty>
                            {isLoading ? 'Sucht...' : 'Keine Benutzer gefunden.'}
                        </CommandEmpty>
                        <CommandGroup>
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
                                        className="text-white aria-selected:bg-white/10 aria-selected:text-white"
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                isSelected ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span>{option.name}</span>
                                            <span className="text-xs text-white/40">{option.email}</span>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
