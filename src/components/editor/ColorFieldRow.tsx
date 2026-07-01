interface ColorFieldRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  resetLabel?: string;
  onReset?: () => void;
  resetDisabled?: boolean;
  hint?: string;
}

/** Sélecteur de couleur aligné sur le style éditeur (color-field-compact). */
export function ColorFieldRow({
  label,
  value,
  onChange,
  disabled = false,
  resetLabel,
  onReset,
  resetDisabled = false,
  hint,
}: ColorFieldRowProps) {
  return (
    <div className="color-field-row">
      <label className="color-field-compact">
        <span className="editor-compact-label">{label}</span>
        <input
          type="color"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          title={label}
        />
      </label>
      {resetLabel && onReset && (
        <button
          type="button"
          className="btn btn-ghost btn-sm color-field-row-reset"
          disabled={disabled || resetDisabled}
          onClick={onReset}
        >
          {resetLabel}
        </button>
      )}
      {hint && <p className="hint color-field-row-hint">{hint}</p>}
    </div>
  );
}
