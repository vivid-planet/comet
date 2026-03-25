## ADDED Requirements

### Requirement: MailRendererDecorator export

The `@comet/mail-react/storybook-preview` sub-path SHALL export a Storybook `Decorator` named `MailRendererDecorator` that consumers add to their preview's `decorators` array.

#### Scenario: Consumer uses the decorator

- **WHEN** a consumer adds `MailRendererDecorator` to their Storybook preview decorators
- **THEN** all stories are rendered through the mail rendering pipeline

### Requirement: MJML rendering pipeline

The decorator SHALL wrap the story's React element in `<MjmlMailRoot>` and convert it to HTML using `renderMailHtml` from the client sub-path. The rendered HTML SHALL be displayed via `dangerouslySetInnerHTML`.

#### Scenario: Story renders as email HTML

- **WHEN** a story returns MJML components (e.g., `<MjmlSection>`)
- **THEN** the decorator wraps them in `<MjmlMailRoot>`, renders to HTML, and displays the result

### Requirement: Render result emission

The decorator SHALL emit a single Storybook channel event (`comet-mail-render-result`) after each render. The payload SHALL be `{ html: string, mjmlWarnings: MjmlWarning[] }` where `html` is the final rendered HTML (after any post-processing) and `mjmlWarnings` is the array of MJML validation warnings.

#### Scenario: Addons receive render data

- **WHEN** a story is rendered
- **THEN** the decorator emits `comet-mail-render-result` with the rendered HTML and any MJML warnings

#### Scenario: Event updates on re-render

- **WHEN** the story re-renders (due to arg changes or story navigation)
- **THEN** a new `comet-mail-render-result` event is emitted with the updated data

### Requirement: Public image URL replacement

When the public-image-URLs Storybook global is active, the decorator SHALL replace `src` attributes of all `<img>` tags in the rendered HTML with public placeholder URLs from `https://picsum.photos`. Each image SHALL use an incrementing seed counter so different images produce different placeholder photos. The URL format SHALL be `https://picsum.photos/seed/{seed}/{width*2}/{height*2}`, using twice the image's `width` and `height` attributes to produce sharp results on high-DPI/retina displays.

The replacement SHALL handle `<img>` tags regardless of whether `width` appears before or after `height` in the tag's attributes.

#### Scenario: Public URLs toggle is active

- **WHEN** the public-image-URLs global is `true`
- **THEN** all `<img>` tags in the rendered HTML have their `src` replaced with `https://picsum.photos/seed/{seed}/{width*2}/{height*2}`, each with a unique incrementing seed

#### Scenario: Public URLs toggle is inactive

- **WHEN** the public-image-URLs global is `false` or `undefined`
- **THEN** the rendered HTML is displayed with original image sources

#### Scenario: Image dimensions doubled for high-DPI

- **WHEN** an `<img>` tag has `width="300"` and `height="200"`
- **THEN** the replacement URL uses dimensions `600x400` (2x for sharp rendering on retina displays)

### Requirement: Source file location

The preview decorator source files SHALL live under `src/storybook-preview/`. The entry point SHALL be `src/storybook-preview/index.ts` which compiles to `lib/storybook-preview/index.js`.

#### Scenario: Compiled output exists after build

- **WHEN** `pnpm run build` completes
- **THEN** `lib/storybook-preview/index.js` exists and is resolvable via the `./storybook-preview` export

### Requirement: Package export for storybook-preview

The `package.json` `exports` field SHALL include `"./storybook-preview"` mapping to `"./lib/storybook-preview/index.js"`.

#### Scenario: Consumer can import the preview decorator

- **WHEN** a consumer writes `import { MailRendererDecorator } from "@comet/mail-react/storybook-preview"` in a project that has both `@comet/mail-react` and `storybook` installed
- **THEN** the import resolves successfully and `MailRendererDecorator` is a valid Storybook decorator

### Requirement: Storybook as optional peer dependency

The `package.json` SHALL list `storybook` as an optional `peerDependency` to signal that the storybook exports require Storybook to be installed.

#### Scenario: Consumer without Storybook

- **WHEN** a consumer installs `@comet/mail-react` without Storybook
- **THEN** the installation succeeds (no mandatory dependency failure) and the main/client/server exports work normally
