## MODIFIED Requirements

### Requirement: MJML-to-HTML rendering

The decorator SHALL convert the story's React element tree into rendered HTML by:
1. Wrapping the story node in `<MjmlMailRoot>...</MjmlMailRoot>`
2. Converting the combined tree to HTML using the `renderMailHtml` function imported from the client sub-path (`../src/client/renderMailHtml.js`)
3. Displaying the resulting HTML via `dangerouslySetInnerHTML`

#### Scenario: Component renders as email HTML

- **WHEN** a story returns an MJML component (e.g., `<MjmlSection>`)
- **THEN** the decorator wraps it in `<MjmlMailRoot>`, converts to HTML via `renderMailHtml`, and displays the rendered email output

#### Scenario: Nested MJML components render correctly

- **WHEN** a story returns a tree of MJML components (e.g., `<MjmlSection><MjmlColumn><MjmlText>`)
- **THEN** the full tree is rendered as valid email HTML
