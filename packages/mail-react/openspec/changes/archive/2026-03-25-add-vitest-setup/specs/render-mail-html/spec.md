## ADDED Requirements

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
