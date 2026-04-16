---
title: Layout Patterns
---

This page provides ready-to-use layout recipes that combine the concepts from [Email Basics](./1-email-basics.md), [Components and Theme](./2-components-and-theme.md), and [Customization](./4-customization.md) into complete, tested patterns.

## How Column Gaps Work in MJML

MJML has no `gap` property. Column padding reduces the **content area inside** the column — it doesn't add space between the column cells themselves. To create a visual gap between adjacent columns, apply padding to their inner edges: `paddingRight` on the left column and `paddingLeft` on the right column. The sum of the two becomes the visible gap.

Do **not** apply equal padding on all sides of every column — this adds extra spacing on the outer edges that compounds with the section's `indent` padding, pushing content inward beyond the theme's `contentIndentation`.

### CSS Targeting for Column Padding

MJML compiles column padding to an inner `<td>`, not the outer `<div>` that receives the `className`. To override column padding in responsive styles, target the inner cell:

```css
.myColumn > table > tbody > tr > td {
    padding-left: 0 !important;
}
```

Properties like `margin-bottom` that apply to the column wrapper itself use the plain class name without the table path. All responsive overrides require `!important` because MJML applies styles inline, and inline styles take precedence over `<style>` block rules.

:::tip
Use `theme.breakpoints.mobile.belowMediaQuery` (or `theme.breakpoints.default.belowMediaQuery`) instead of hardcoded media queries to keep responsive styles in sync with the theme's breakpoint configuration.
:::

## Symmetric Two-Column Layout

Two equal-width columns with a gap between them, stacking vertically on mobile.

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

On mobile, the columns stack vertically. Reset the gap padding so content stretches full-width, and add a vertical margin to replace the horizontal gap:

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

## Asymmetric Two-Column Layout

A fixed-width column paired with a fluid column that takes the remaining space. Common for image-plus-text layouts, icon rows, or sidebar patterns.

```
┌───────────────────────────────────────────────────────────┐
│ MjmlSection indent                                        │
│ ┌──────────┐ ┌──────────────────────────────────────────┐ │
│ │  120px   │ │ fluid (sectionInnerWidth - 120px)        │ │
│ │  fixed   │ │ paddingLeft={gap}                        │ │
│ └──────────┘ └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

### Why Explicit Widths Are Required

MJML does not give columns "remaining space" when some columns have widths and others don't. It always divides the container width equally among all columns (`containerWidth / numberOfColumns`). To get a fixed-plus-fluid layout, **set explicit widths on both columns** and derive the fluid column's width from the theme:

```tsx
const SMALL_COLUMN_WIDTH = 120;
const COLUMN_GAP = 20;

const sectionIndent = getDefaultFromResponsiveValue(theme.sizes.contentIndentation);
const sectionInnerWidth = theme.sizes.bodyWidth - 2 * sectionIndent;
const fluidColumnWidth = sectionInnerWidth - SMALL_COLUMN_WIDTH;
```

`getDefaultFromResponsiveValue` extracts the default (desktop/inline) value from a responsive theme property like `contentIndentation`.

### The Pattern

The gap is created by padding on the fluid column's inner edge — the same principle as the symmetric layout, just applied to one side:

```tsx
<MjmlSection indent>
    <MjmlColumn
        className="imageTextLayout__smallColumn"
        width={`${SMALL_COLUMN_WIDTH}px`}
        verticalAlign="middle"
    >
        <MjmlImage src="..." alt="..." width={SMALL_COLUMN_WIDTH} />
    </MjmlColumn>
    <MjmlColumn
        className="imageTextLayout__fluidColumn"
        width={`${fluidColumnWidth}px`}
        paddingLeft={`${COLUMN_GAP}px`}
        verticalAlign="middle"
    >
        <MjmlText>Content that fills the remaining space.</MjmlText>
    </MjmlColumn>
</MjmlSection>
```

To place the small column on the right instead, swap the column order and move the gap padding to `paddingRight` on the fluid column.

### Two-Breakpoint Responsive Behavior

Fixed-width columns create an overflow problem between the desktop `bodyWidth` and the mobile stacking breakpoint — the total fixed width can exceed the viewport. The solution uses two `belowMediaQuery` breakpoints stacked via CSS cascade order:

```ts
registerStyles(
    (theme) => css`
        ${theme.breakpoints.default.belowMediaQuery} {
            .imageTextLayout__fluidColumn {
                width: calc(100% - ${SMALL_COLUMN_WIDTH}px) !important;
                max-width: calc(100% - ${SMALL_COLUMN_WIDTH}px) !important;
            }
        }

        ${theme.breakpoints.mobile.belowMediaQuery} {
            .imageTextLayout__fluidColumn {
                width: 100% !important;
                max-width: 100% !important;
            }

            .imageTextLayout__smallColumn {
                margin-bottom: 10px;
            }

            .imageTextLayout__fluidColumn > table > tbody > tr > td {
                padding-left: 0 !important;
            }
        }
    `,
);
```

The `default.belowMediaQuery` block makes the fluid column responsive via `calc()` while keeping the two-column layout intact. The `mobile.belowMediaQuery` block (later in source order) overrides it to stack columns at full width. This cascade-based approach is the idiomatic pattern — never use hardcoded `@media (min-width: X) and (max-width: Y)` range queries.

### Controlling Mobile Stack Order

By default, MJML stacks columns in source order on mobile. If you need a column that appears on the right on desktop to stack on top on mobile (e.g., an image that should appear above the text), use `direction="rtl"` on the section to flip the visual order on desktop while keeping the desired stacking order in the source:

```tsx
<MjmlWrapper padding={`0 ${sectionIndent}px`} backgroundColor={theme.colors.background.content}>
    <MjmlSection direction="rtl">
        <MjmlColumn className="layout__smallColumn" width={`${SMALL_COLUMN_WIDTH}px`}>
            <MjmlImage src="..." alt="..." width={SMALL_COLUMN_WIDTH} />
        </MjmlColumn>
        <MjmlColumn className="layout__fluidColumn" width={`${fluidColumnWidth}px`} paddingRight={`${COLUMN_GAP}px`}>
            <MjmlText>This appears on the left on desktop, below the image on mobile.</MjmlText>
        </MjmlColumn>
    </MjmlSection>
</MjmlWrapper>
```

Two important details:

1. **`MjmlWrapper` replaces `indent`** — when using `direction="rtl"`, applying `indent` directly on the section causes a 1px line artifact in Outlook. Instead, wrap the section in `MjmlWrapper` and apply the indentation as padding. Set the `backgroundColor` on the wrapper to match the content background.
2. **Source order = mobile stack order** — the small column is first in the JSX, so it stacks on top on mobile. `direction="rtl"` only affects the visual (left-to-right) order on desktop.
