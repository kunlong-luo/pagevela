import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pdfMenu = readFileSync(new URL('../components/header/PdfExportMenu.tsx', import.meta.url), 'utf8');
const workspace = readFileSync(new URL('../components/EditorWorkspace.tsx', import.meta.url), 'utf8');

describe('mobile PDF entry points and view tabs', () => {
  it('exports from the compact primary PDF button without first opening the menu', () => {
    expect(pdfMenu).toContain("aria-label={compact ? (isEn ? 'Export ATS PDF' : '导出 ATS PDF') : undefined}");
    expect(pdfMenu).toContain('setIsOpen(false);\n          onExportAts();');
    expect(pdfMenu).not.toContain('if (compact) {\n            setIsOpen(true);');
  });

  it('keeps alternate export options available via the dropdown', () => {
    expect(pdfMenu).toContain('onClick={() => setIsOpen((value) => !value)}');
    expect(pdfMenu).toContain('onExportQuick');
  });

  it('uses the compact header download and reserves the in-flow footer for three views', () => {
    expect(workspace).toContain('<Header');
    expect(workspace).toContain("onClick={() => { setEditorMode('form'); setMobileTab('form'); }}");
    expect(workspace).toContain("onClick={() => { setEditorMode('markdown'); setMobileTab('markdown'); }}");
    expect(workspace).toContain("onClick={() => setMobileTab('preview')}");
    expect(workspace).not.toContain('onClick={handleExportVectorPrint}');
  });
});
