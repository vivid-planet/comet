## ADDED Requirements

### Requirement: Single addon entry in Storybook configuration

Consumers SHALL add the addon to their `.storybook/main.ts` `addons` array as `"@comet/mail-react/storybook"`. This single entry SHALL auto-register the mail rendering decorator, all manager addons, and the `usePublicImageUrls` initial global.

#### Scenario: Consumer adds addon

- **WHEN** a consumer adds `"@comet/mail-react/storybook"` to the `addons` array in `.storybook/main.ts`
- **THEN** the mail rendering decorator is applied to all stories, the three manager addons appear in the Storybook UI, and the `usePublicImageUrls` global is declared

#### Scenario: No additional wiring needed

- **WHEN** a consumer has only added the addon to `main.ts`
- **THEN** no `.storybook/manager.tsx` file, no manual decorator registration in `preview.tsx`, and no `initialGlobals` declaration are required from the consumer

### Requirement: Preset entry point

The `package.json` `exports` field SHALL include `"./storybook"` mapping to `"./lib/storybook/index.js"`. The entry point SHALL export `managerEntries` and `previewAnnotations` functions that return filesystem paths to the manager and preview entry files.

#### Scenario: Storybook loads the preset

- **WHEN** Storybook resolves the addon name `@comet/mail-react/storybook`
- **THEN** the resolved module is loaded as a preset, and its `managerEntries()` and `previewAnnotations()` functions are called to discover entry files

### Requirement: Manager entry via preset

The preset's `managerEntries` function SHALL return a filesystem path to `manager.js` in the same directory as the preset file. The manager entry SHALL be auto-loaded by Storybook to register all addons.

#### Scenario: Manager addons are registered

- **WHEN** Storybook calls the preset's `managerEntries()` function
- **THEN** it returns a path to the manager file, and Storybook loads it to register the toolbar buttons and panel

### Requirement: Preview annotation via preset

The preset's `previewAnnotations` function SHALL return a filesystem path to `preview.js` in the same directory as the preset file. The preview annotation SHALL export `decorators` and `initialGlobals`.

#### Scenario: Decorator and globals are applied

- **WHEN** Storybook calls the preset's `previewAnnotations()` function
- **THEN** it returns a path to the preview file, and Storybook loads its `decorators` and `initialGlobals` exports

### Requirement: initialGlobals declaration

The preview annotation SHALL export `initialGlobals` containing `{ usePublicImageUrls: false }`. This ensures the global is declared before any addon attempts to call `updateGlobals()`.

#### Scenario: Toggle does not cause runtime error

- **WHEN** a user clicks the "Use public image URLs" toggle in the Storybook toolbar
- **THEN** `updateGlobals({ usePublicImageUrls: true })` succeeds without throwing "Attempted to set a global that is not defined in initial globals or globalTypes"

#### Scenario: Default state is off

- **WHEN** a consumer's Storybook loads for the first time
- **THEN** the `usePublicImageUrls` global is `false`

### Requirement: Source file location

All storybook source files SHALL live under `src/storybook/`. The preset entry SHALL be `src/storybook/index.ts`, the manager entry SHALL be `src/storybook/manager.tsx`, and the preview entry SHALL be `src/storybook/preview.ts`.

#### Scenario: Compiled output exists after build

- **WHEN** `pnpm run build` completes
- **THEN** `lib/storybook/index.js`, `lib/storybook/manager.js`, and `lib/storybook/preview.js` exist

### Requirement: No public API beyond addon name

The manager and preview files SHALL NOT be exported in `package.json`. They are internal files referenced by filesystem path from the preset entry. Consumers SHALL NOT import them directly.

#### Scenario: Direct import fails

- **WHEN** a consumer tries `import "@comet/mail-react/storybook/manager"`
- **THEN** the import fails to resolve because the path is not in the exports map

### Requirement: Storybook as optional peer dependency

The `package.json` SHALL list `storybook` as an optional `peerDependency` (`>=10.0.0`).

#### Scenario: Consumer without Storybook

- **WHEN** a consumer installs `@comet/mail-react` without Storybook
- **THEN** the installation succeeds and the main/client/server exports work normally
