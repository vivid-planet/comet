## Requirements

### Requirement: Opt-out of automatic MjmlMailRoot wrapping

The decorator SHALL skip adding its own `<MjmlMailRoot>` wrapper when `context.parameters.mailRoot` is `false`, and SHALL call `renderMailHtml` directly on `<Story />` instead.

#### Scenario: Story with mailRoot parameter set to false

- **WHEN** a story's Meta config includes `parameters: { mailRoot: false }`
- **THEN** the decorator renders `renderMailHtml(<Story />)` without adding a `<MjmlMailRoot>` wrapper

#### Scenario: Story with mailRoot parameter absent

- **WHEN** a story's Meta config does not include a `mailRoot` parameter
- **THEN** the decorator behaves as normal, wrapping the story in `<MjmlMailRoot>` before rendering
