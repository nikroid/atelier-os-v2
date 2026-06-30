import type { FlexDirection } from '../../types/templates';
import { parseFlexDirection, serializeFlexDirection } from '../../utils/flexDirection';

interface FlexDirectionControlsProps {
  label?: string;
  compact?: boolean;
  value?: FlexDirection;
  onChange: (direction: FlexDirection) => void;
}

export function FlexDirectionControls({
  label = 'Sens',
  compact,
  value,
  onChange,
}: FlexDirectionControlsProps) {
  const { axis, reverse } = parseFlexDirection(value);

  return (
    <div className={`icon-toggle-field${compact ? ' icon-toggle-field-compact' : ''}`}>
      {label && <span className="editor-compact-label">{label}</span>}
      <div className="icon-toggle-group" role="group" aria-label={label}>
        <button
          type="button"
          className={`icon-toggle-btn${axis === 'column' ? ' active' : ''}`}
          title="Vertical (colonne)"
          aria-pressed={axis === 'column'}
          onClick={() => onChange(serializeFlexDirection('column', reverse))}
        >
          ↓
        </button>
        <button
          type="button"
          className={`icon-toggle-btn${axis === 'row' ? ' active' : ''}`}
          title="Horizontal (ligne)"
          aria-pressed={axis === 'row'}
          onClick={() => onChange(serializeFlexDirection('row', reverse))}
        >
          →
        </button>
        <button
          type="button"
          className={`icon-toggle-btn${reverse ? ' active' : ''}`}
          title="Inverser l'ordre"
          aria-pressed={reverse}
          onClick={() => onChange(serializeFlexDirection(axis, !reverse))}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
