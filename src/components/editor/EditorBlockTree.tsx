import { useCallback, useState, type DragEvent } from 'react';
import type { DocBlock } from '../../types/templates';
import { getBlockLabel } from '../../utils/blockLabels';
import { findParent } from '../../utils/blockTree';

const BLOCK_ID_MIME = 'application/atelier-block-id';

type TreeDropPosition = 'before' | 'after' | 'inside';

interface TreeDropTarget {
  blockId: string;
  position: TreeDropPosition;
}

interface EditorBlockTreeProps {
  root: DocBlock;
  selectedId: string | null;
  readonly?: boolean;
  onSelect: (id: string) => void;
  onMove?: (blockId: string, newParentId: string, index?: number) => void;
}

function getDropPosition(e: DragEvent, block: DocBlock, isPageRoot: boolean): TreeDropPosition {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const ratio = (e.clientY - rect.top) / Math.max(rect.height, 1);

  if (isPageRoot) return 'inside';

  if (block.type === 'container') {
    if (ratio < 0.28) return 'before';
    if (ratio > 0.72) return 'after';
    return 'inside';
  }

  return ratio < 0.5 ? 'before' : 'after';
}

function resolveTreeDrop(
  root: DocBlock,
  dragId: string,
  targetBlock: DocBlock,
  position: TreeDropPosition,
  isPageRoot: boolean,
): { parentId: string; index?: number } | null {
  if (dragId === targetBlock.id) return null;

  if (position === 'inside') {
    if (targetBlock.type !== 'container') return null;
    return {
      parentId: targetBlock.id,
      index: targetBlock.children?.length ?? 0,
    };
  }

  if (isPageRoot) return null;

  const parent = findParent(root, targetBlock.id);
  if (!parent?.children) return null;

  const targetIdx = parent.children.findIndex((c) => c.id === targetBlock.id);
  if (targetIdx < 0) return null;

  return {
    parentId: parent.id,
    index: position === 'before' ? targetIdx : targetIdx + 1,
  };
}

function BlockTreeNode({
  block,
  pageRootId,
  root,
  selectedId,
  dropTarget,
  readonly = false,
  onSelect,
  onMove,
  onDropTargetChange,
}: {
  block: DocBlock;
  pageRootId: string;
  root: DocBlock;
  selectedId: string | null;
  dropTarget: TreeDropTarget | null;
  readonly?: boolean;
  onSelect: (id: string) => void;
  onMove?: (blockId: string, newParentId: string, index?: number) => void;
  onDropTargetChange: (target: TreeDropTarget | null) => void;
}) {
  const isPageRoot = block.id === pageRootId;
  const label = getBlockLabel(block, isPageRoot);
  const isDropTarget = dropTarget?.blockId === block.id;
  const dropClass = isDropTarget
    ? dropTarget.position === 'inside'
      ? ' block-tree-drop-inside'
      : dropTarget.position === 'before'
        ? ' block-tree-drop-before'
        : ' block-tree-drop-after'
    : '';

  const handleDragStart = (e: DragEvent) => {
    if (readonly || isPageRoot) return;
    e.stopPropagation();
    e.dataTransfer.setData(BLOCK_ID_MIME, block.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent) => {
    if (readonly || !onMove) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    const position = getDropPosition(e, block, isPageRoot);
    onDropTargetChange({ blockId: block.id, position });
  };

  const handleDrop = (e: DragEvent) => {
    if (readonly || !onMove) return;
    e.preventDefault();
    e.stopPropagation();
    onDropTargetChange(null);

    const dragId = e.dataTransfer.getData(BLOCK_ID_MIME);
    if (!dragId) return;

    const position = getDropPosition(e, block, isPageRoot);
    const resolved = resolveTreeDrop(root, dragId, block, position, isPageRoot);
    if (!resolved) return;

    onMove(dragId, resolved.parentId, resolved.index);
    onSelect(dragId);
  };

  return (
    <li
      className="block-tree-node"
      onDragOver={handleDragOver}
      onDragLeave={(e) => {
        if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
          onDropTargetChange(null);
        }
      }}
      onDrop={handleDrop}
    >
      <button
        type="button"
        className={`block-tree-btn${selectedId === block.id ? ' active' : ''}${dropClass}${
          !readonly && !isPageRoot ? ' block-tree-btn-draggable' : ''
        }`}
        draggable={!readonly && !isPageRoot}
        onDragStart={handleDragStart}
        onDragEnd={() => onDropTargetChange(null)}
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
              pageRootId={pageRootId}
              root={root}
              selectedId={selectedId}
              dropTarget={dropTarget}
              readonly={readonly}
              onSelect={onSelect}
              onMove={onMove}
              onDropTargetChange={onDropTargetChange}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function EditorBlockTree({
  root,
  selectedId,
  readonly = false,
  onSelect,
  onMove,
}: EditorBlockTreeProps) {
  const [dropTarget, setDropTarget] = useState<TreeDropTarget | null>(null);

  const handleDropTargetChange = useCallback((target: TreeDropTarget | null) => {
    setDropTarget(target);
  }, []);

  return (
    <div className={`editor-block-tree${readonly ? ' is-readonly' : ''}`}>
      {!readonly && onMove && (
        <p className="hint block-tree-hint">Glisser-déposer pour déplacer dans la structure.</p>
      )}
      <ul className="block-tree-root">
        <BlockTreeNode
          block={root}
          pageRootId={root.id}
          root={root}
          selectedId={selectedId}
          dropTarget={dropTarget}
          readonly={readonly}
          onSelect={onSelect}
          onMove={onMove}
          onDropTargetChange={handleDropTargetChange}
        />
      </ul>
    </div>
  );
}
