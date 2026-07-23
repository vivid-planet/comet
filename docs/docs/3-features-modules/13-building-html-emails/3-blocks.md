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

The `createRichTextBlock` factory creates components that render `RichTextBlockData` (draft-js raw content) from the CMS. It returns one component for the MJML context and one for raw HTML, both driven by the same configuration.

| Component           | Renders each draft block as | Use within                                                                        |
| ------------------- | --------------------------- | --------------------------------------------------------------------------------- |
| `MjmlRichTextBlock` | `MjmlText`                  | an `MjmlColumn` (standard MJML layout model)                                      |
| `HtmlRichTextBlock` | `HtmlText` (`<div>`)        | raw HTML or [MJML ending tags](./1-email-basics.md#ending-tags) such as `MjmlRaw` |

Call the factory once — at the top level of a file, not inside a component — and export the returned components:

```tsx title="src/emails/blocks/richText.ts"
import { createRichTextBlock } from "@comet/mail-react";

export const { MjmlRichTextBlock, HtmlRichTextBlock } = createRichTextBlock({
    blockTypes: {
        "header-one": { variant: "heading1" },
        "header-two": { variant: "heading2" },
        "paragraph-standard": { variant: "body" },
    },
});
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

The factory works without any configuration: `createRichTextBlock()` renders every draft block with the base `theme.text` styles, as do block types missing from `blockTypes`. This makes the block usable before any text variants exist in the theme.

Style values in `blockTypes` don't support responsive values — define a theme variant for responsive styling, or set a `className` and register responsive CSS via `registerStyles`.

### Link types

`LINK` entities reference a link block (`{ type, props }`). The `external` link type is built in and renders as `HtmlInlineLink`. Add the application's other link types via the `linkTypes` option — a resolver per link block type that receives the link block's props and returns the `href`, or `undefined` to render the text without a link. Annotate each resolver's parameter with the application's generated block-data type so the props are typed without redeclaring their shape:

```tsx
import type { PhoneLinkBlockData } from "@src/blocks.generated";

export const { MjmlRichTextBlock, HtmlRichTextBlock } = createRichTextBlock({
    linkTypes: {
        phone: (props: PhoneLinkBlockData) => (props.phone ? `tel:${props.phone}` : undefined),
    },
});
```

Link types without a resolver render their text as plain text.

### Inline styles

Inline style ranges (`BOLD`, `ITALIC`, `SUB`, `SUP`, `STRIKETHROUGH`) render with built-in renderers. The `inline` option maps a draft-js inline style name to a renderer and merges over those built-ins, so you can override one while the others keep their defaults:

```tsx
export const { MjmlRichTextBlock, HtmlRichTextBlock } = createRichTextBlock({
    inline: {
        BOLD: (children, { key }) => (
            <strong key={key} style={{ fontWeight: "bold", color: "#cc0000" }}>
                {children}
            </strong>
        ),
    },
});
```

The same option renders **custom** inline styles an application adds to its RTE via `customInlineStyles` on `IRteOptions` (see `@comet/admin-rte`). The style name you configure there — for example `HIGHLIGHT` — is stored verbatim in the content's inline style ranges but carries no styling of its own, so the email defines how it looks:

```tsx
export const { MjmlRichTextBlock, HtmlRichTextBlock } = createRichTextBlock({
    inline: {
        HIGHLIGHT: (children, { key }) => (
            <span key={key} style={{ backgroundColor: "#ff0000", color: "#ffffff" }}>
                {children}
            </span>
        ),
    },
});
```

:::note
Register the renderer under the exact style name used in the RTE. Prefer inline HTML elements known to render across email clients — `<span>`, `<strong>`, `<em>` — and set explicit styles rather than relying on a tag's defaults, which email clients apply inconsistently.
:::

### Multiple configurations

Each factory call is independent, so an application can create differently-configured pairs and name them by use case:

```tsx
export const {
    MjmlRichTextBlock: MjmlHeadlineRichTextBlock,
    HtmlRichTextBlock: HtmlHeadlineRichTextBlock,
} = createRichTextBlock({
    blockTypes: {
        "header-one": { variant: "heading1" },
        "header-two": { variant: "heading2" },
    },
});
```

### Rendering behavior

- Each draft block renders as its own text component; spacing between blocks comes from the theme's `bottomSpacing`, and the last block gets none.
- List items render flat as `<ul>` / `<ol>` inside one text component per list; nesting by draft depth isn't supported.
- Headings are styled text, not semantic `<h1>` elements, matching the text components' design.
- Empty draft blocks are skipped; when the data contains no text at all, the block renders nothing.
- Rendered elements carry `richTextBlock__text`, `richTextBlock__list`, `richTextBlock__listItem`, and `richTextBlock__link` class names for targeting with [registerStyles](./2-components-and-theme.md).

## Tip-Tap rich-text blocks

`createTipTapRichTextBlock` is the Tip-Tap sibling of `createRichTextBlock`, rendering `TipTapRichTextBlockData` (Tip-Tap/ProseMirror JSON) from the CMS `TipTapRichTextBlock`. It returns the same kind of `Mjml`/`Html` pair, configured the same way:

```tsx title="src/emails/blocks/tipTapRichText.ts"
import { createTipTapRichTextBlock } from "@comet/mail-react";

export const { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock } = createTipTapRichTextBlock({
    blockTypes: {
        "heading-1": { variant: "heading1" },
        "heading-2": { variant: "heading2" },
        paragraph: { variant: "body" },
    },
});
```

```tsx
<MjmlSection indent>
    <MjmlColumn>
        <MjmlTipTapRichTextBlock data={tipTapRichTextData} />
    </MjmlColumn>
</MjmlSection>
```

### Block type and text-block-style configuration

`blockTypes` maps the Tip-Tap text block types (`paragraph`, `heading-1`…`heading-6`, `unordered-list`, `ordered-list`) to text-component styling, the same way `createRichTextBlock`'s `blockTypes` does for draft block types.

`textBlockStyles` maps the application's `textBlockStyle` attribute values — set on paragraph and heading nodes via the CMS block's own `textBlockStyles` option — to styling, and wins over the matching `blockTypes` entry when both apply to the same node:

```tsx
export const { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock } = createTipTapRichTextBlock({
    blockTypes: { paragraph: { variant: "body" } },
    textBlockStyles: { small: { variant: "caption" } },
});
```

`textBlockStyle` is ignored for paragraphs nested inside list items, since the whole list renders as one text component.

### Link types

Identical to `createRichTextBlock`'s `linkTypes`: a resolver per link block type, merged over the built-in `external` type, applied to `link` marks. Link types without a resolver render their text without a link.

### Marks and inline styles

Tip-Tap marks map through two distinct options, since Tip-Tap tracks structural marks and application-defined inline styles separately:

- `marks` maps a mark's `type` (e.g. `bold`) to a renderer, merged over the built-ins (`bold`, `italic`, `strike`, `superscript`, `subscript`).
- `inlineStyles` maps the `inlineStyle` mark's `attrs.type` value — the application-defined inline style names configured via the CMS block's own `inlineStyles` option — to a renderer. This option has **no built-ins**: an unconfigured inline style renders its text unchanged, since only the application knows what it should look like.

```tsx
export const { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock } = createTipTapRichTextBlock({
    inlineStyles: {
        highlight: (children, { key }) => (
            <span key={key} style={{ backgroundColor: "#ff0000", color: "#ffffff" }}>
                {children}
            </span>
        ),
    },
});
```

### Rendering behavior

- Each top-level Tip-Tap node renders as its own text component; spacing comes from the theme's `bottomSpacing`, and the last node gets none. Empty top-level nodes are skipped.
- Lists render flat: one text component per top-level list, with nested lists (recommend `listLevelMax: 1` on the CMS block) flattened into sibling `<li>`s and multiple paragraphs within one list item joined with `<br/>`.
- Headings are styled text, not semantic `<h1>` elements, matching the draft-js block and the text components' design.
- `placeholder` nodes render their literal `{{name}}` text — recipient substitution happens downstream (e.g. in the ESP).
- `cmsBlock`/`cmsInlineBlock` nodes are skipped silently; rendering the CMS block's embedded child blocks in email is out of scope.
- Rendered elements carry `tipTapRichTextBlock__text`, `tipTapRichTextBlock__list`, `tipTapRichTextBlock__listItem`, and `tipTapRichTextBlock__link` class names — distinct from the draft-js block's classes — for targeting with [registerStyles](./2-components-and-theme.md).
