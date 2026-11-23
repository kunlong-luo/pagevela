import { describe, expect, it, vi } from 'vitest';
import { dispatchEditorKeyboardShortcut, type EditorShortcutEvent } from '../hooks/useEditorKeyboardShortcuts';

function keyboardEvent(
  key: string,
  flags: Partial<Pick<EditorShortcutEvent, 'ctrlKey' | 'metaKey' | 'shiftKey'>> = {},
): EditorShortcutEvent {
  return {
    key,
    ctrlKey: flags.ctrlKey ?? false,
    metaKey: flags.metaKey ?? false,
    shiftKey: flags.shiftKey ?? false,
    preventDefault: vi.fn(),
  };
}

function actions() {
  return { save: vi.fn(), print: vi.fn(), autoFit: vi.fn() };
}

describe('global editor keyboard shortcut routing', () => {
  it('saves on Ctrl+S, Cmd+S, and the existing Ctrl+Shift+S combination', () => {
    for (const flags of [
      { ctrlKey: true },
      { metaKey: true },
      { ctrlKey: true, shiftKey: true },
    ]) {
      const event = keyboardEvent('S', flags);
      const callbacks = actions();
      expect(dispatchEditorKeyboardShortcut(event, callbacks)).toBe(true);
      expect(event.preventDefault).toHaveBeenCalledOnce();
      expect(callbacks.save).toHaveBeenCalledOnce();
      expect(callbacks.print).not.toHaveBeenCalled();
      expect(callbacks.autoFit).not.toHaveBeenCalled();
    }
  });

  it('routes Ctrl/Cmd+P to print but never Ctrl/Cmd+Shift+P', () => {
    const event = keyboardEvent('p', { ctrlKey: true });
    const callbacks = actions();
    expect(dispatchEditorKeyboardShortcut(event, callbacks)).toBe(true);
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(callbacks.print).toHaveBeenCalledOnce();

    const ignored = keyboardEvent('P', { metaKey: true, shiftKey: true });
    expect(dispatchEditorKeyboardShortcut(ignored, callbacks)).toBe(false);
    expect(ignored.preventDefault).not.toHaveBeenCalled();
    expect(callbacks.print).toHaveBeenCalledOnce();
  });

  it('only invokes Auto Fit on Ctrl/Cmd+Shift+F', () => {
    const callbacks = actions();
    const event = keyboardEvent('F', { metaKey: true, shiftKey: true });
    expect(dispatchEditorKeyboardShortcut(event, callbacks)).toBe(true);
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(callbacks.autoFit).toHaveBeenCalledOnce();

    const ignored = keyboardEvent('f', { ctrlKey: true });
    expect(dispatchEditorKeyboardShortcut(ignored, callbacks)).toBe(false);
    expect(ignored.preventDefault).not.toHaveBeenCalled();
    expect(callbacks.autoFit).toHaveBeenCalledOnce();
  });

  it('leaves unmodified keys and unrelated browser shortcuts untouched', () => {
    const callbacks = actions();
    for (const event of [
      keyboardEvent('s'),
      keyboardEvent('p', { shiftKey: true }),
      keyboardEvent('r', { ctrlKey: true }),
      keyboardEvent('f', { metaKey: true }),
    ]) {
      expect(dispatchEditorKeyboardShortcut(event, callbacks)).toBe(false);
      expect(event.preventDefault).not.toHaveBeenCalled();
    }
    expect(callbacks.save).not.toHaveBeenCalled();
    expect(callbacks.print).not.toHaveBeenCalled();
    expect(callbacks.autoFit).not.toHaveBeenCalled();
  });
});
