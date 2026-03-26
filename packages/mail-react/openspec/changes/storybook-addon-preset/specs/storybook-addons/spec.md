## ADDED Requirements

### Requirement: Copy Mail HTML toolbar button

The manager SHALL include a toolbar button labeled "Copy Mail HTML" that copies the currently rendered email HTML to the clipboard. After copying, the button text SHALL change to "Copied to clipboard!" for 2 seconds before reverting.

#### Scenario: Copy HTML to clipboard

- **WHEN** the user clicks the "Copy Mail HTML" toolbar button
- **THEN** the rendered email HTML is written to the system clipboard and the button text changes to "Copied to clipboard!" for 2 seconds

#### Scenario: HTML updates on story change

- **WHEN** the user navigates to a different story
- **THEN** the copy button reflects the new story's rendered HTML and the "copied" indicator is reset

### Requirement: Use Public Image URLs toggle

The manager SHALL include a toolbar toggle button labeled "Use public image URLs" with a tooltip explaining its purpose: "Helpful to test with real images on external devices that cannot access localhost, e.g. Email on Acid."

The toggle SHALL control the `usePublicImageUrls` Storybook global that the preview decorator reads to decide whether to replace image sources.

#### Scenario: Toggle activates public URL replacement

- **WHEN** the user clicks the "Use public image URLs" toggle to activate it
- **THEN** the toggle shows as active (checked) and the preview decorator replaces image sources with public placeholder URLs

#### Scenario: Toggle deactivates public URL replacement

- **WHEN** the user clicks the active toggle to deactivate it
- **THEN** the toggle shows as inactive (unchecked) and the preview decorator uses original image sources

### Requirement: MJML Warnings panel

The manager SHALL include a panel titled "MJML Warnings" that displays MJML validation warnings from the current story's render. MJML's API names these "errors" but they are non-fatal validation warnings that do not prevent HTML generation. The panel title SHALL include a compact badge showing the warning count (number when warnings exist, "✓" when none).

#### Scenario: No MJML warnings

- **WHEN** the current story's MJML markup is valid
- **THEN** the panel shows "✓ No MJML warnings" in green and the title badge shows "✓" with a positive status

#### Scenario: MJML warnings present

- **WHEN** the current story's MJML markup produces validation warnings
- **THEN** the panel lists each warning with its tag name, line number, and message, and the title badge shows the warning count with a negative status

#### Scenario: Panel before first render

- **WHEN** no render result has been received yet (e.g., initial load)
- **THEN** the panel renders an empty `AddonPanel` with no content

### Requirement: Addon registration

The manager entry file SHALL register all three addons (copy HTML button, public URLs toggle, MJML warnings panel) with Storybook's addon API on import. Registration SHALL happen automatically — no exported function call required.

#### Scenario: All addons visible after loading

- **WHEN** Storybook loads the manager entry file
- **THEN** the copy HTML button and public URLs toggle appear in the Storybook toolbar, and the MJML warnings panel appears in the addon panel area

### Requirement: Addon communication via single channel event

All three addons SHALL receive their data from a single Storybook channel event (`comet-mail-render-result`) emitted by the preview decorator. The event payload SHALL contain `{ html: string, mjmlWarnings: MjmlWarning[] }`.

#### Scenario: Addons receive render result

- **WHEN** the preview decorator renders a story and emits the `comet-mail-render-result` event
- **THEN** the copy HTML button updates its stored HTML, and the MJML warnings panel updates its warning list
