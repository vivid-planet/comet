## Requirements

### Requirement: renderMailHtml function

The `renderMailHtml` function SHALL accept a `ReactElement` and an optional `Mjml2HtmlOptions` parameter, and SHALL return an object with `html` (string) and `mjmlWarnings` (array of MJML validation warnings).

#### Scenario: Basic rendering

- **WHEN** `renderMailHtml` is called with a React element tree containing MJML components
- **THEN** it returns `{ html, mjmlWarnings }` where `html` is the rendered HTML string

#### Scenario: Options passthrough

- **WHEN** `renderMailHtml` is called with a second argument containing `mjml2html` options
- **THEN** those options are forwarded to the underlying `mjml2html` call, merged with the default `validationLevel: "soft"`

#### Scenario: Default validation level

- **WHEN** `renderMailHtml` is called without specifying `validationLevel` in options
- **THEN** the underlying `mjml2html` call uses `validationLevel: "soft"`

#### Scenario: MJML warnings collected

- **WHEN** the MJML markup produces validation warnings
- **THEN** the warnings are returned in the `mjmlWarnings` field (not thrown)

### Requirement: Server sub-path export

The package SHALL export `renderMailHtml` from the `@comet/mail-react/server` sub-path. This entry point SHALL use the `mjml` package (Node.js) for MJML-to-HTML conversion.

#### Scenario: Import from server sub-path in Node.js

- **WHEN** a consumer writes `import { renderMailHtml } from "@comet/mail-react/server"`
- **THEN** the import resolves successfully in a Node.js environment and `renderMailHtml` is available

#### Scenario: Server sub-path uses Node.js mjml

- **WHEN** the server `renderMailHtml` is called
- **THEN** it uses the `mjml` package internally (which depends on `fs`)

### Requirement: Client sub-path export

The package SHALL export `renderMailHtml` from the `@comet/mail-react/client` sub-path. This entry point SHALL use the `mjml-browser` package for MJML-to-HTML conversion.

#### Scenario: Import from client sub-path in browser

- **WHEN** a consumer writes `import { renderMailHtml } from "@comet/mail-react/client"`
- **THEN** the import resolves successfully in a browser environment and `renderMailHtml` is available

#### Scenario: Client sub-path uses browser mjml

- **WHEN** the client `renderMailHtml` is called
- **THEN** it uses the `mjml-browser` package internally (which does not depend on `fs`)

### Requirement: Package exports map

The `package.json` `exports` field SHALL include entries for `"./server"` and `"./client"` pointing to the respective compiled entry points. All export entries SHALL use the plain string format (not the `{ types, default }` object format).

#### Scenario: Exports map structure

- **WHEN** a consumer or bundler reads the `package.json` exports map
- **THEN** it finds `"./server"` mapping to `"./lib/server/index.js"` and `"./client"` mapping to `"./lib/client/index.js"`

### Requirement: mjml and mjml-browser as dependencies

The `mjml` and `mjml-browser` packages SHALL be listed as production `dependencies` in `package.json` so that consumers do not need to install them separately.

#### Scenario: Consumer installs only @comet/mail-react

- **WHEN** a consumer runs `npm install @comet/mail-react`
- **THEN** both `mjml` and `mjml-browser` are installed as transitive dependencies

### Requirement: Integration test for server renderMailHtml
An integration test SHALL exist at `src/server/renderMailHtml.test.tsx` verifying the server-side render pipeline. The test SHALL render a simple component tree (`MjmlMailRoot > MjmlSection > MjmlColumn > MjmlText`) via `server/renderMailHtml` and verify the output.

#### Scenario: Rendered HTML contains a doctype
- **WHEN** the test renders a valid MJML component tree via `server/renderMailHtml`
- **THEN** the returned `html` string starts with `<!doctype html>` (case-insensitive)

#### Scenario: Rendered HTML contains the passed-in text content
- **WHEN** the test renders a component tree containing `<MjmlText>` with specific text
- **THEN** the returned `html` string contains that text

#### Scenario: Valid component tree produces no MJML warnings
- **WHEN** the test renders a valid MJML component tree
- **THEN** the returned `mjmlWarnings` array is empty

### Requirement: Sub-paths export only renderMailHtml

The `/server` and `/client` sub-paths SHALL export only the `renderMailHtml` function. Components, blocks, and other utilities SHALL remain exclusively on the main `"."` entry point.

#### Scenario: No component exports from sub-paths

- **WHEN** a consumer imports from `@comet/mail-react/server` or `@comet/mail-react/client`
- **THEN** only `renderMailHtml` is available; no MJML components or block factories are exported
