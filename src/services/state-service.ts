import * as vscode from 'vscode';
import { FileState, ViewMode } from '../types/state';
import { t } from '../utils/l10n';

export class StateService {
  private readonly states = new Map<string, FileState>();

  /**
   * Get the cached state for a URI, if it exists.
   * @param uri The file URI.
   * @returns The cached state or undefined.
   * @throws No errors expected.
   */
  getExistingState(uri: vscode.Uri): FileState | undefined {
    return this.states.get(uri.toString());
  }

  /**
   * Get or create state for a URI.
   * @param uri The file URI.
   * @returns The current state for the URI.
   * @throws No errors expected.
   */
  getState(uri: vscode.Uri): FileState {
    const key = uri.toString();
    const existing = this.states.get(key);
    if (existing) {
      return existing;
    }

    const state: FileState = {
      uri: key,
      mode: ViewMode.Preview,
      lastModeChange: Date.now(),
      editorVisible: false,
    };
    this.states.set(key, state);
    return state;
  }

  /**
   * Update the view mode for a URI and announce the change.
   * @param uri The file URI.
   * @param mode The target view mode.
   * @returns void
   * @throws No errors expected.
   */
  setMode(uri: vscode.Uri, mode: ViewMode): void {
    const state = this.getState(uri);
    const previousMode = state.mode;
    state.mode = mode;
    state.lastModeChange = Date.now();
    void vscode.commands.executeCommand(
      'setContext',
      'markdownReader.editMode',
      mode === ViewMode.Edit
    );
    if (previousMode !== mode) {
      const message =
        mode === ViewMode.Edit ? t('Edit mode enabled') : t('Preview mode enabled');
      vscode.window.setStatusBarMessage(message, 2000);
    }
  }

  /**
   * Update editor visibility for a URI.
   * @param uri The file URI.
   * @param visible Whether the editor is visible.
   * @returns void
   * @throws No errors expected.
   */
  setEditorVisible(uri: vscode.Uri, visible: boolean): void {
    const state = this.getState(uri);
    state.editorVisible = visible;
  }

  /**
   * Store the last cursor position for a URI.
   * @param uri The file URI.
   * @param position The cursor position.
   * @returns void
   * @throws No errors expected.
   */
  setLastSelection(uri: vscode.Uri, position: vscode.Position): void {
    const state = this.getState(uri);
    state.lastSelection = { line: position.line, character: position.character };
  }

  /**
   * Retrieve the last cursor position for a URI.
   * @param uri The file URI.
   * @returns The cursor position or undefined.
   * @throws No errors expected.
   */
  getLastSelection(uri: vscode.Uri): vscode.Position | undefined {
    const state = this.getExistingState(uri);
    if (!state?.lastSelection) {
      return undefined;
    }
    return new vscode.Position(state.lastSelection.line, state.lastSelection.character);
  }

  /**
   * Clear state for a URI.
   * @param uri The file URI.
   * @returns void
   * @throws No errors expected.
   */
  clear(uri: vscode.Uri): void {
    this.states.delete(uri.toString());
  }
}
