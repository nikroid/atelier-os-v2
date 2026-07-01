import type { BackgroundImageSize, BackgroundPositionUnit } from '../../types/templates';

interface BackgroundSizePickerProps {
  label?: string;
  value: BackgroundImageSize;
  disabled?: boolean;
  onChange: (value: BackgroundImageSize) => void;
}

function clampSizeValue(value: number, unit: BackgroundPositionUnit): number {
  const n = parseFloat(String(value)) || 0;
  if (unit === '%') return Math.max(0, n);
  return n;
}

function SizeAxisField({
  axis,
  value,
  unit,
  disabled,
  onChange,
}: {
  axis: 'L' | 'H';
  value: number;
  unit: BackgroundPositionUnit;
  disabled?: boolean;
  onChange: (value: number, unit: BackgroundPositionUnit) => void;
}) {
  return (
    <label className="background-position-axis">
      <span className="editor-compact-label">{axis}</span>
      <div className="dimension-input">
        <input
          type="number"
          min={0}
          step={1}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(clampSizeValue(parseFloat(e.target.value) || 0, unit), unit)}
        />
        <select
          value={unit}
          disabled={disabled}
          onChange={(e) => onChange(value, e.target.value as BackgroundPositionUnit)}
        >
          <option value="%">%</option>
          <option value="px">px</option>
        </select>
      </div>
    </label>
  );
}

export function BackgroundSizePicker({
  label = 'Taille',
  value,
  disabled = false,
  onChange,
}: BackgroundSizePickerProps) {
  const heightAuto = value.height === 'auto';
  const heightValue = typeof value.height === 'number' ? value.height : 100;

  return (
    <div className="background-position-field">
      <span className="editor-compact-label">{label}</span>
      <div className="form-row form-row-dense background-position-row">
        <SizeAxisField
          axis="L"
          value={value.width}
          unit={value.widthUnit}
          disabled={disabled}
          onChange={(width, widthUnit) => onChange({ ...value, width, widthUnit })}
        />
        {heightAuto ? (
          <label className="background-position-axis">
            <span className="editor-compact-label">H</span>
            <select className="background-size-height-mode" disabled value="auto">
              <option value="auto">auto</option>
            </select>
          </label>
        ) : (
          <SizeAxisField
            axis="H"
            value={heightValue}
            unit={value.heightUnit}
            disabled={disabled}
            onChange={(height, heightUnit) => onChange({ ...value, height, heightUnit })}
          />
        )}
      </div>
      <label className="background-size-auto-toggle">
        <input
          type="checkbox"
          disabled={disabled}
          checked={heightAuto}
          onChange={(e) =>
            onChange({
              ...value,
              height: e.target.checked ? 'auto' : heightValue,
            })
          }
        />
        <span className="hint">Hauteur auto (proportionnelle)</span>
      </label>
    </div>
  );
}
