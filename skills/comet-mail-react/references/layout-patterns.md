# Layout Patterns

All examples assume the project keeps its layout constants and media-query strings in one module (see the styling model in [`../SKILL.md`](../SKILL.md#keep-breakpoints-in-one-place)) and renders its responsive CSS through `MjmlStyle` in the mail root:

```ts title="src/mail/styles/breakpoints.ts"
export const BODY_WIDTH = 600;
export const CONTENT_INDENT = 20;
export const BELOW_BODY_WIDTH = `@media (max-width: ${BODY_WIDTH - 1}px)`;
export const BELOW_MOBILE = "@media (max-width: 419px)";
```

`BELOW_BODY_WIDTH` is the intermediate step — the viewport is narrower than the mail body but the columns are still side by side. `BELOW_MOBILE` is where MJML itself stops laying columns out horizontally.

## How Column Gaps Work

MJML has no `gap` property. Column padding reduces the content area _inside_ the column — it doesn't create space between column cells. To create a visible gap, apply padding to the inner edges of adjacent columns: `paddingRight` on the left column and `paddingLeft` on the right column. Their sum becomes the gap.

**Do not** apply equal padding on all sides of every column. This adds extra outer-edge spacing that compounds with the section's own padding, pushing content inward.

### CSS Targeting Rules

- **`className`** on an MJML component compiles to MJML's `css-class` attribute — that is what puts the class into the generated HTML.
- **Column padding** compiles to an inner `<td>`, not the outer `<div>` that receives the class. Override padding via `.className > table > tbody > tr > td`.
- **`margin-bottom`/`margin-top`** goes on the column wrapper itself (the outer `<div>`), so use the plain `.className` selector without the table path.
- **`!important`** is required on all responsive overrides — MJML inlines styles that take precedence over `<style>` block rules.
- Use the shared media-query constants rather than retyping `@media (max-width: …)` per component.

### BEM Class Naming

Follow the BEM convention with camelCase blocks. Adapt the block name to the component context:

| Element                | Example class name                                               |
| ---------------------- | ---------------------------------------------------------------- |
| Section/layout wrapper | `twoColumnsSection`, `imageTextLayout`                           |
| Left/small column      | `twoColumnsSection__leftColumn`, `imageTextLayout__smallColumn`  |
| Right/fluid column     | `twoColumnsSection__rightColumn`, `imageTextLayout__fluidColumn` |

---

## Symmetric Two-Column Layout (Equal Width)

Two equal-width columns with a gap between them, stacking vertically on mobile.

### Pattern

Apply half the gap to each column's inner edge. Both columns have the same total padding, so MJML's default equal-width split produces equal content areas without explicit `width` props:

```tsx
const COLUMN_GAP = 20;
const halfGap = COLUMN_GAP / 2;

const TwoColumnsSection = () => (
    <MjmlSection className="twoColumnsSection">
        <MjmlColumn className="twoColumnsSection__leftColumn" paddingRight={halfGap}>
            <MjmlText>Left column content.</MjmlText>
        </MjmlColumn>
        <MjmlColumn className="twoColumnsSection__rightColumn" paddingLeft={halfGap}>
            <MjmlText>Right column content.</MjmlText>
        </MjmlColumn>
    </MjmlSection>
);
```

### Responsive Stacking

On mobile, columns stack vertically. Reset the gap padding so content stretches full-width, and add a vertical margin between the stacked columns:

```ts title="src/mail/styles/responsiveStyles.ts"
import { css } from "@comet/mail-react";

import { BELOW_MOBILE } from "./breakpoints";

export const responsiveStyles = css`
    ${BELOW_MOBILE} {
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
`;
```

Render that string once through `<MjmlStyle>` in the mail root. When several components contribute styles, keep one exported string per component and concatenate them in the root — the rules must reach the `<head>` of every mail that uses them.

For three or more equal-width columns, see [Multi-Column Symmetric Layouts](#multi-column-symmetric-layouts-3-columns).

---

## Multi-Column Symmetric Layouts (3+ columns)

Three or more equal-width columns need explicit `width` props because inner columns carry padding on both sides and outer columns on only one. Without compensation, content areas are unequal.

### N-Column Width Formula

```ts
const COLUMN_GAP = 20;
const halfColumnGap = COLUMN_GAP / 2;
const availableContentWidth = BODY_WIDTH - 2 * CONTENT_INDENT;
const contentWidthPerColumn = (availableContentWidth - (numberOfColumns - 1) * COLUMN_GAP) / numberOfColumns;

const outerColumnWidth = `${((contentWidthPerColumn + halfColumnGap) / availableContentWidth) * 100}%`;
const innerColumnWidth = `${((contentWidthPerColumn + COLUMN_GAP) / availableContentWidth) * 100}%`;
```

- Outermost columns → `outerColumnWidth`, padding on their inner side only
- All middle columns → `innerColumnWidth`, padding on both sides (`halfColumnGap` each)

Scales to any N; 3 and 4 differ only in how many middle columns you repeat. Percentages — not pixels — keep MJML's fallback math predictable.

### Pattern

Three columns shown; for four or more, repeat the middle-column.

```tsx
<MjmlSection className="multiColumnSection">
    <MjmlColumn className="multiColumnSection__column" width={outerColumnWidth} paddingRight={halfColumnGap}>
        …
    </MjmlColumn>
    <MjmlColumn className="multiColumnSection__column" width={innerColumnWidth} paddingLeft={halfColumnGap} paddingRight={halfColumnGap}>
        …
    </MjmlColumn>
    <MjmlColumn className="multiColumnSection__column" width={outerColumnWidth} paddingLeft={halfColumnGap}>
        …
    </MjmlColumn>
</MjmlSection>
```

### Responsive Stacking — Pick Per Layout

Stacking is a **design decision per component**, not a function of column count. These are starting points, not rules. If it is unclear which strategy fits, infer from the content (dense text vs. short labels vs. fixed-width icons/numbers) or ask.

| Strategy           | When to pick it                                                             | How it's implemented                                                        |
| ------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| A. Stack at mobile | Columns stay readable while narrowing below `BODY_WIDTH` (typical for 3)    | Flex reset at `BELOW_BODY_WIDTH` + stack at `BELOW_MOBILE`                  |
| B. Stack early     | Columns would get too cramped below `BODY_WIDTH` (typical for 4 or more)    | Flex reset that stacks already at `BELOW_BODY_WIDTH`                        |
| C. Never stack     | Short fixed content that must remain horizontal (numeric rows, icon strips) | `MjmlGroup` around the columns + flex reset one level deeper (`> td > div`) |

All three strategies share the same flex reset on the element that directly contains the columns — it neutralises the compensated inline widths so content areas stay equal at every viewport (without it, percentage widths and pixel paddings drift apart below `BODY_WIDTH`, making columns unequal by a few pixels). For A and B the container is the section's inner `<td>`; for C it is the `MjmlGroup` `<div>` between the `<td>` and the columns, so the selector goes one level deeper (`… > td > div`). They also differ at `BELOW_MOBILE`: A adds a stack override, B collapses into the `BELOW_BODY_WIDTH` block and stacks immediately, C adds nothing. Strategy C needs the `MjmlGroup` because MJML auto-stacks columns below its own mobile breakpoint — `mj-group` keeps them side by side even in clients that ignore the flex CSS.

**Strategy A** — keep the horizontal intermediate state, stack at mobile:

```ts
${BELOW_BODY_WIDTH} {
    .multiColumnSection > table > tbody > tr > td {
        display: flex !important;
        gap: 20px !important;
    }
    .multiColumnSection__column {
        flex: 1 1 0% !important;
        width: auto !important;
        max-width: none !important;
        display: block !important;
    }
    .multiColumnSection__column > table > tbody > tr > td {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}

${BELOW_MOBILE} {
    .multiColumnSection > table > tbody > tr > td {
        flex-direction: column !important;
    }
    .multiColumnSection__column {
        flex: none !important;
        width: 100% !important;
        max-width: 100% !important;
    }
}
```

**Strategy B** — collapse the two blocks: put `flex-direction: column` and `width: 100%` in the `BELOW_BODY_WIDTH` block and drop the `BELOW_MOBILE` block.

**Strategy C** — wrap the columns in `MjmlGroup` and apply Strategy A's flex reset one level deeper, dropping the `BELOW_MOBILE` block:

```tsx
<MjmlSection className="multiColumnSection">
    <MjmlGroup>{/* …columns as in the pattern above… */}</MjmlGroup>
</MjmlSection>
```

```ts
${BELOW_BODY_WIDTH} {
    .multiColumnSection > table > tbody > tr > td > div {
        display: flex !important;
        gap: 20px !important;
    }
    .multiColumnSection__column {
        flex: 1 1 0% !important;
        width: auto !important;
        max-width: none !important;
        display: block !important;
    }
    .multiColumnSection__column > table > tbody > tr > td {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}
```

The only difference from Strategy A's block is the `> div` in the first selector — `MjmlGroup` renders a `<div>` inside the `<td>`, so the flex container has to target that wrapper instead of the `<td>` to make the columns its direct flex children. Applying flex to the `<td>` instead would give it a single flex item (the wrapper), and the block-display rule on the columns below would make them stack vertically inside it.

---

## Asymmetric Two-Column Layout (Fixed + Fluid)

A fixed-width column paired with a fluid column that takes the remaining space.

### Width Computation

MJML does not give columns "remaining space" — it always divides equally (`containerWidth / numberOfColumns`). Set explicit widths on **both** columns:

```tsx
const SMALL_COLUMN_WIDTH = 120;
const COLUMN_GAP = 20;

const sectionInnerWidth = BODY_WIDTH - 2 * CONTENT_INDENT;
const fluidColumnWidth = sectionInnerWidth - SMALL_COLUMN_WIDTH;
```

### Pattern

Gap is created by padding on the fluid column's inner edge:

```tsx
<MjmlSection>
    <MjmlColumn className="imageTextLayout__smallColumn" width={`${SMALL_COLUMN_WIDTH}px`} verticalAlign="middle">
        <MjmlImage src="..." alt="..." width={SMALL_COLUMN_WIDTH} />
    </MjmlColumn>
    <MjmlColumn className="imageTextLayout__fluidColumn" width={`${fluidColumnWidth}px`} paddingLeft={`${COLUMN_GAP}px`} verticalAlign="middle">
        <MjmlText>Content that fills the remaining space.</MjmlText>
    </MjmlColumn>
</MjmlSection>
```

To place the small column on the right, swap column order and move padding to `paddingRight` on the fluid column.

### Two-Breakpoint Responsive Behavior

Fixed-width columns overflow between `BODY_WIDTH` and the mobile stacking breakpoint. Use two stacked blocks — the later one overrides the earlier via cascade order:

```ts
export const imageTextLayoutStyles = css`
    ${BELOW_BODY_WIDTH} {
        .imageTextLayout__fluidColumn {
            width: calc(100% - ${SMALL_COLUMN_WIDTH}px) !important;
            max-width: calc(100% - ${SMALL_COLUMN_WIDTH}px) !important;
        }
    }

    ${BELOW_MOBILE} {
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
`;
```

This cascade-based approach is the idiomatic pattern. Never use hardcoded `@media (min-width: X) and (max-width: Y)` range queries — stacking max-width blocks achieves the same result with fewer moving parts.

### Controlling Mobile Stack Order with `direction="rtl"`

MJML stacks columns in source order on mobile. To make a right-side column stack on top, use `direction="rtl"` on the section to flip the desktop visual order while keeping the source (and mobile stacking) order:

```tsx
<MjmlWrapper padding={`0 ${CONTENT_INDENT}px`} backgroundColor="#ffffff">
    <MjmlSection direction="rtl" padding={0}>
        <MjmlColumn className="layout__smallColumn" width={`${SMALL_COLUMN_WIDTH}px`}>
            <MjmlImage src="..." alt="..." width={SMALL_COLUMN_WIDTH} />
        </MjmlColumn>
        <MjmlColumn className="layout__fluidColumn" width={`${fluidColumnWidth}px`} paddingRight={`${COLUMN_GAP}px`}>
            <MjmlText>Appears on the left on desktop, below the image on mobile.</MjmlText>
        </MjmlColumn>
    </MjmlSection>
</MjmlWrapper>
```

When using `direction="rtl"`:

- **Move the horizontal indentation to an `MjmlWrapper`** — padding on a `direction="rtl"` section causes a 1px line artifact in Outlook. Wrap the section in `MjmlWrapper` with the horizontal padding, set the wrapper's `backgroundColor` to match, and drop the section's own padding.
- **Source order = mobile stack order** — the small column is first in the JSX, so it stacks on top on mobile. `direction="rtl"` only affects the visual left-to-right order on desktop.

---

## Grouping Sections with a Shared Background

When multiple sections need to share a background — for example, a multi-row footer with its own color — wrap them in `MjmlWrapper`. The wrapper owns the background; inner `MjmlSection`s must not set their own `backgroundColor` so the wrapper's color shows through.

```tsx
<MjmlWrapper backgroundColor="#2d4a6e">
    <MjmlSection>
        <MjmlColumn>
            <MjmlText color="#ffffff">Footer row 1</MjmlText>
        </MjmlColumn>
    </MjmlSection>
    <MjmlSection>
        <MjmlColumn>
            <MjmlText color="#ffffff">Footer row 2</MjmlText>
        </MjmlColumn>
    </MjmlSection>
</MjmlWrapper>
```

Key behaviors:

- An explicit `backgroundColor` on an inner `MjmlSection` still wins — use that only when a single section inside the wrapper needs to stand out.
- A region that also needs a different default text color is not a wrapper concern: set the color on the text components, or give them a shared `mjmlClass` preset defined in `MjmlAttributes`.
