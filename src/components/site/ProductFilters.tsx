import { cn } from "@/lib/utils";

export type FilterGroup = {
  id: string;
  legend: string;
  options: { value: string; label: string }[];
};

export function FilterPanel({
  groups,
  selected,
  onToggle,
  className,
}: {
  groups: FilterGroup[];
  selected: Record<string, string[]>;
  onToggle: (groupId: string, value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-8", className)}>
      {groups.map((group) => (
        <fieldset key={group.id}>
          <legend className="eyebrow text-primary">{group.legend}</legend>
          <div className="mt-3 space-y-2">
            {group.options.map((option) => {
              const checked = (selected[group.id] ?? []).includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(group.id, option.value)}
                    className="size-4 rounded border-cocoa/30 accent-[var(--hey-you-purple)] focus-visible:outline-2 focus-visible:outline-offset-2"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
