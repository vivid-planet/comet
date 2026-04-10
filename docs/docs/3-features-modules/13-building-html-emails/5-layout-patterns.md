---
title: Layout Patterns
---

This page provides ready-to-use layout recipes that combine the concepts from [Email Basics](./1-email-basics.md), [Components and Theme](./2-components-and-theme.md), and [Customization](./4-customization.md) into complete, tested patterns.

## Two-Column Layout

The most common multi-column pattern: two equal-width columns with a gap between them, stacking vertically on mobile.

### How Column Gaps Work in MJML

MJML has no `gap` property. Column padding reduces the **content area inside** the column — it doesn't add space between the column cells themselves. To create a visual gap between adjacent columns, apply padding to their inner edges: `paddingRight` on the left column and `paddingLeft` on the right column. The sum of the two becomes the visible gap.

```
┌───────────────────────────────────────────────────────────┐
│ MjmlSection indent                                        │
│ ┌──────────────────────────┐ ┌──────────────────────────┐ │
│ │ MjmlColumn               │ │ MjmlColumn               │ │
│ │ paddingRight={halfGap}   │ │ paddingLeft={halfGap}    │ │
│ │                          │ │                          │ │
│ │  content area            │ │  content area            │ │
│ │                          │ │                          │ │
│ └──────────────────────────┘ └──────────────────────────┘ │
│                        ←── gap ──→                        │
└───────────────────────────────────────────────────────────┘
```

Do **not** apply equal padding on all sides of every column — this adds extra spacing on the outer edges that compounds with the section's `indent` padding, pushing content inward beyond the theme's `contentIndentation`.

### The Pattern

For two equal columns, apply half the desired gap to each column's inner edge. Both columns have the same total padding (half the gap on one side), so MJML's default equal-width distribution produces equal content areas — no explicit `width` props are needed:

```tsx
const TwoColumnsSection = () => {
    const columnGap = 20;
    const halfGap = columnGap / 2;

    return (
        <MjmlSection indent className="twoColumnsSection">
            <MjmlColumn className="twoColumnsSection__leftColumn" paddingRight={halfGap}>
                <MjmlText>Left column content.</MjmlText>
            </MjmlColumn>
            <MjmlColumn className="twoColumnsSection__rightColumn" paddingLeft={halfGap}>
                <MjmlText>Right column content.</MjmlText>
            </MjmlColumn>
        </MjmlSection>
    );
};
```

### Responsive Stacking

On mobile, the columns stack vertically. The gap padding must be reset so content stretches full-width, and a vertical margin replaces the horizontal gap:

```ts
registerStyles(
    (theme) => css`
        ${theme.breakpoints.mobile.belowMediaQuery} {
            .twoColumnsSection__leftColumn > table > tbody > tr > td {
                padding-right: 0 !important;
            }

            .twoColumnsSection__rightColumn > table > tbody > tr > td {
                padding-left: 0 !important;
            }

            .twoColumnsSection__leftColumn {
                margin-bottom: 20px;
            }
        }
    `,
);
```

Three things to note:

1. **Target the inner `<td>`** for padding overrides — MJML compiles column padding to an inner `<td>`, not the outer `<div>` that receives the `className`. Use the selector `.className > table > tbody > tr > td` to reach it.
2. **`!important` is required** — inline styles set by MJML take precedence over `<style>` block rules.
3. **`margin-bottom` on the outer element** — this goes on the column wrapper itself (not the inner `<td>`), so the plain `.twoColumnsSection__leftColumn` selector is correct here.

:::tip
Use `theme.breakpoints.mobile.belowMediaQuery` instead of a hardcoded media query to keep responsive styles in sync with the theme's breakpoint configuration.
:::
