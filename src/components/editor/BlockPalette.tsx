import { useMemo } from 'react';
import { FIELD_CATALOG } from '../../utils/templateFields';
import type { FieldKey } from '../../types/templates';

const LAYOUT_BLOCKS = [
  { layout: 'row', label: '↔ Ligne', desc: 'Horizontal' },
  { layout: 'column', label: '↕ Colonne', desc: 'Vertical' },
  { layout: 'columns2', label: '▥ 2 col.', desc: '50 / 50' },
  { layout: 'columns3', label: '▦ 3 col.', desc: '33 × 3' },
  { layout: 'text', label: 'T Texte', desc: 'Shortcodes' },
  { layout: 'spacer', label: '— Espace', desc: 'Marge' },
  { layout: 'image', label: '🖼 Image', desc: 'Statique' },
  { layout: 'rectangle', label: '▬ Trait', desc: 'Séparateur' },
] as const;

const GROUP_LABELS: Record<string, string> = {
  'œuvre': 'Œuvre',
  artiste: 'Artiste',
  exposition: 'Exposition',
};

export function BlockPalette() {
  const groups = useMemo(() => {
    const g: Record<string, typeof FIELD_CATALOG> = {};
    for (const f of FIELD_CATALOG) {
      (g[f.group] ??= []).push(f);
    }
    return g;
  }, []);

  const onDragStart = (payload: object) => (e: React.DragEvent) => {
    e.dataTransfer.setData('application/atelier-block', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const groupEntries = Object.entries(groups);

  return (
    <div className="block-palette">
      <p className="palette-hint">Glissez sur le canevas</p>

      {groupEntries.map(([group, fields], i) => (
        <details key={group} className="palette-accordion" open={i === 0}>
          <summary>{GROUP_LABELS[group] ?? group}</summary>
          <div className="palette-group">
            {fields.map((f) => (
              <div
                key={f.key}
                className="palette-item"
                draggable
                onDragStart={onDragStart({ kind: 'field', field: f.key as FieldKey })}
              >
                <span className="palette-tag">[{f.label}]</span>
              </div>
            ))}
          </div>
        </details>
      ))}

      <details className="palette-accordion">
        <summary>Layout</summary>
        <div className="palette-group">
          {LAYOUT_BLOCKS.map((b) => (
            <div
              key={b.layout}
              className="palette-item palette-layout"
              draggable
              onDragStart={onDragStart({ kind: 'layout', layout: b.layout })}
            >
              <strong>{b.label}</strong>
              <small>{b.desc}</small>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
