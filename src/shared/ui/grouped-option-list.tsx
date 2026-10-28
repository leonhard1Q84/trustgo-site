'use client';

import { useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from './utils';

export interface OptionGroup {
  id: string;
  label?: string;
  options: { id: string; label: string; selected?: boolean }[];
}

/** Lightweight grouped choices for destination browsing and location filtering. */
export function GroupedOptionList({
  groups,
  onSelect,
}: {
  groups: OptionGroup[];
  onSelect: (groupId: string, optionId: string) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={group.label ? `${id}-${group.id}` : undefined}>
          {group.label && (
            <h3
              id={`${id}-${group.id}`}
              className="px-3 pt-3 pb-1 text-xs font-medium text-muted-foreground"
            >
              {group.label}
            </h3>
          )}
          <div className="grid grid-cols-2 gap-x-1 md:grid-cols-3">
            {group.options.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={option.selected}
                onClick={() => onSelect(group.id, option.id)}
                className={cn(
                  'relative min-h-11 min-w-0 cursor-pointer rounded-control px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  option.selected && 'bg-muted font-semibold'
                )}
              >
                <span className={cn('block break-words', option.selected && 'pr-5')}>
                  {option.label}
                </span>
                {option.selected && (
                  <Check className="absolute top-3 right-2 h-4 w-4" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
