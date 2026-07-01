---
title: Blocks
---

`@comet/mail-react` ships basic block components to render Comet CMS block data types. Where the [base components](./2-components-and-theme.md) handle generic layout and typography, block components are tied to specific `*BlockData` shapes from the CMS schema.

:::info
For background on the broader Comet block system — what blocks are, how they're authored, and how block data flows from API to admin to site — see [Blocks](../../2-core-concepts/2-blocks/index.md) in the core concepts.
:::

## Pixel-image blocks

Two components render `PixelImageBlockData` from the CMS — one for MJML context, one for raw HTML.

| Component             | Renders                 | Use within                                                                        |
| --------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `MjmlPixelImageBlock` | re-exported `MjmlImage` | an `MjmlColumn` (standard MJML layout model)                                      |
| `HtmlPixelImageBlock` | raw `<img>`             | raw HTML or [MJML ending tags](./1-email-basics.md#ending-tags) such as `MjmlRaw` |

```tsx
import { MjmlColumn, MjmlPixelImageBlock, MjmlSection } from "@comet/mail-react";

<MjmlSection indent>
    <MjmlColumn>
        <MjmlPixelImageBlock data={pixelImageData} width={536} />
    </MjmlColumn>
</MjmlSection>;
```

### Configuration

Both blocks read `validSizes` and `baseUrl` from `config.pixelImageBlock`. In a typical Comet project, `validSizes` is the union of `cometConfig.images.imageSizes` and `cometConfig.images.deviceSizes`; `baseUrl` is the API URL.

```tsx title="src/emails/WelcomeEmail.tsx"
import { MjmlMailRoot, type Config } from "@comet/mail-react";

const config: Config = {
    pixelImageBlock: {
        validSizes: [...cometConfig.images.imageSizes, ...cometConfig.images.deviceSizes],
        baseUrl: process.env.API_URL,
    },
};

<MjmlMailRoot config={config}>
    {/* Pixel-image blocks anywhere in the tree read this config */}
</MjmlMailRoot>;
```

### Render width

The `width` prop is the desktop render width — the width at which the image displays in the default breakpoint. The block picks an actual source size from `config.pixelImageBlock.validSizes`, accounting for retina displays.

```tsx
<MjmlPixelImageBlock data={pixelImageData} width={536} />
```

Use `largestPossibleRenderWidth` when an image stretches wider on a narrower breakpoint than its desktop render width — e.g. in a two-column layout that stacks on mobile. The default is `theme.sizes.bodyWidth`.

```tsx
<MjmlPixelImageBlock data={pixelImageData} width={300} largestPossibleRenderWidth={420} />
```

### Aspect ratio

By default, the rendered aspect ratio comes from the DAM crop area. The `aspectRatio` prop overrides it — useful when the same image renders at different ratios across templates. Accepts a number or a `"WxH"` / `"W:H"` / `"W/H"` string.

```tsx
<MjmlPixelImageBlock data={pixelImageData} width={536} aspectRatio="16x9" />
```

### Responsive scaling

On viewports narrower than the default body width, both blocks automatically scale the rendered image to fit its container.

## Rich-text blocks

The `createRichTextBlockRenderer` factory creates a component that renders `RichTextBlockData` (draft-js raw content) from the CMS. Each call binds one configuration to one `blockTextComponent`, which determines how each draft block is rendered:

| `blockTextComponent` | Renders each draft block as | Use within                                                                        |
| -------------------- | --------------------------- | --------------------------------------------------------------------------------- |
| `MjmlBlockText`      | `MjmlText`                  | an `MjmlColumn` (standard MJML layout model)                                      |
| `HtmlBlockText`      | `HtmlText` (`<div>`)        | raw HTML or [MJML ending tags](./1-email-basics.md#ending-tags) such as `MjmlRaw` |

Call the factory once per component — at the top level of a file, not inside a component — and export the returned components. To render the same configuration in both MJML and raw-HTML contexts, call it once with each `blockTextComponent`:

```tsx title="src/emails/blocks/richText.ts"
import { createRichTextBlockRenderer, HtmlBlockText, MjmlBlockText } from "@comet/mail-react";

const blockTypes = {
    "header-one": { variant: "heading1" },
    "header-two": { variant: "heading2" },
    "paragraph-standard": { variant: "body" },
};

export const MjmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: MjmlBlockText, blockTypes });
export const HtmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText, blockTypes });
```

Usage sites then pass only the block data:

```tsx
<MjmlSection indent>
    <MjmlColumn>
        <MjmlRichTextBlock data={richTextData} />
    </MjmlColumn>
</MjmlSection>
```

### Block type configuration

The `blockTypes` option maps the application's draft block types to the styling of the text component that renders them. Each entry accepts a theme [text variant](./2-components-and-theme.md), plain style values (`color`, `fontSize`, `fontWeight`, …), and a `className`.

The factory works without `blockTypes`: passing only a `blockTextComponent` renders every draft block with the base `theme.text` styles, as do block types missing from `blockTypes`. This makes the block usable before any text variants exist in the theme.

Style values in `blockTypes` don't support responsive values — define a theme variant for responsive styling, or set a `className` and register responsive CSS via `registerStyles`.

### Link types

`LINK` entities reference a link block (`{ type, props }`). The `external` link type is built in and renders as `HtmlInlineLink`. Add the application's other link types via the `linkTypes` option — a resolver per link block type that receives the link block's props and returns the href, or `undefined` to render the text without a link:

```tsx
export const MjmlRichTextBlock = createRichTextBlockRenderer({
    blockTextComponent: MjmlBlockText,
    linkTypes: {
        phone: (props) =>
            typeof props === "object" &&
            props !== null &&
            "phoneNumber" in props &&
            typeof props.phoneNumber === "string"
                ? `tel:${props.phoneNumber}`
                : undefined,
    },
});
```

Link types without a resolver render their text as plain text.

### Multiple configurations

Each factory call is independent, so an application can create differently-configured blocks and name them by use case:

```tsx
const headlineBlockTypes = {
    "header-one": { variant: "heading1" },
    "header-two": { variant: "heading2" },
};

export const MjmlHeadlineRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: MjmlBlockText, blockTypes: headlineBlockTypes });
export const HtmlHeadlineRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText, blockTypes: headlineBlockTypes });
```

### Rendering behavior

- Each draft block renders as its own text component; spacing between blocks comes from the theme's `bottomSpacing`, and the last block gets none.
- List items render flat as `<ul>` / `<ol>` inside one text component per list; nesting by draft depth isn't supported.
- Headings are styled text, not semantic `<h1>` elements, matching the text components' design.
- Empty draft blocks are skipped; when the data contains no text at all, the block renders nothing.
- Rendered elements carry `richTextBlock__text`, `richTextBlock__list`, `richTextBlock__listItem`, and `richTextBlock__link` class names for targeting with [registerStyles](./2-components-and-theme.md).
