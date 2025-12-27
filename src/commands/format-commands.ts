import * as vscode from 'vscode';
import { FormattingService } from '../services/formatting-service';

const runFormatting = async (
  editor: vscode.TextEditor | undefined,
  action: (editor: vscode.TextEditor) => Promise<void>
): Promise<void> => {
  if (!editor || editor.document.languageId !== 'markdown') {
    return;
  }

  await action(editor);
};

/**
 * Apply bold formatting to the current selection.
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatBold = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.wrapSelection(activeEditor, '**', '**', 'bold text')
  );

/**
 * Apply italic formatting to the current selection.
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatItalic = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.wrapSelection(activeEditor, '_', '_', 'italic text')
  );

/**
 * Apply strikethrough formatting to the current selection.
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatStrikethrough = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.wrapSelection(activeEditor, '~~', '~~', 'strikethrough')
  );

/**
 * Apply inline code formatting to the current selection.
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatInlineCode = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.wrapSelection(activeEditor, '`', '`', 'code')
  );

/**
 * Apply code block formatting to the current selection.
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatCodeBlock = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.wrapBlock(activeEditor, '```', 'code')
  );

/**
 * Toggle bullet list formatting on the current line(s).
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatBulletList = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.toggleLinePrefix(activeEditor, '- ')
  );

/**
 * Toggle numbered list formatting on the current line(s).
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatNumberedList = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.toggleLinePrefix(activeEditor, '1. ')
  );

/**
 * Insert a markdown link.
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatLink = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.insertLink(activeEditor)
  );

/**
 * Toggle H1 heading formatting on the current line(s).
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatHeading1 = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.toggleLinePrefix(activeEditor, '# ')
  );

/**
 * Toggle H2 heading formatting on the current line(s).
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatHeading2 = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.toggleLinePrefix(activeEditor, '## ')
  );

/**
 * Toggle H3 heading formatting on the current line(s).
 * @param editor Active text editor.
 * @param formattingService Formatting service.
 * @returns Promise resolved when formatting completes.
 * @throws Propagates VS Code edit errors.
 */
export const formatHeading3 = async (
  editor: vscode.TextEditor,
  formattingService: FormattingService
): Promise<void> =>
  runFormatting(editor, (activeEditor) =>
    formattingService.toggleLinePrefix(activeEditor, '### ')
  );
