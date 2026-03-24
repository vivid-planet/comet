## Requirements

### Requirement: MJML-to-HTML rendering

The decorator SHALL convert the story's React element tree into rendered HTML by:
1. Wrapping the story node in `<Mjml><MjmlBody>...</MjmlBody></Mjml>`
2. Converting the React tree to an MJML string using `renderToMjml`
3. Converting the MJML string to HTML using `mjml2html` from `mjml-browser`
4. Displaying the resulting HTML via `dangerouslySetInnerHTML`

#### Scenario: Component renders as email HTML

- **WHEN** a story returns an MJML component (e.g., `<MjmlSection>`)
- **THEN** the decorator wraps it in `<Mjml><MjmlBody>`, converts to HTML, and displays the rendered email output

#### Scenario: Nested MJML components render correctly

- **WHEN** a story returns a tree of MJML components (e.g., `<MjmlSection><MjmlColumn><MjmlText>`)
- **THEN** the full tree is rendered as valid email HTML

### Requirement: Automatic wrapping

The decorator SHALL automatically provide the `<Mjml>` and `<MjmlBody>` wrapper so that stories only need to return the inner MJML content (sections, columns, etc.) without boilerplate.

#### Scenario: Story returns only inner content

- **WHEN** a story returns `<MjmlSection><MjmlColumn><MjmlText>Hello</MjmlText></MjmlColumn></MjmlSection>`
- **THEN** the decorator wraps it as `<Mjml><MjmlBody><MjmlSection>...</MjmlSection></MjmlBody></Mjml>` before rendering

### Requirement: MJML warnings logged to console

The decorator SHALL log MJML warnings to the browser console via `console.warn`. The `mjml2html` function returns an `errors` array containing non-breaking warnings (named `errors` by MJML's API, not by us). The decorator SHALL destructure this as `mjmlWarnings` to reflect their actual severity and log each one.

#### Scenario: MJML produces warnings

- **WHEN** a story's MJML markup produces validation warnings (e.g., invalid attribute)
- **THEN** each warning is logged via `console.warn` in the browser console

#### Scenario: No MJML warnings

- **WHEN** a story's MJML markup is valid and produces no warnings
- **THEN** no warnings are logged to the console

### Requirement: Applied as global decorator

The decorator SHALL be registered as a global decorator in `.storybook/preview.tsx` so that all stories automatically get MJML rendering without per-story configuration.

#### Scenario: New story without explicit decorator

- **WHEN** a developer creates a new `*.stories.tsx` file with no custom decorators
- **THEN** the story automatically renders through the mail renderer decorator

### Requirement: Decorator file location

The decorator SHALL be defined in `.storybook/MailRenderer.decorator.tsx`.

#### Scenario: File exists at expected path

- **WHEN** the storybook setup is complete
- **THEN** `.storybook/MailRenderer.decorator.tsx` exists and exports the decorator
