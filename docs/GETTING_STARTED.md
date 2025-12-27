# Getting Started

This guide walks a new contributor through a first successful run of the
Markdown Preview extension, from cloning the repo to verifying behavior inside
an Extension Development Host.

## Prerequisites

- Node.js (LTS recommended)
- VS Code 1.107 or later

## 1) Install dependencies

```sh
npm ci
```

## 2) Build the extension

```sh
npm run compile
```

This compiles both the extension and the integration test bundle.

## 3) Launch the Extension Development Host

1. Open the repository in VS Code.
2. Press `F5`.
3. A new VS Code window opens (Extension Development Host).

## 4) Validate core behavior

1. Open any `.md` file in the Extension Development Host.
2. Confirm it opens in preview mode by default.
3. Run **Markdown Preview: Enter Edit Mode** to open a split editor.
4. Use **Done (Exit Edit Mode)** to return to preview-only mode.

## 5) Common commands

```sh
npm test
npm run lint
npm run package
```

## 6) Where to look next

- `docs/ARCHITECTURE.md` explains the services and event flow.
- `docs/DEVELOPMENT.md` details debugging and workflow tips.
- `docs/TESTING.md` covers integration tests and coverage.
