# Layout Patterns

## How Column Gaps Work

MJML has no `gap` property. Column padding reduces the content area _inside_ the column — it doesn't create space between column cells. To create a visible gap, apply padding to the inner edges of adjacent columns: `paddingRight` on the left column and `paddingLeft` on the right column. Their sum becomes the gap.

**Do not** apply equal padding on all sides of every column. This adds extra outer-edge spacing that compounds with `indent`/`contentIndentation`, pushing content inward.

### CSS Targeting Rules

- **Column padding** compiles to an inner `<td>`, not the outer `<div>` that receives `className`. Override padding via `.className > table > tbody > tr > td`.
- **`margin-bottom`/`margin-top`** goes on the column wrapper itself (the outer `<div>`), so use the plain `.className` selector without the table path.
- **`!important`** is required on all responsive overrides — MJML inlines styles that take precedence over `<style>` block rules.
- Prefer `theme.breakpoints.mobile.belowMediaQuery` and `theme.breakpoints.default.belowMediaQuery` over hardcoded media queries.

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

On mobile, columns stack vertically. Reset the gap padding so content stretches full-width, and add a vertical margin between the stacked columns:

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

---

## Asymmetric Two-Column Layout (Fixed + Fluid)

A fixed-width column paired with a fluid column that takes the remaining space.

### Width Computation

MJML does not give columns "remaining space" — it always divides equally (`containerWidth / numberOfColumns`). Set explicit widths on **both** columns. Derive the fluid width from the theme:

```tsx
const SMALL_COLUMN_WIDTH = 120;
const COLUMN_GAP = 20;

const sectionIndent = getDefaultFromResponsiveValue(theme.sizes.contentIndentation);
const sectionInnerWidth = theme.sizes.bodyWidth - 2 * sectionIndent;
const fluidColumnWidth = sectionInnerWidth - SMALL_COLUMN_WIDTH;
```

`getDefaultFromResponsiveValue` extracts the default (desktop/inline) value from a responsive theme property like `contentIndentation`.

### Pattern

Gap is created by padding on the fluid column's inner edge:

```tsx
<MjmlSection indent>
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

Fixed-width columns overflow between `bodyWidth` and the mobile stacking breakpoint. Use two stacked `belowMediaQuery` blocks — the later one overrides the earlier via cascade order:

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

This cascade-based approach is the idiomatic pattern. Never use hardcoded `@media (min-width: X) and (max-width: Y)` range queries — stacking `belowMediaQuery` blocks achieves the same result while staying in sync with the theme.

### Controlling Mobile Stack Order with `direction="rtl"`

MJML stacks columns in source order on mobile. To make a right-side column stack on top, use `direction="rtl"` on the section to flip the desktop visual order while keeping the source (and mobile stacking) order:

```tsx
<MjmlWrapper padding={`0 ${sectionIndent}px`} backgroundColor={theme.colors.background.content}>
    <MjmlSection direction="rtl">
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

- **Use `MjmlWrapper` instead of `indent`** — applying `indent` on a `direction="rtl"` section causes a 1px line artifact in Outlook. Wrap the section in `MjmlWrapper` with `padding={`0 ${sectionIndent}px`}` and set `backgroundColor` to match.
- **Source order = mobile stack order** — the small column is first in the JSX, so it stacks on top on mobile. `direction="rtl"` only affects the visual left-to-right order on desktop.
