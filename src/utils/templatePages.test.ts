import { describe, expect, it } from 'vitest';
import type { DocTemplate } from '../types/templates';
import {
  DEFAULT_EDITOR_TEMPLATE_ID,
  resolveDefaultEditorTemplateId,
} from './templateCatalog';
import type { TemplateContext } from './templateFields';
import {
  countExpandedPdfPages,
  emptyPageRoot,
  expandTemplateForPdf,
  getTemplatePages,
  insertTemplatePage,
  legacyPageId,
  normalizeTemplate,
  reorderTemplatePages,
  removeTemplatePage,
} from './templatePages';

function sampleTemplate(overrides: Partial<DocTemplate> = {}): DocTemplate {
  const root = emptyPageRoot();
  return {
    id: 'tpl_test',
    nom: 'Test',
    type: 'custom',
    format: 'a4',
    margin: 12,
    background: '#fff',
    root,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    ...overrides,
  };
}

const ctx = (id: string): TemplateContext => ({
  work: { id, ref: id, titre: id } as TemplateContext['work'],
});

describe('templatePages', () => {
  it('getTemplatePages uses stable legacy page id', () => {
    const tpl = sampleTemplate();
    const pages1 = getTemplatePages(tpl);
    const pages2 = getTemplatePages(tpl);
    expect(pages1[0].id).toBe(legacyPageId('tpl_test'));
    expect(pages2[0].id).toBe(pages1[0].id);
  });

  it('normalizeTemplate persists pages array', () => {
    const normalized = normalizeTemplate(sampleTemplate());
    expect(normalized.pages).toHaveLength(1);
    expect(normalized.pages![0].id).toBe(legacyPageId('tpl_test'));
    expect(normalized.root).toBe(normalized.pages![0].root);
  });

  it('expandTemplateForPdf mixes static and dynamic pages', () => {
    const tpl = normalizeTemplate(
      sampleTemplate({
        pages: [
          { id: 'p1', kind: 'static', root: emptyPageRoot() },
          { id: 'p2', kind: 'dynamic', root: emptyPageRoot() },
        ],
      }),
    );
    const expanded = expandTemplateForPdf(tpl, [ctx('a'), ctx('b'), ctx('c')]);
    expect(expanded).toHaveLength(4);
  });

  it('countExpandedPdfPages matches expand length', () => {
    const tpl = normalizeTemplate(
      sampleTemplate({
        pages: [
          { id: 'p1', kind: 'static', root: emptyPageRoot() },
          { id: 'p2', kind: 'dynamic', root: emptyPageRoot() },
        ],
      }),
    );
    const contexts = [ctx('a'), ctx('b'), ctx('c')];
    expect(countExpandedPdfPages(tpl, contexts.length)).toBe(
      expandTemplateForPdf(tpl, contexts).length,
    );
  });

  it('reorderTemplatePages moves a page', () => {
    const tpl = normalizeTemplate(
      sampleTemplate({
        pages: [
          { id: 'p1', kind: 'static', root: emptyPageRoot() },
          { id: 'p2', kind: 'dynamic', root: emptyPageRoot() },
          { id: 'p3', kind: 'static', root: emptyPageRoot() },
        ],
      }),
    );
    const reordered = reorderTemplatePages(tpl, 0, 2);
    expect(reordered.pages!.map((p) => p.id)).toEqual(['p2', 'p3', 'p1']);
  });

  it('insertTemplatePage adds after index', () => {
    const tpl = normalizeTemplate(sampleTemplate());
    const next = insertTemplatePage(tpl, 0, 'dynamic');
    expect(next.pages).toHaveLength(2);
    expect(next.pages![1].kind).toBe('dynamic');
  });

  it('removeTemplatePage keeps at least one page', () => {
    const tpl = normalizeTemplate(sampleTemplate());
    expect(removeTemplatePage(tpl, tpl.pages![0].id)).toEqual(tpl);
  });
});

describe('resolveDefaultEditorTemplateId', () => {
  it('returns builtin catalogue when no user templates', () => {
    expect(resolveDefaultEditorTemplateId(undefined)).toBe(DEFAULT_EDITOR_TEMPLATE_ID);
    expect(resolveDefaultEditorTemplateId([])).toBe(DEFAULT_EDITOR_TEMPLATE_ID);
  });

  it('returns most recently updated user template', () => {
    const id = resolveDefaultEditorTemplateId([
      {
        ...sampleTemplate({ id: 'old', updatedAt: '2026-01-01T00:00:00.000Z' }),
      },
      {
        ...sampleTemplate({ id: 'new', updatedAt: '2026-06-01T00:00:00.000Z' }),
      },
    ]);
    expect(id).toBe('new');
  });
});
