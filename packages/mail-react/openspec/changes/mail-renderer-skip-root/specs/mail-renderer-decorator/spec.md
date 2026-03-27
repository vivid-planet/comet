## MODIFIED Requirements

### Requirement: Automatic wrapping

The decorator SHALL automatically provide the `<MjmlMailRoot>` wrapper so that stories only need to return the inner MJML content (sections, columns, etc.) without boilerplate, unless `parameters.mailRoot` is explicitly set to `false`.

#### Scenario: Story returns only inner content

- **WHEN** a story returns `<MjmlSection><MjmlColumn><MjmlText>Hello</MjmlText></MjmlColumn></MjmlSection>`
- **THEN** the decorator wraps it as `<MjmlMailRoot><MjmlSection>...</MjmlSection></MjmlMailRoot>` before rendering

#### Scenario: Story opts out of automatic wrapping

- **WHEN** a story's Meta config includes `parameters: { mailRoot: false }`
- **THEN** the decorator does NOT add a `<MjmlMailRoot>` wrapper and renders the story's own output directly
