## Requirements

### Requirement: MJML-to-HTML rendering

The decorator SHALL convert the story's React element tree into rendered HTML by:
1. Wrapping the story node in `<MjmlMailRoot>...</MjmlMailRoot>`
2. Converting the combined tree to HTML using the `renderMailHtml` function imported from the client sub-path
3. Displaying the resulting HTML via `dangerouslySetInnerHTML`

#### Scenario: Component renders as email HTML

- **WHEN** a story returns an MJML component (e.g., `<MjmlSection>`)
- **THEN** the decorator wraps it in `<MjmlMailRoot>`, converts to HTML via `renderMailHtml`, and displays the rendered email output

#### Scenario: Nested MJML components render correctly

- **WHEN** a story returns a tree of MJML components (e.g., `<MjmlSection><MjmlColumn><MjmlText>`)
- **THEN** the full tree is rendered as valid email HTML

### Requirement: Automatic wrapping

The decorator SHALL automatically provide the `<MjmlMailRoot>` wrapper so that stories only need to return the inner MJML content (sections, columns, etc.) without boilerplate, unless `parameters.mailRoot` is explicitly set to `false`.

#### Scenario: Story returns only inner content

- **WHEN** a story returns `<MjmlSection><MjmlColumn><MjmlText>Hello</MjmlText></MjmlColumn></MjmlSection>`
- **THEN** the decorator wraps it as `<MjmlMailRoot><MjmlSection>...</MjmlSection></MjmlMailRoot>` before rendering

#### Scenario: Story opts out of automatic wrapping

- **WHEN** a story's Meta config includes `parameters: { mailRoot: false }`
- **THEN** the decorator does NOT add a `<MjmlMailRoot>` wrapper and renders the story's own output directly

### Requirement: MJML warnings logged to console

The decorator SHALL log MJML warnings to the browser console via `console.warn`. The `mjml2html` function returns an `errors` array containing non-breaking warnings (named `errors` by MJML's API, not by us). The decorator SHALL destructure this as `mjmlWarnings` to reflect their actual severity and log each one.

#### Scenario: MJML produces warnings

- **WHEN** a story's MJML markup produces validation warnings (e.g., invalid attribute)
- **THEN** each warning is logged via `console.warn` in the browser console

#### Scenario: No MJML warnings

- **WHEN** a story's MJML markup is valid and produces no warnings
- **THEN** no warnings are logged to the console

### Requirement: Applied as global decorator

The decorator SHALL be registered as a global decorator via the preset's preview annotation so that all stories automatically get MJML rendering without per-story configuration.

#### Scenario: New story without explicit decorator

- **WHEN** a developer creates a new `*.stories.tsx` file with no custom decorators
- **THEN** the story automatically renders through the mail renderer decorator

### Requirement: Decorator file location

The decorator SHALL be defined in `src/storybook/MailRendererDecorator.tsx`.

#### Scenario: File exists at expected path

- **WHEN** the library source is complete
- **THEN** `src/storybook/MailRendererDecorator.tsx` exists and exports the decorator

### Requirement: Render result emission

The decorator SHALL emit a single Storybook channel event (`comet-mail-render-result`) after each render. The payload SHALL be `{ html: string, mjmlWarnings: MjmlWarning[] }` where `html` is the final rendered HTML (after any post-processing) and `mjmlWarnings` is the array of MJML validation warnings.

#### Scenario: Addons receive render data

- **WHEN** a story is rendered
- **THEN** the decorator emits `comet-mail-render-result` with the rendered HTML and any MJML warnings

#### Scenario: Event updates on re-render

- **WHEN** the story re-renders (due to arg changes or story navigation)
- **THEN** a new `comet-mail-render-result` event is emitted with the updated data

### Requirement: Public image URL replacement

When the `usePublicImageUrls` Storybook global is `true`, the decorator SHALL replace `src` attributes of all `<img>` tags in the rendered HTML with public placeholder URLs from `https://picsum.photos`. Each image SHALL use an incrementing seed counter so different images produce different placeholder photos. The URL format SHALL be `https://picsum.photos/seed/{seed}/{width*2}/{height*2}`, using twice the image's `width` and `height` attributes to produce sharp results on high-DPI/retina displays.

The replacement SHALL handle `<img>` tags regardless of whether `width` appears before or after `height` in the tag's attributes.

#### Scenario: Public URLs toggle is active

- **WHEN** the `usePublicImageUrls` global is `true`
- **THEN** all `<img>` tags in the rendered HTML have their `src` replaced with `https://picsum.photos/seed/{seed}/{width*2}/{height*2}`, each with a unique incrementing seed

#### Scenario: Public URLs toggle is inactive

- **WHEN** the `usePublicImageUrls` global is `false` or `undefined`
- **THEN** the rendered HTML is displayed with original image sources

#### Scenario: Image dimensions doubled for high-DPI

- **WHEN** an `<img>` tag has `width="300"` and `height="200"`
- **THEN** the replacement URL uses dimensions `600x400` (2x for sharp rendering on retina displays)
