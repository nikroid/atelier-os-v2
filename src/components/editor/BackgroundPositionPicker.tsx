import type { BackgroundImagePosition, BackgroundPositionUnit } from '../../types/templates';

interface BackgroundPositionPickerProps {
  label?: string;
  value: BackgroundImagePosition;
  disabled?: boolean;
  onChange: (value: BackgroundImagePosition) => void;
}

function clampAxis(value: number, unit: BackgroundPositionUnit): number {
  if (unit === '%') return Math.min(100, Math.max(0, value));
  return value;
}

function AxisField({
  axis,
  value,
  unit,
  disabled,
  onChange,
}: {
  axis: 'X' | 'Y';
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
          min={unit === '%' ? 0 : undefined}
          max={unit === '%' ? 100 : undefined}
          step={unit === '%' ? 1 : 1}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(clampAxis(parseFloat(e.target.value) || 0, unit), unit)}
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

export function BackgroundPositionPicker({
  label = 'Position',
  value,
  disabled = false,
  onChange,
}: BackgroundPositionPickerProps) {
  return (
    <div className="background-position-field">
      <span className="editor-compact-label">{label}</span>
      <div className="form-row form-row-dense background-position-row">
        <AxisField
          axis="X"
          value={value.x}
          unit={value.xUnit}
          disabled={disabled}
          onChange={(x, xUnit) => onChange({ ...value, x, xUnit })}
        />
        <AxisField
          axis="Y"
          value={value.y}
          unit={value.yUnit}
          disabled={disabled}
          onChange={(y, yUnit) => onChange({ ...value, y, yUnit })}
        />
      </div>
    </div>
  );
}
