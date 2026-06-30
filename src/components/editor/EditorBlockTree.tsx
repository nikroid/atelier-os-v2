import type { DocBlock } from '../../types/templates';
import { FIELD_CATALOG } from '../../utils/templateFields';
import { flexDirectionLabel } from '../../utils/flexDirection';

interface EditorBlockTreeProps {
  root: DocBlock;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function BlockTreeNode({
  block,
  selectedId,
  onSelect,
}: {
  block: DocBlock;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const label =
    block.type === 'field'
      ? FIELD_CATALOG.find((f) => f.key === block.field)?.label ?? block.field
      : block.type === 'text'
        ? (block.content?.slice(0, 24) || 'Texte') + (block.content && block.content.length > 24 ? '…' : '')
        : block.type === 'container'
          ? `Conteneur ${flexDirectionLabel(block.direction)}`
          : block.type === 'image'
            ? 'Image statique'
            : block.type === 'spacer'
              ? 'Espaceur'
              : block.type === 'rectangle'
                ? 'Séparateur'
                : block.type;

  return (
    <li className="block-tree-node">
      <button
        type="button"
        className={`block-tree-btn${selectedId === block.id ? ' active' : ''}`}
        onClick={() => onSelect(block.id)}
      >
        {label}
      </button>
      {block.children && block.children.length > 0 && (
        <ul className="block-tree-children">
          {block.children.map((child) => (
            <BlockTreeNode
              key={child.id}
              block={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function EditorBlockTree({ root, selectedId, onSelect }: EditorBlockTreeProps) {
  return (
    <div className="editor-block-tree">
      <ul className="block-tree-root">
        <BlockTreeNode block={root} selectedId={selectedId} onSelect={onSelect} />
      </ul>
    </div>
  );
}
