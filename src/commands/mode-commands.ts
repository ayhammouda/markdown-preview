import * as vscode from 'vscode';
import { PreviewService } from '../services/preview-service';
import { StateService } from '../services/state-service';
import { ViewMode } from '../types/state';

// Prefer the active editor, but fall back to any visible markdown editor.
const getActiveMarkdownEditor = (): vscode.TextEditor | undefined =>
  vscode.window.activeTextEditor ??
  vscode.window.visibleTextEditors.find((editor) => editor.document.languageId === 'markdown');

/**
 * Enter edit mode for the active markdown editor.
 * @param previewService Preview service instance.
 * @returns Promise resolved when edit mode opens.
 * @throws Propagates VS Code command errors.
 */
export const enterEditMode = async (
  previewService: PreviewService
): Promise<void> => {
  const editor = getActiveMarkdownEditor();
  if (!editor) {
    return;
  }

  await previewService.enterEditMode(editor.document.uri);
};

/**
 * Exit edit mode for the active markdown editor.
 * @param previewService Preview service instance.
 * @returns Promise resolved when edit mode exits.
 * @throws Propagates VS Code command errors.
 */
export const exitEditMode = async (
  previewService: PreviewService
): Promise<void> => {
  const editor = getActiveMarkdownEditor();
  if (!editor) {
    return;
  }

  await previewService.exitEditMode(editor.document.uri);
};

/**
 * Toggle edit/preview mode for the active markdown editor.
 * @param previewService Preview service instance.
 * @param stateService State service instance.
 * @returns Promise resolved when the mode toggle completes.
 * @throws Propagates VS Code command errors.
 */
export const toggleEditMode = async (
  previewService: PreviewService,
  stateService: StateService
): Promise<void> => {
  const editor = getActiveMarkdownEditor();
  if (!editor) {
    return;
  }

  const state = stateService.getState(editor.document.uri);
  if (state.mode === ViewMode.Edit) {
    await exitEditMode(previewService);
    return;
  }

  await enterEditMode(previewService);
};
