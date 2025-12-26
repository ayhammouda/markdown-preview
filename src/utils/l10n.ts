import * as vscode from 'vscode';

export const t = (
  message: string,
  ...args: Array<string | number | boolean | Date | undefined | null>
): string => vscode.l10n.t(message, ...args);
