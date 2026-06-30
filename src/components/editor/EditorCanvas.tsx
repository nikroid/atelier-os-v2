import { useRef, type ReactNode } from 'react';

interface EditorCanvasProps {
  children: ReactNode;
  onBackgroundClick?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
}

export function EditorCanvas({
  children,
  onBackgroundClick,
  onDrop,
  onDragOver,
}: EditorCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('editor-canvas-inner')) {
      onBackgroundClick?.();
    }
  };

  return (
    <div
      ref={viewportRef}
      className="editor-canvas"
      tabIndex={0}
      onClick={handleClick}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e);
      }}
      onDrop={onDrop}
      aria-label="Canevas éditeur — faites défiler pour parcourir les pages"
    >
      <div className="editor-canvas-inner">{children}</div>
    </div>
  );
}
