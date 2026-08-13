# Styling & Customization Reference

Deep dive into the desktop-first styling model, the `css` helper, BEM naming, and custom component patterns.

## Table of Contents

1. [Desktop-First Styling Model](#desktop-first-styling-model)
2. [The `css` Helper](#the-css-helper)
3. [Registering Responsive Styles](#registering-responsive-styles)
4. [BEM Class Naming Convention](#bem-class-naming-convention)
5. [Custom Component Pattern](#custom-component-pattern)
6. [Shared Defaults via `MjmlAttributes` and `MjmlClass`](#shared-defaults-via-mjmlattributes-and-mjmlclass)
7. [MJML Table Structure](#mjml-table-structure)

---

## Desktop-First Styling Model

Email clients that lack CSS support are almost exclusively desktop clients (Outlook 2007–2019, older Lotus Notes). Mobile email clients — Apple Mail, Gmail app, Outlook mobile — all support `<style>` blocks and media queries.

This means:

- **Desktop/default rendering** → inline styles only (MJML props compile to inline styles)
- **Mobile/responsive overrides** → `<style>` blocks with media queries, rendered through `MjmlStyle`

The base email must look correct with zero CSS from `<style>` blocks. Media queries are layered on top as progressive enhancement for mobile viewports.

### Why `!important`?

Email clients inline all styles during processing. Since inline styles have higher CSS specificity than `<style>` block rules, responsive overrides must use `!important` to win. Every property inside a media query override should have `!important`.

### When a Declaration Must Reach Outlook

Outlook on Windows ignores `<style>` blocks entirely, so a declaration that must apply there cannot live in one. Pass `inline` to `MjmlStyle` (`<MjmlStyle inline>`) and MJML writes the matching declarations into the elements' `style` attributes at compile time. Use it only for rules that genuinely need to reach Outlook — it is not a media-query mechanism, since inlined rules apply unconditionally.

---

## The `css` Helper

`css` is a tagged template literal that returns a plain string. Its only purpose is enabling CSS syntax highlighting and auto-formatting in editors (e.g., the styled-components VS Code extension):

```ts
import { css } from "@comet/mail-react";

const styles = css`
    @media (max-width: 419px) {
        .myComponent {
            padding: 12px !important;
        }
    }
`;
```

No runtime styling logic — purely a developer experience improvement.

---

## Registering Responsive Styles

There is no style registry in the package: a `<style>` block reaches the mail only when it is rendered inside `MjmlHead` via `MjmlStyle`. Keep that predictable with one convention per project:

1. Each component that needs responsive CSS exports its rules as a module-level string built with `css`.
2. The mail root imports them, concatenates them, and renders the result in a single `MjmlStyle`.

```ts title="src/mail/styles/responsiveStyles.ts"
import { calloutBoxStyles } from "../components/CalloutBox";
import { twoColumnsSectionStyles } from "../components/TwoColumnsSection";

export const responsiveStyles = [twoColumnsSectionStyles, calloutBoxStyles].join("\n");
```

```tsx
<MjmlHead>
    <MjmlStyle>{responsiveStyles}</MjmlStyle>
</MjmlHead>
```

Important details:

- Build the strings at **module level**, not inside component functions — the CSS does not depend on props.
- The rules must be in the `<head>` of every mail that renders the component. A component whose styles are not part of the root's list silently renders without its responsive behavior, so keep the list next to the root and add to it when you add a component.
- Reference the shared breakpoint constants instead of literal media queries, so all components move together.

---

## BEM Class Naming Convention

Use BEM with camelCase blocks for custom component CSS classes:

| BEM Part | Pattern                       | Example                   |
| -------- | ----------------------------- | ------------------------- |
| Block    | `componentName`               | `calloutBox`              |
| Element  | `componentName__elementName`  | `calloutBox__title`       |
| Modifier | `componentName--modifierName` | `calloutBox--highlighted` |

Set them with the `className` prop on MJML components (it compiles to MJML's `css-class` attribute) and with plain `className` on raw HTML elements.

---

## Custom Component Pattern

The complete pattern for building email-safe custom components:

1. **Inline styles** for base/desktop rendering — set via `style` props on HTML elements
2. **BEM class names** on elements that need responsive overrides
3. **A module-level `css` string** with the media queries targeting those classes, exported for the mail root
4. **`!important`** on all responsive overrides

```tsx
import { css, MjmlColumn, MjmlRaw, MjmlSection } from "@comet/mail-react";

import { BELOW_MOBILE } from "../styles/breakpoints";

interface FeatureCardProps {
    title: string;
    description: string;
    highlighted?: boolean;
}

export const FeatureCard = ({ title, description, highlighted = false }: FeatureCardProps) => {
    return (
        <MjmlSection>
            <MjmlColumn>
                <MjmlRaw>
                    <tr>
                        <td
                            className={`featureCard${highlighted ? " featureCard--highlighted" : ""}`}
                            style={{
                                padding: "24px",
                                border: "1px solid #E0E0E0",
                                borderRadius: "8px",
                                backgroundColor: highlighted ? "#F0F7FF" : "#FFFFFF",
                            }}
                        >
                            <span
                                className="featureCard__title"
                                style={{
                                    display: "block",
                                    fontSize: "20px",
                                    fontWeight: 700,
                                    lineHeight: "28px",
                                    msoLineHeightRule: "exactly",
                                    margin: "0 0 8px 0",
                                }}
                            >
                                {title}
                            </span>
                            <span
                                className="featureCard__description"
                                style={{
                                    display: "block",
                                    fontSize: "14px",
                                    lineHeight: "22px",
                                    msoLineHeightRule: "exactly",
                                    color: "#555555",
                                }}
                            >
                                {description}
                            </span>
                        </td>
                    </tr>
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    );
};

export const featureCardStyles = css`
    ${BELOW_MOBILE} {
        .featureCard {
            padding: 16px !important;
        }
        .featureCard__title {
            font-size: 18px !important;
            line-height: 24px !important;
        }
        .featureCard__description {
            font-size: 13px !important;
        }
    }
`;
```

### Key Reminders

- Inside `MjmlRaw` and other ending tags, you're in HTML-land — only HTML elements, no MJML components
- Raw content directly inside an `MjmlColumn` must start with `<tr>` — see the pitfalls section in [`../SKILL.md`](../SKILL.md#common-pitfalls)
- Always reset margins on block-level elements: `style={{ margin: 0 }}`
- **Every element with a manual `line-height`** must also have `mso-line-height-rule: exactly` as an inline style — Outlook ignores standard line-height calculations and produces unexpected vertical spacing without it. This is easy to forget on `<span>` and `<td>` elements inside custom components.
- `borderRadius` won't render in Outlook — provide a visually acceptable fallback

---

## Shared Defaults via `MjmlAttributes` and `MjmlClass`

Without a theme layer, recurring values belong in the mail root's `MjmlAttributes` rather than on every element:

```tsx
<MjmlAttributes>
    {/* per-tag defaults: applies to every MjmlText in the mail */}
    <MjmlText padding={0} fontFamily="Arial, sans-serif" fontSize={16} lineHeight="24px" color="#222222" />
    <MjmlSection padding="0 20px" />
    {/* named presets, applied with mjmlClass="heading" */}
    <MjmlClass name="heading" fontSize="24px" lineHeight="32px" fontWeight="700" />
    <MjmlClass name="caption" fontSize="12px" lineHeight="18px" color="#777777" />
</MjmlAttributes>
```

```tsx
<MjmlText mjmlClass="heading">Section title</MjmlText>
```

`MjmlClass` props are MJML attributes, so their values are strings (`fontSize="24px"`, not `fontSize={24}`). `MjmlAll` sets a default for every tag at once — use it sparingly, it is easy to make surprising.

These are compile-time defaults: they end up inline, which is exactly what desktop clients need. Reach for a `<style>` block only for the responsive layer.

---

## MJML Table Structure

MJML generates table-based HTML. When targeting nested elements inside MJML components via CSS, you may need to traverse the generated table structure:

```css
.twoColumnsSection__leftColumn > table > tbody > tr > td {
    /* targets the actual content cell */
}
```

Inspect the rendered HTML in the browser (see the Storybook workflow in [`../SKILL.md`](../SKILL.md#development-workflow)) when writing CSS selectors. The exact nesting varies by component and shouldn't be assumed — always inspect first.
