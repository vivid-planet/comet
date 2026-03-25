## Requirements

### Requirement: Drop-in replacement for base MjmlSection

The custom `MjmlSection` component SHALL accept all props that the `@faire/mjml-react` `MjmlSection` accepts and forward them to the underlying component. Existing call sites that use `MjmlSection` without any of the new props SHALL produce identical output.

#### Scenario: Base props are forwarded

- **WHEN** a consumer renders `<MjmlSection backgroundColor="#fff" padding="10px">` without any new props
- **THEN** the underlying `@faire/mjml-react` `MjmlSection` receives `backgroundColor="#fff"` and `padding="10px"` and renders identically to a direct usage

#### Scenario: className is forwarded

- **WHEN** a consumer passes a `className` prop
- **THEN** the className is forwarded to the underlying `MjmlSection`

### Requirement: Disable responsive behavior via `disableResponsiveBehavior` prop

The component SHALL accept a `disableResponsiveBehavior` boolean prop (default `false`). When `true`, all children SHALL be wrapped in a single `MjmlGroup` element, preventing columns from stacking vertically on mobile viewports.

#### Scenario: Default behavior (responsive)

- **WHEN** `disableResponsiveBehavior` is not set or `false`
- **THEN** children are rendered directly inside the section without a `MjmlGroup` wrapper

#### Scenario: Responsive behavior disabled

- **WHEN** `disableResponsiveBehavior` is `true`
- **THEN** children are wrapped in a single `MjmlGroup` element

### Requirement: SlotProps for sub-element customization

The component SHALL accept a `slotProps` object prop with an optional `group` key. The value of `group` SHALL be a partial set of `MjmlGroupProps` that are spread onto the `MjmlGroup` element when it is rendered (i.e., when `disableResponsiveBehavior` is `true`).

#### Scenario: SlotProps applied to group

- **WHEN** `disableResponsiveBehavior` is `true` AND `slotProps={{ group: { width: "50%" } }}`
- **THEN** the `MjmlGroup` element receives `width="50%"`

#### Scenario: SlotProps ignored when group not rendered

- **WHEN** `disableResponsiveBehavior` is `false` AND `slotProps={{ group: { width: "50%" } }}`
- **THEN** no `MjmlGroup` is rendered and the `slotProps.group` values have no effect

### Requirement: Props type exported

The component's props type SHALL be exported as `MjmlSectionProps` from the package entry point, replacing the previous re-export of `@faire/mjml-react`'s type. The base component and type SHALL NOT be exposed — consumers only interact with the custom version.

#### Scenario: Custom props type importable

- **WHEN** a consumer writes `import { type MjmlSectionProps } from "@comet/mail-react"`
- **THEN** the type includes the custom props (`disableResponsiveBehavior`, `slotProps`) in addition to all base section props

