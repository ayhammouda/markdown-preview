import * as vscode from 'vscode';
import { minimatch } from 'minimatch';
import { ExtensionConfiguration } from '../types/config';

export type ConfigInspection<T> = {
  defaultValue?: T;
  globalValue?: T;
  workspaceValue?: T;
  workspaceFolderValue?: T;
};

const DEFAULT_CONFIG: ExtensionConfiguration = {
  enabled: true,
  excludePatterns: ['**/node_modules/**', '**/.git/**'],
  maxFileSize: 1_048_576,
};

export class ConfigService {
  private readonly cachedConfigs = new Map<string, ExtensionConfiguration>();

  /**
   * Return the enabled flag for the provided resource.
   * @param resource Optional resource URI for scoped settings.
   * @returns True when the extension is enabled.
   * @throws No errors expected.
   */
  getEnabled(resource?: vscode.Uri): boolean {
    return this.getConfig(resource).enabled;
  }

  /**
   * Return exclude patterns for the provided resource.
   * @param resource Optional resource URI for scoped settings.
   * @returns The glob patterns for excluded files.
   * @throws No errors expected.
   */
  getExcludePatterns(resource?: vscode.Uri): string[] {
    return this.getConfig(resource).excludePatterns;
  }

  /**
   * Return the maximum file size for auto-preview.
   * @param resource Optional resource URI for scoped settings.
   * @returns The max file size in bytes.
   * @throws No errors expected.
   */
  getMaxFileSize(resource?: vscode.Uri): number {
    return this.getConfig(resource).maxFileSize;
  }

  /**
   * Resolve the effective configuration for the provided resource.
   * @param resource Optional resource URI for scoped settings.
   * @returns The resolved configuration.
   * @throws No errors expected.
   */
  getConfig(resource?: vscode.Uri): ExtensionConfiguration {
    const cacheKey = this.getCacheKey(resource);
    const cached = this.cachedConfigs.get(cacheKey);
    if (cached) {
      return cached;
    }

    const config = this.loadConfig(resource);
    this.cachedConfigs.set(cacheKey, config);
    return config;
  }

  /**
   * Reload and cache configuration for the provided resource.
   * @param resource Optional resource URI for scoped settings.
   * @returns The refreshed configuration.
   * @throws No errors expected.
   */
  reload(resource?: vscode.Uri): ExtensionConfiguration {
    const config = this.loadConfig(resource);
    this.cachedConfigs.set(this.getCacheKey(resource), config);
    return config;
  }

  /**
   * Clear all cached configurations.
   * @returns void
   * @throws No errors expected.
   */
  clearCache(): void {
    this.cachedConfigs.clear();
  }

  /**
   * Inspect configuration values across scopes.
   * @param resource Optional resource URI for scoped settings.
   * @returns Configuration inspection data per scope.
   * @throws No errors expected.
   */
  inspect(resource?: vscode.Uri): {
    enabled?: ConfigInspection<boolean>;
    excludePatterns?: ConfigInspection<string[]>;
    maxFileSize?: ConfigInspection<number>;
  } {
    const config = vscode.workspace.getConfiguration('markdownReader', resource);
    return {
      enabled: config.inspect<boolean>('enabled'),
      excludePatterns: config.inspect<string[]>('excludePatterns'),
      maxFileSize: config.inspect<number>('maxFileSize'),
    };
  }

  /**
   * Check whether a resource matches any exclusion pattern.
   * @param uri Resource URI to test.
   * @returns True when the resource is excluded.
   * @throws No errors expected.
   */
  isExcluded(uri: vscode.Uri): boolean {
    // Use workspace-relative paths so glob patterns align with user expectations.
    const filePath = vscode.workspace.asRelativePath(uri, false);
    const config = this.getConfig(uri);
    return config.excludePatterns.some((pattern) =>
      minimatch(filePath, pattern, { dot: true, nocase: true })
    );
  }

  private getCacheKey(resource?: vscode.Uri): string {
    return resource?.toString() ?? '__global__';
  }

  private loadConfig(resource?: vscode.Uri): ExtensionConfiguration {
    const config = vscode.workspace.getConfiguration('markdownReader', resource);
    return {
      enabled: config.get('enabled', DEFAULT_CONFIG.enabled),
      excludePatterns: config.get('excludePatterns', DEFAULT_CONFIG.excludePatterns),
      maxFileSize: config.get('maxFileSize', DEFAULT_CONFIG.maxFileSize),
    };
  }
}
