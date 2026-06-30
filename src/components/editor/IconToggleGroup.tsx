interface IconToggleOption<T extends string> {
  value: T;
  label: string;
  title?: string;
}

interface IconToggleGroupProps<T extends string> {
  label?: string;
  value: T;
  options: IconToggleOption<T>[];
  onChange: (value: T) => void;
  compact?: boolean;
}

export function IconToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  compact,
}: IconToggleGroupProps<T>) {
  return (
    <div className={`icon-toggle-field${compact ? ' icon-toggle-field-compact' : ''}`}>
      {label && <span className="editor-compact-label">{label}</span>}
      <div className="icon-toggle-group" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`icon-toggle-btn${value === opt.value ? ' active' : ''}`}
            title={opt.title ?? opt.label}
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
