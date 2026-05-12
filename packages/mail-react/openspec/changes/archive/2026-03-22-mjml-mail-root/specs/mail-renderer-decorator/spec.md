## MODIFIED Requirements

### Requirement: MJML-to-HTML rendering

The decorator SHALL convert the story's React element tree into rendered HTML by:
1. Wrapping the story node in `<MjmlMailRoot>...</MjmlMailRoot>`
2. Converting the React tree to an MJML string using `renderToMjml`
3. Converting the MJML string to HTML using `mjml2html` from `mjml-browser`
4. Displaying the resulting HTML via `dangerouslySetInnerHTML`

#### Scenario: Component renders as email HTML

- **WHEN** a story returns an MJML component (e.g., `<MjmlSection>`)
- **THEN** the decorator wraps it in `<MjmlMailRoot>`, converts to HTML, and displays the rendered email output

#### Scenario: Nested MJML components render correctly

- **WHEN** a story returns a tree of MJML components (e.g., `<MjmlSection><MjmlColumn><MjmlText>`)
- **THEN** the full tree is rendered as valid email HTML

### Requirement: Automatic wrapping

The decorator SHALL automatically provide the `<MjmlMailRoot>` wrapper so that stories only need to return the inner MJML content (sections, columns, etc.) without boilerplate.

#### Scenario: Story returns only inner content

- **WHEN** a story returns `<MjmlSection><MjmlColumn><MjmlText>Hello</MjmlText></MjmlColumn></MjmlSection>`
- **THEN** the decorator wraps it as `<MjmlMailRoot><MjmlSection>...</MjmlSection></MjmlMailRoot>` before rendering
