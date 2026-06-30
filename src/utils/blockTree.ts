import type { DocBlock } from '../types/templates';

export function createBlockId(): string {
  return `blk_${crypto.randomUUID().slice(0, 8)}`;
}

export function findBlock(root: DocBlock, id: string): DocBlock | null {
  if (root.id === id) return root;
  if (!root.children) return null;
  for (const child of root.children) {
    const found = findBlock(child, id);
    if (found) return found;
  }
  return null;
}

export function findParent(root: DocBlock, childId: string): DocBlock | null {
  if (!root.children) return null;
  if (root.children.some((c) => c.id === childId)) return root;
  for (const child of root.children) {
    const found = findParent(child, childId);
    if (found) return found;
  }
  return null;
}

function mapTree(root: DocBlock, fn: (b: DocBlock) => DocBlock): DocBlock {
  const mapped = fn(root);
  if (mapped.children) {
    return { ...mapped, children: mapped.children.map((c) => mapTree(c, fn)) };
  }
  return mapped;
}

export function updateBlock(root: DocBlock, id: string, patch: Partial<DocBlock>): DocBlock {
  return mapTree(root, (b) => (b.id === id ? { ...b, ...patch } : b));
}

export function removeBlock(root: DocBlock, id: string): DocBlock {
  if (root.id === id) return root;
  return mapTree(root, (b) => {
    if (b.children) {
      return { ...b, children: b.children.filter((c) => c.id !== id) };
    }
    return b;
  });
}

export function addChild(root: DocBlock, parentId: string, child: DocBlock, index?: number): DocBlock {
  return mapTree(root, (b) => {
    if (b.id === parentId && b.type === 'container') {
      const children = [...(b.children ?? [])];
      const idx = index ?? children.length;
      children.splice(idx, 0, child);
      return { ...b, children };
    }
    return b;
  });
}

export function moveBlock(root: DocBlock, blockId: string, dir: 'up' | 'down'): DocBlock {
  const parent = findParent(root, blockId);
  if (!parent?.children) return root;
  const idx = parent.children.findIndex((c) => c.id === blockId);
  if (idx < 0) return root;
  const newIdx = dir === 'up' ? idx - 1 : idx + 1;
  if (newIdx < 0 || newIdx >= parent.children.length) return root;
  const children = [...parent.children];
  [children[idx], children[newIdx]] = [children[newIdx], children[idx]];
  return updateBlock(root, parent.id, { children });
}

function containsBlock(node: DocBlock, targetId: string): boolean {
  if (node.id === targetId) return true;
  if (!node.children) return false;
  return node.children.some((c) => containsBlock(c, targetId));
}

export function moveBlockToParent(
  root: DocBlock,
  blockId: string,
  newParentId: string,
  index?: number,
): DocBlock {
  const block = findBlock(root, blockId);
  if (!block || blockId === newParentId) return root;
  if (containsBlock(block, newParentId)) return root;
  let updated = removeBlock(root, blockId);
  updated = addChild(updated, newParentId, block, index);
  return updated;
}

export function duplicateBlock(block: DocBlock): DocBlock {
  const clone: DocBlock = {
    ...block,
    id: createBlockId(),
    children: block.children?.map(duplicateBlock),
  };
  return clone;
}

export function duplicateBlockAfter(root: DocBlock, blockId: string): DocBlock {
  const block = findBlock(root, blockId);
  const parent = findParent(root, blockId);
  if (!block || !parent?.children) return root;
  const idx = parent.children.findIndex((c) => c.id === blockId);
  if (idx < 0) return root;
  return addChild(root, parent.id, duplicateBlock(block), idx + 1);
}
