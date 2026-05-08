## ADDED Requirements

### Requirement: Email skeleton rendering

`MjmlMailRoot` SHALL render the standard MJML email structure: `<Mjml>` wrapping `<MjmlHead>` and `<MjmlBody>`. Children passed to `MjmlMailRoot` SHALL be rendered inside `<MjmlBody>`.

#### Scenario: Basic email with a section

- **WHEN** `<MjmlMailRoot><MjmlSection>...</MjmlSection></MjmlMailRoot>` is rendered
- **THEN** the output MJML contains `<mjml><mj-head>...</mj-head><mj-body><mj-section>...</mj-section></mj-body></mjml>`

### Requirement: Default zero padding

The `<MjmlHead>` SHALL contain `<MjmlAttributes><MjmlAll padding={0} /></MjmlAttributes>` so that all MJML components default to zero padding.

#### Scenario: Components inherit zero padding

- **WHEN** `<MjmlMailRoot>` is rendered without any additional configuration
- **THEN** the MJML head includes `<mj-attributes><mj-all padding="0" /></mj-attributes>`

#### Scenario: No other default attributes

- **WHEN** `<MjmlMailRoot>` is rendered
- **THEN** the `<mj-attributes>` block contains only `<mj-all padding="0" />` and no other attribute elements

### Requirement: Exported from package entry point

`MjmlMailRoot` SHALL be exported from the package's main entry point (`src/index.ts`).

#### Scenario: Consumer imports MjmlMailRoot

- **WHEN** a consumer writes `import { MjmlMailRoot } from "@comet/mail-react"`
- **THEN** the import resolves to the `MjmlMailRoot` component

### Requirement: TSDoc documentation

`MjmlMailRoot` SHALL have a TSDoc comment on the component describing purpose and usage constraints.

#### Scenario: Component has TSDoc

- **WHEN** a developer hovers over `MjmlMailRoot` in their IDE
- **THEN** they see a TSDoc comment explaining that it is the root element for email templates

### Requirement: Storybook story

A Storybook story SHALL exist at `src/components/mailRoot/__stories__/MjmlMailRoot.stories.tsx` demonstrating `MjmlMailRoot` usage.

#### Scenario: Story renders successfully

- **WHEN** a developer opens Storybook
- **THEN** the `MjmlMailRoot` story renders a complete email skeleton as HTML

#### Scenario: Autodocs are generated

- **WHEN** the story uses the `autodocs` tag
- **THEN** Storybook generates a docs page showing the component description and props
