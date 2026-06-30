import type { ReactNode } from 'react';

export type EditorSideTab = 'props' | 'tree' | 'preview';

interface EditorSidePanelProps {
  readonly?: boolean;
  readonlyContent?: ReactNode;
  activeTab: EditorSideTab;
  onTabChange: (tab: EditorSideTab) => void;
  properties: ReactNode;
  tree: ReactNode;
  preview: ReactNode;
}

export function EditorSidePanel({
  readonly,
  readonlyContent,
  activeTab,
  onTabChange,
  properties,
  tree,
  preview,
}: EditorSidePanelProps) {
  const tab = activeTab;
  const setTab = onTabChange;

  if (readonly && readonlyContent) {
    return <div className="editor-side-panel">{readonlyContent}</div>;
  }

  return (
    <div className="editor-side-panel">
      <div className="editor-panel-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={tab === 'props' ? 'active' : ''}
          aria-selected={tab === 'props'}
          onClick={() => setTab('props')}
        >
          Propriétés
        </button>
        <button
          type="button"
          role="tab"
          className={tab === 'tree' ? 'active' : ''}
          aria-selected={tab === 'tree'}
          onClick={() => setTab('tree')}
        >
          Structure
        </button>
        <button
          type="button"
          role="tab"
          className={tab === 'preview' ? 'active' : ''}
          aria-selected={tab === 'preview'}
          onClick={() => setTab('preview')}
        >
          Aperçu
        </button>
      </div>
      <div className="editor-panel-body">
        {tab === 'props' && properties}
        {tab === 'tree' && tree}
        {tab === 'preview' && preview}
      </div>
    </div>
  );
}
