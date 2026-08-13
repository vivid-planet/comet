---
name: comet-mail-react
description: Guide for building HTML emails with @comet/mail-react and MJML. Use whenever working on email templates, mail markup, MJML components, email styling, responsive emails, column layouts, multi-column email sections, rendering Comet CMS block data in emails, or anything involving @comet/mail-react or HTML email development — even for seemingly simple tasks like putting content side-by-side in columns, since email client compatibility is a minefield that requires specific patterns and research before implementing.
---

# Building HTML Emails with @comet/mail-react

`@comet/mail-react` lets you build responsive HTML emails using React components. Under the hood it uses [MJML](https://documentation.mjml.io/) to generate cross-client-compatible HTML.

The package is deliberately thin. It provides:

- **Typed React components for every MJML tag** (`MjmlSection`, `MjmlColumn`, `MjmlText`, `MjmlImage`, `MjmlButton`, `MjmlRaw`, …), re-exported from [`@faire/mjml-react`](https://github.com/Faire/mjml-react). Import them from `@comet/mail-react` — never from `@faire/mjml-react` directly.
- **`renderToMjml`** to turn the React tree into an MJML string.
- **Block components** (`BlocksBlock`, `ListBlock`, `OneOfBlock`, `OptionalBlock`) for rendering Comet CMS block data.
- **The `css` helper** for authoring CSS strings with editor highlighting.

There is **no theme layer and no higher-level component layer**: the mail root, shared defaults, typography and responsive CSS are owned by the project. The patterns below show how to build those.

---

## Research Before You Code

Email development is fundamentally different from web development. There is no shared rendering engine across email clients — the most constrained major client, Outlook on Windows (2007–2019), uses **Microsoft Word** to render HTML, supporting only a fraction of modern CSS. What works perfectly in a browser will often break in email clients, sometimes in surprising ways.

Before implementing any visual technique — even things that seem basic like rounded corners, background images, custom fonts, or flexbox layouts — **verify support across email clients**. Many common CSS properties are partially or fully unsupported. This isn't a "nice to have" step — it prevents hours of debugging and rework.

### Essential Resources

Keep these open during email development:

| Resource                       | What it's for                                                                    | URL                                  |
| ------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------ |
| **Can I email**                | Check CSS/HTML feature support across email clients (like caniuse.com for email) | https://www.caniemail.com/           |
| **MJML Documentation**         | Full reference for all MJML tags and their attributes                            | https://documentation.mjml.io/       |
| **Litmus Blog & Resources**    | Email development best practices, testing guides, client quirks                  | https://www.litmus.com/blog/         |
| **Campaign Monitor CSS Guide** | Comprehensive CSS support tables per email client                                | https://www.campaignmonitor.com/css/ |
| **Bulletproof Backgrounds**    | VML-based background image generator for Outlook                                 | https://www.backgrounds.cm/          |
| **Bulletproof Buttons**        | VML-based rounded button generator for Outlook                                   | https://www.buttons.cm/              |

### The Research Habit

When implementing any visual feature:

1. Check [Can I email](https://www.caniemail.com/) for the CSS properties involved
2. If the property isn't supported in Outlook, search for VML workarounds or provide a graceful fallback (skipping border-radius is generally acceptable)
3. Preview the rendered HTML (see [Development Workflow](#development-workflow)) and check the MJML validation errors
4. When uncertain, consult the Litmus blog or Campaign Monitor guide for known patterns

This applies to seemingly simple things: `border-radius`, `background-image`, `flexbox`, `gap`, custom fonts — all have partial or no support in major email clients.

---

## The MJML Layout Model

MJML enforces a strict **section → column → content** nesting hierarchy:

- **`MjmlSection`** — a full-width horizontal row
- **`MjmlColumn`** — divides a section into vertical columns (stacking on mobile by default)
- **Content components** (`MjmlText`, `MjmlImage`, `MjmlButton`, etc.) — placed inside a column

Content components placed outside this hierarchy produce MJML validation warnings and broken layouts.

```tsx
<MjmlSection>
    <MjmlColumn>
        <MjmlText fontSize={24} lineHeight="32px">
            Section title
        </MjmlText>
        <MjmlText paddingBottom={16}>Body paragraph with spacing below.</MjmlText>
        <MjmlImage src="https://example.com/image.jpg" alt="Example" />
    </MjmlColumn>
</MjmlSection>
```

Set recurring values like font family, text padding or section padding once in `MjmlAttributes` on the mail root instead of repeating them on every element — see [Mail Root and Shared Defaults](#mail-root-and-shared-defaults).

### Multi-Column Layouts

MJML has no `gap` property. Column padding reduces the content area _inside_ the column — it doesn't add space between column cells. To create a visual gap between columns, apply padding to the inner edges of adjacent columns (`paddingRight` on the left column, `paddingLeft` on the right column). Their sum becomes the visible gap.

For two equal columns, apply half the desired gap to each column's inner edge. Both columns have the same total padding, so MJML's equal-width split produces equal content areas without explicit `width` props:

```tsx
const columnGap = 20;
const halfGap = columnGap / 2;

<MjmlSection className="twoColumnsSection">
    <MjmlColumn className="twoColumnsSection__leftColumn" paddingRight={halfGap}>
        <MjmlText>Left column</MjmlText>
    </MjmlColumn>
    <MjmlColumn className="twoColumnsSection__rightColumn" paddingLeft={halfGap}>
        <MjmlText>Right column</MjmlText>
    </MjmlColumn>
</MjmlSection>;
```

**Do not** apply equal padding on all sides of every column — this adds extra outer-edge spacing that compounds with the section's own padding, pushing content inward beyond the intended margins.

On mobile, reset the gap padding so content stretches full-width, and add a vertical margin between the stacked columns. Column padding compiles to an inner `<td>`, so target it via `.className > table > tbody > tr > td`.

`className` on an MJML component compiles to MJML's `css-class` attribute, which is how these selectors find the element.

→ For complete two-column patterns (equal-width and fixed+fluid) with responsive styles, CSS targeting rules, and the `direction="rtl"` technique for controlling mobile stack order, read [`references/layout-patterns.md`](references/layout-patterns.md).

### Ending Tags

Some MJML components are [**ending tags**](https://documentation.mjml.io/#ending-tags) — they accept raw HTML as children but **cannot** contain other MJML components. The most common: `MjmlText`, `MjmlButton`, `MjmlTable`, `MjmlRaw`.

Once inside an ending tag, you are in **HTML-land for the entire subtree**. Use HTML elements (`<span>`, `<a>`, `<table>`, `<td>`) but not MJML components.

For raw HTML layouts outside text, use `MjmlRaw` (or `MjmlTable`). These are escape hatches for cases MJML components can't handle — use them as a last resort.

---

## The Styling Model

Email styling follows a **desktop-first** approach:

1. **Base/default styles are inline** — applied through MJML component props or explicit `style` attributes on HTML elements. Desktop clients like Outlook ignore `<style>` blocks entirely, so the base rendering must look correct with inline styles alone.

2. **Responsive overrides are progressive enhancement** — added as `<style>` blocks with media queries targeting mobile viewports, via `MjmlStyle` in the mail's `MjmlHead`. Clients that support media queries also support modern CSS, so properties like `flex` and CSS custom properties are safe inside media queries.

3. **`!important` is required** in media query overrides — because inline styles take precedence over `<style>` block rules, responsive overrides need `!important` to win.

Never rely on `<style>` blocks for base/desktop layout. Set all default styles inline via MJML component props.

### Keep Breakpoints in One Place

Define the project's breakpoints and body width as shared constants (or media-query strings) in one module and import them wherever they're needed, instead of retyping `@media (max-width: …)` per component. That keeps the responsive CSS of every mail in sync, the way a theme would.

```ts title="src/mail/styles/breakpoints.ts"
export const BODY_WIDTH = 600;
export const MOBILE_BREAKPOINT = 420;
export const BELOW_MOBILE = `@media (max-width: ${MOBILE_BREAKPOINT - 1}px)`;
```

→ For the `css` helper, BEM naming, and custom component patterns, read [`references/styling-and-customization.md`](references/styling-and-customization.md).

---

## Common Pitfalls

### Start Raw Content Inside a Column With `<tr>`

`mj-column` wraps every child in its own `<tr><td>` — except `MjmlRaw` content, which goes straight into the column's table unwrapped. A `<table>`, `<div>`, or `<img>` in that position ends up outside the column's table instead, and MJML reports no error. Open with a `<tr>` and put the markup in a `<td>`:

```tsx
<MjmlColumn>
    <MjmlRaw>
        <tr>
            <td>{/* your raw markup */}</td>
        </tr>
    </MjmlRaw>
</MjmlColumn>
```

`MjmlColumn` and `MjmlHero` are both affected — `MjmlSection` and `MjmlWrapper` already place their children inside a shared cell, so any root element is safe there. `MjmlDivider` supplies both the row and the cell; use it instead of a hand-written `<hr>` whenever you are in an `MjmlColumn`.

### Avoid Block-Level HTML Elements Inside Ending Tags

Don't use `<p>`, `<h1>`, `<h2>`, or other block-level HTML elements inside ending tags. They have wildly inconsistent default margins and spacing across email clients and add no rendering value in email HTML. Instead, use `<td>`, `<div>`, and `<span>` for structure, and build your typography hierarchy through `MjmlText` and `MjmlClass` presets rather than HTML semantics. If a block-level element is truly unavoidable, always reset its margins inline: `style={{ margin: 0 }}`.

### Set `mso-line-height-rule: exactly` on Every Manual `line-height`

Outlook calculates line-height using its own rules, causing unexpected vertical spacing. **Every time** you set `line-height` on a raw HTML element inside an ending tag (`MjmlRaw`, `MjmlText`, etc.), you must also set `mso-line-height-rule: exactly` as an inline style on the same element. This applies to `<span>`, `<td>`, `<div>`, or any other element where you manually control line height. Built-in MJML components handle this automatically — but any hand-written HTML needs it explicitly.

### No CSS `background-image` in Outlook

Outlook ignores `background-image` entirely. Use a VML-based workaround for Outlook support, or provide a `background-color` fallback for graceful degradation. See [Bulletproof Backgrounds](https://www.backgrounds.cm/).

### No CSS `border-radius` in Outlook

Outlook ignores `border-radius` — rounded corners render as sharp rectangles. The workaround is VML `v:roundrect` in conditional comments (`<!--[if mso]>`). See [Bulletproof Buttons](https://www.buttons.cm/) and the [Litmus VML button snippet](https://litmus.com/community/snippets/7-bulletproof-button-vml-approach).

---

## Mail Root and Shared Defaults

Every mail needs the `<mjml>` skeleton. Build it once as a project component and reuse it for every template, so body width, fonts, spacing defaults and responsive CSS are defined in a single place:

```tsx title="src/mail/components/MailRoot.tsx"
import { Mjml, MjmlAttributes, MjmlBody, MjmlClass, MjmlHead, MjmlSection, MjmlStyle, MjmlText } from "@comet/mail-react";
import { type PropsWithChildren } from "react";

import { BODY_WIDTH } from "../styles/breakpoints";
import { responsiveStyles } from "../styles/responsiveStyles";

export const MailRoot = ({ children }: PropsWithChildren) => (
    <Mjml>
        <MjmlHead>
            <MjmlAttributes>
                <MjmlText padding={0} fontFamily="Arial, sans-serif" fontSize={16} lineHeight="24px" />
                <MjmlSection padding="0 20px" />
                <MjmlClass name="heading" fontSize="24px" lineHeight="32px" fontWeight="700" />
            </MjmlAttributes>
            <MjmlStyle>{responsiveStyles}</MjmlStyle>
        </MjmlHead>
        <MjmlBody width={BODY_WIDTH} backgroundColor="#F2F2F2">
            {children}
        </MjmlBody>
    </Mjml>
);
```

- **`MjmlAttributes`** sets per-tag defaults (`<MjmlText padding={0} />` applies to every `MjmlText`), which is how you avoid repeating font and spacing props.
- **`MjmlClass`** defines named presets applied with `mjmlClass="heading"` — the closest thing to typography variants.
- **`MjmlStyle`** carries the responsive `<style>` block; pass `inline` when a declaration must also reach Outlook, which makes MJML write it into the element's `style` attribute at compile time.
- **`MjmlFont`** registers web fonts, **`MjmlPreview`** sets the preview text shown in the inbox list.

---

## Blocks

`@comet/mail-react` ships the block components needed to render Comet CMS block data in a mail. They mirror their site counterparts, so a block's data flows into the mail unchanged.

| Component       | Renders                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| `BlocksBlock`   | Each block of a blocks-block's `blocks` array through the matching entry of `supportedBlocks`, keyed by `type` |
| `ListBlock`     | Each item of a list block through a single `block` render function                                             |
| `OneOfBlock`    | The selected block of a one-of block through the matching `supportedBlocks` entry                              |
| `OptionalBlock` | The inner block of an optional block, or nothing when it is not `visible`                                      |

An unknown block type renders a placeholder `MjmlText` in development and nothing in production.

```tsx
import { BlocksBlock, type SupportedBlocks } from "@comet/mail-react";
import { type NewsletterContentBlockData } from "@src/blocks.generated";

const supportedBlocks: SupportedBlocks = {
    text: (props) => <NewsletterTextBlock data={props} />,
    image: (props) => <NewsletterImageBlock data={props} />,
};

export const NewsletterContentBlock = ({ data }: PropsWithData<NewsletterContentBlockData>) => (
    <BlocksBlock data={data} supportedBlocks={supportedBlocks} />
);
```

Type a block component's props with `PropsWithData<TBlockData>` from `@comet/mail-react`, using the generated block-data type — the same convention the site layer uses.

Blocks whose data points at DAM files (images) need a URL for the mail: build it with `generateImageUrl` from the site package and make it absolute, since a mail client has no origin to resolve a relative path against. Return `null` when the image is missing.

---

## Rendering

`renderToMjml` turns the React tree into an MJML string; `mjml2html` from the `mjml` package compiles it to the final HTML. Wrap this in one project helper so every caller handles validation errors the same way:

```tsx title="src/mail/utils/renderMailHtml.tsx"
import { renderToMjml } from "@comet/mail-react";
import mjml2html from "mjml";
import { type ReactElement } from "react";

export const renderMailHtml = (mail: ReactElement) => {
    const mjmlString = renderToMjml(mail);
    const { html, errors } = mjml2html(mjmlString, { validationLevel: "soft" });

    if (process.env.NODE_ENV === "development" && errors.length > 0) {
        console.error(`${errors.length} MJML errors`, errors);
    }

    return html;
};
```

- Use `mjml` on the server (it needs Node.js) and `mjml-browser` where there is no `fs` — for instance in Storybook.
- Keep `validationLevel: "soft"`: the HTML is still produced when the structure is technically invalid.
- **Never log MJML errors in production.** They flag structural MJML issues that are useful during development, but the rendered HTML is always produced regardless. In rare cases a specific layout intentionally requires a technically invalid structure — logging that in production spams error trackers like Sentry with noise nobody can act on.
- Wrap the content in the project's `MailRoot` — either at the call site or inside the helper.

---

## Development Workflow

There is no built-in preview, so render mails in Storybook: a decorator wraps each story, renders it to HTML and injects the result, which lets you write a template as a story and see it live.

```tsx title=".storybook/decorators/MailRenderer.decorator.tsx"
import { renderToMjml } from "@comet/mail-react";
import { type Decorator } from "@storybook/react-vite";
import mjml2html from "mjml-browser";

export const MailRendererDecorator: Decorator = (Story, context) => {
    const mjmlString = renderToMjml(
        <MailRoot>
            <Story {...context} />
        </MailRoot>,
    );
    const { html, errors } = mjml2html(mjmlString, { validationLevel: "soft" });

    if (process.env.NODE_ENV === "development" && errors.length > 0) {
        console.error(`${errors.length} MJML errors`, errors);
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
```

With the decorator in place, stories only define the mail's content. Add an `IntlProvider` inside the decorator when the mails use `react-intl`.

1. Write email templates as Storybook stories
2. Preview the rendered HTML in the Storybook canvas
3. Watch the console for MJML validation errors
4. Copy the rendered HTML into an external service to test real clients

### Cross-Client Testing

Storybook previews show how the email renders in a web browser, but email clients vary dramatically. Use services like [Litmus](https://www.litmus.com/) or [Email on Acid](https://www.emailonacid.com/) to test the rendered HTML across real email clients and devices. Note that these services cannot reach `localhost` — point image sources at publicly reachable URLs before testing there.

---

## Related Modules

The `@comet/mail-react` package focuses on building email markup. For sending emails and managing templates in a Comet project:

- **Mail Templates Module** — server-side template registration, dependency injection, and sending. Renders its templates through the project's `renderMailHtml`. Docs: https://docs.comet-dxp.com/docs/features-modules/mail-templates-module/
- **Mailer Module** — lower-level mail sending service. Docs: https://docs.comet-dxp.com/docs/features-modules/mailer-module/
