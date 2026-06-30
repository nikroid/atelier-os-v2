export type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="view-mode-toggle" role="group" aria-label="Mode d'aperçu">
      <button
        type="button"
        className={value === 'grid' ? 'active' : ''}
        title="Grille"
        aria-pressed={value === 'grid'}
        onClick={() => onChange('grid')}
      >
        ▦
      </button>
      <button
        type="button"
        className={value === 'list' ? 'active' : ''}
        title="Liste"
        aria-pressed={value === 'list'}
        onClick={() => onChange('list')}
      >
        ☰
      </button>
    </div>
  );
}
